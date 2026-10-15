#!/usr/bin/env python3
"""Liste der Zusatzbeitragssätze aller gesetzlichen Krankenkassen (GKV-Spitzenverband, § 242 Abs. 5 SGB V).

Usage : python3 scripts/fetch-kassen.py [--offline DOSSIER]

- lit les pages paginées https://www.gkv-spitzenverband.de/service/krankenkassenliste/krankenkassen.jsp?pageNo=N
  (la liste officielle « tagesaktuell », 15 caisses par page) ;
- écrit src/data/kassen.json (état courant) et src/data/kassen-abruf.json (date de lecture) ;
- ajoute chaque changement de taux, chaque caisse nouvelle ou disparue à src/data/kassen-historie.json
  (historique cumulé, jamais réécrit) ;
- refuse d'écrire si la lecture paraît incomplète (moins de 80 caisses, ou plus de 15 % de caisses
  disparues d'un coup) : la version précédente reste en place et le script sort en erreur.

Aucune clé, aucun compte : la page est publique. Lancé chaque jour par .github/workflows/deploy.yml.
"""
import datetime as dt
import html
import json
import os
import re
import sys
import time
import unicodedata
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data")
BASE = "https://www.gkv-spitzenverband.de/service/krankenkassenliste/krankenkassen.jsp"
UA = "Mozilla/5.0 (compatible; zusatzbeitragrechner-datenabruf/1.0; +https://zusatzbeitragrechner.de/de/methodik/)"

LAENDER = {
    "Baden-Württemberg": "BW", "Bayern": "BY", "Berlin": "BE", "Brandenburg": "BB", "Bremen": "HB",
    "Hamburg": "HH", "Hessen": "HE", "Mecklenburg-Vorpommern": "MV", "Niedersachsen": "NI",
    "Nordrhein-Westfalen": "NW", "Rheinland-Pfalz": "RP", "Saarland": "SL", "Sachsen": "SN",
    "Sachsen-Anhalt": "ST", "Schleswig-Holstein": "SH", "Thüringen": "TH",
}


def lesen(url: str, offline: str | None, n: int) -> str:
    if offline:
        return open(os.path.join(offline, f"p{n}.html"), encoding="utf-8", errors="replace").read()
    for versuch in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "de-DE"})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:  # noqa: BLE001
            if versuch == 2:
                raise
            time.sleep(5 * (versuch + 1))
    raise RuntimeError("unreachable")


def text(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s).replace("\xad", "")
    return re.sub(r"\s+", " ", s).strip()


def slug(name: str) -> str:
    s = unicodedata.normalize("NFKD", name.replace("ß", "ss").replace("&", " und ").replace("+", " und "))
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


ROW = re.compile(r'<tr>\s*<th scope="row">(.*?)</th>\s*<td class="alignRight">(.*?)</td>\s*<td>(.*?)</td>', re.S)


def seite(s: str):
    out = []
    for m in ROW.finditer(s):
        name = text(m.group(1))
        roh = text(m.group(2))
        gm = re.match(r"^(\d+),(\d+)\s*%$", roh)
        zb = float(f"{gm.group(1)}.{gm.group(2)}") if gm else None
        offen = text(m.group(3))
        if offen == "bundesweit":
            art, laender = "bundesweit", sorted(LAENDER.values())
        elif offen.startswith("betriebsbezogen"):
            art, laender = "betrieblich", []
        elif offen.startswith("branchenbezogen"):
            art, laender = "branche", []
        else:
            namen = [x.strip() for x in offen.split(",")]
            unbekannt = [x for x in namen if x not in LAENDER]
            if unbekannt:
                raise SystemExit(f"Bundesland unbekannt bei {name}: {unbekannt}")
            art, laender = "regional", sorted(LAENDER[x] for x in namen)
        out.append({"id": slug(name), "name": name, "zb": zb, "zb_text": roh, "art": art, "laender": laender})
    return out


