/**
 * Kennzahlen für Kassen- und Länderseiten, alle aus der Kassenliste und dem Motor. Inhaltsdateien lesen nur
 * hier und schreiben keine Zahl von Hand (RECETTE §17.4): ändert sich ein Satz, ändern sich Texte und Tabellen.
 */
import { kasse, offen, rangliste, waehlbar, statistik, LAENDER, LAND_NAME, type Land, type Kasse } from './engine/kassen';
import { angestellt, rentner, selbststaendig, student } from './engine/beitrag';
import { J } from './engine/params';

const w26 = J(2026);
/** Beispiel-Einkommen der Seiten: mittlerer Lohn, Rente, Gewinn. Hier einmal festgelegt, nie im Text. */
export const BSP = { lohn: 3800, lohnNiedrig: 2500, rente: 1600, gewinn: 3000 };

const an = (zb: number, brutto = BSP.lohn) => angestellt({ brutto, zb, jahr: 2026, eltern: 'k1' }).selbst;
const jahrDiff = (a: number, b: number, brutto = BSP.lohn) => Math.round((an(a, brutto) - an(b, brutto)) * 12);

export function profil(id: string) {
  const k = kasse(id);
  const zb = k.zb!;
  const alle = offen();
  const st = statistik(alle);
  const rangBund = alle.filter((x) => x.zb! < zb).length + 1;
  const billigste = alle[0];
  const teuerste = alle[alle.length - 1];
  const laender = k.laender;
  const raengeLand = laender.map((l) => ({ l, rang: rangliste(l).filter((x) => x.zb! < zb).length + 1, n: rangliste(l).length }));
  return {
    k, zb, rangBund, nBund: alle.length, st, billigste, teuerste, laender, raengeLand,
    unterDurchschnitt: zb < w26.zb_durchschnitt,
    abstandDurchschnitt: Math.round((zb - w26.zb_durchschnitt) * 100) / 100,
    abstandBilligste: Math.round((zb - billigste.zb!) * 100) / 100,
    /** Monatsbeitrag (eigener Anteil, KV + PV, ein Kind) in typischen Lagen 2026. */
    lohn: an(zb), lohnNiedrig: an(zb, BSP.lohnNiedrig), lohnBbg: an(zb, w26.bbgKv),
    rente: rentner({ rente: BSP.rente, zb, jahr: 2026, eltern: 'k1' }).selbst,
    selbst: selbststaendig({ einkommen: BSP.gewinn, zb, jahr: 2026, krankengeld: false, eltern: 'k1' }).selbst,
    student: student({ zb, jahr: 2026, eltern: 'unter23' }).selbst,
    /** Jahresunterschied zum Durchschnittssatz und zur günstigsten Kasse, bei BSP.lohn. */
    proJahrVsDurchschnitt: jahrDiff(zb, w26.zb_durchschnitt),
    proJahrVsBilligste: jahrDiff(zb, billigste.zb!),
    proJahrVsBilligsteBbg: jahrDiff(zb, billigste.zb!, w26.bbgKv),
  };
}

/** Nachbarn im Preis: die zwei Kassen direkt darunter und darüber unter allen frei wählbaren. */
export function nachbarn(id: string, n = 2): Kasse[] {
  const alle = offen(); const i = alle.findIndex((x) => x.id === id);
  return alle.slice(Math.max(0, i - n), i).concat(alle.slice(i + 1, i + 1 + n));
}

/** Kosten in typischen Lagen für eine Liste von Kassen (Tabellenzeilen). */
export function kostenZeile(k: Kasse) {
  return { k, lohn: an(k.zb!), rente: rentner({ rente: BSP.rente, zb: k.zb!, jahr: 2026, eltern: 'k1' }).selbst };
}

export function landProfil(l: Land) {
  const r = rangliste(l);
  const aok = r.find((k) => k.kassenart === 'AOK') ?? null;
  const regional = r.filter((k) => k.art === 'regional');
  const bund = r.filter((k) => k.art === 'bundesweit');
  const st = statistik(r);
  const billig = r[0], teuer = r[r.length - 1];
  const nurHier = r.filter((k) => k.art === 'regional' && k.laender.length === 1);
  return {
    l, name: LAND_NAME[l], r, n: r.length, aok, regional, bund, st, billig, teuer, nurHier,
    sachsen: l === 'SN',
    /** Spanne in Euro im Jahr zwischen günstigster und teuerster wählbarer Kasse, beim Beispiellohn. */
    spanneJahr: jahrDiff(teuer.zb!, billig.zb!),
    spanneJahrBbg: jahrDiff(teuer.zb!, billig.zb!, w26.bbgKv),
    aokVsBillig: aok ? jahrDiff(aok.zb!, billig.zb!) : 0,
    aokRang: aok ? r.filter((x) => x.zb! < aok.zb!).length + 1 : 0,
    lohnBillig: an(billig.zb!), lohnTeuer: an(teuer.zb!),
  };
}

/** Rang eines Landes nach dem Satz seiner günstigsten wählbaren Kasse (1 = günstigste), und nach der Zahl wählbarer Kassen. */
export function laenderVergleich() {
  return LAENDER.map((l) => ({ l, billig: rangliste(l)[0].zb!, n: waehlbar(l).length }));
}
export { BSP as BEISPIEL };

/** Kassen mit eigener Seite (tests/planned-ids.json, Gruppe kassen). Nur diese werden verlinkt. */
import planned from '../../tests/planned-ids.json';
export const KASSEN_SEITEN = new Set((planned as Array<{ id: string; group: string }>).filter((x) => x.group === 'kassen').map((x) => x.id));
/** Name einer Kasse, verlinkt, wenn sie eine eigene Seite hat. */
export const kLink = (h: { a: (id: string, t: string) => string }, k: Kasse) => (KASSEN_SEITEN.has(k.id) ? h.a(k.id, k.kurz) : k.kurz);