def main() -> int:
    offline = sys.argv[sys.argv.index("--offline") + 1] if "--offline" in sys.argv else None
    erste = lesen(BASE, offline, 1)
    stand = re.search(r"(\d+) Ergebnisse \(Stand: (\d\d)\.(\d\d)\.(\d{4})\)", text(erste))
    if not stand:
        print("Kein Stand-Datum auf der Seite gefunden: Aufbau geändert?", file=sys.stderr)
        return 1
    anzahl = int(stand.group(1))
    stand_iso = f"{stand.group(4)}-{stand.group(3)}-{stand.group(2)}"
    seiten = max(int(x) for x in re.findall(r"pageNo=(\d+)", erste))
    kassen = seite(erste)
    for n in range(2, seiten + 1):
        kassen += seite(lesen(f"{BASE}?pageNo={n}", offline, n))
    ids = [k["id"] for k in kassen]
    if len(set(ids)) != len(ids):
        print("Doppelte Kennungen in der Liste", file=sys.stderr)
        return 1
    if len(kassen) != anzahl or len(kassen) < 80:
        print(f"Unvollständig gelesen: {len(kassen)} von {anzahl} Kassen", file=sys.stderr)
        return 1

    pfad = os.path.join(DATA, "kassen.json")
    alt = json.load(open(pfad, encoding="utf-8")) if os.path.exists(pfad) else None
    hist_pfad = os.path.join(DATA, "kassen-historie.json")
    hist = json.load(open(hist_pfad, encoding="utf-8")) if os.path.exists(hist_pfad) else {"_quelle": BASE, "ereignisse": []}
    heute = dt.date.today().isoformat()
    neu = {k["id"]: k for k in kassen}
    if alt:
        vorher = {k["id"]: k for k in alt["kassen"]}
        weg = [i for i in vorher if i not in neu]
        if len(weg) > 0.15 * len(vorher):
            print(f"{len(weg)} Kassen auf einmal verschwunden: Lesefehler vermutet, nichts geschrieben", file=sys.stderr)
            return 1
        for i, k in neu.items():
            v = vorher.get(i)
            if v is None:
                hist["ereignisse"].append({"datum": stand_iso, "id": i, "name": k["name"], "art": "neu", "zb": k["zb"]})
            elif v["zb"] != k["zb"]:
                hist["ereignisse"].append({"datum": stand_iso, "id": i, "name": k["name"], "art": "satz", "alt": v["zb"], "neu": k["zb"]})
            elif v["laender"] != k["laender"] or v["art"] != k["art"]:
                hist["ereignisse"].append({"datum": stand_iso, "id": i, "name": k["name"], "art": "oeffnung", "alt": v["laender"], "neu": k["laender"]})
        for i in weg:
            hist["ereignisse"].append({"datum": stand_iso, "id": i, "name": vorher[i]["name"], "art": "weg", "zb": vorher[i]["zb"]})
    else:
        hist["ereignisse"].append({"datum": stand_iso, "art": "start", "anzahl": len(kassen)})

    geaendert = alt is None or [ {k: x[k] for k in ("id", "zb", "art", "laender", "name")} for x in alt["kassen"]] != [
        {k: x[k] for k in ("id", "zb", "art", "laender", "name")} for x in kassen]
    if geaendert:
        json.dump({"_quelle": BASE, "_regel": "§ 242 Abs. 5 SGB V: tagesaktuelle Zusatzbeitragssätze; neue Sätze erscheinen erst am Tag ihrer Gültigkeit",
                   "stand": stand_iso, "anzahl": len(kassen), "kassen": kassen},
                  open(pfad, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        json.dump(hist, open(hist_pfad, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump({"abgerufen_am": heute, "stand_gkv": stand_iso, "anzahl": len(kassen)},
              open(os.path.join(DATA, "kassen-abruf.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(kassen)} Kassen, Stand {stand_iso}, {'geändert' if geaendert else 'unverändert'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
