/**
 * Beitrag zur gesetzlichen Kranken- und Pflegeversicherung, Monat für Monat, nach SGB V, SGB XI und SGB IV.
 * Reine Funktionen, keine Rundung der Anzeige: Beträge werden je Anteil auf Cent gerundet, die Oberfläche
 * zeigt ganze Euro (RECETTE §4.1). Jede Regel nennt ihren Paragraphen; die Werte kommen aus params-2026.json.
 */
import { J, type Jahr, type JW } from './params';

export type Status = 'angestellt' | 'rentner' | 'selbststaendig' | 'student';
/** Elterneigenschaft für die Pflegeversicherung (§ 55 Abs. 3 SGB XI). */
export type Eltern = 'kinderlos' | 'unter23' | 'k1' | 'k2' | 'k3' | 'k4' | 'k5';
export const ELTERN: Eltern[] = ['kinderlos', 'unter23', 'k1', 'k2', 'k3', 'k4', 'k5'];

export const c = (x: number) => Math.round(x * 100) / 100;
const pct = (basis: number, satz: number) => c((basis * satz) / 100);

/** Zuschlag (+) oder Abschlag (−) in Beitragssatzpunkten, vom Mitglied allein getragen. */
export function pvZuAb(e: Eltern, w: JW): number {
  if (e === 'kinderlos') return w.pv_kinderlos;
  if (e === 'unter23' || e === 'k1') return 0;
  const kinder = Math.min(Number(e.slice(1)), 5);
  return -(kinder - 1) * w.pv_abschlag_kind;
}

export interface Anteil { mitglied: number; andere: number; gesamt: number }
export type HinweisCode =
  | 'minijob' | 'uebergang' | 'sachsen' | 'sachsenUebergang' | 'ueberBbgKv' | 'ueberBbgPv' | 'ueberJaeg'
  | 'vbFrei' | 'vbFreibetrag' | 'mindest' | 'ohneKrankengeld' | 'student30' | 'famGrenze' | 'vorlaeufig' | 'pvBbg2027';
export interface Ergebnis {
  status: Status; jahr: Jahr; zb: number;
  /** Beitragspflichtige Einnahme KV und PV (Monat), nach Grenzen. */
  basisKv: number; basisPv: number;
  /** Satz KV ohne Zusatzbeitrag (14,6 / 14,0 / 10,22). */
  kvSatz: number; pvSatz: number; pvZuAb: number;
  kv: Anteil; pv: Anteil;
  /** Wer die andere Hälfte trägt. */
  andere: 'arbeitgeber' | 'rentenversicherung' | 'niemand';
  /** Was das Mitglied selbst im Monat zahlt (KV + PV). */
  selbst: number;
  /** Zusatzbeitrag allein, Anteil des Mitglieds, im Monat: darauf wirkt der Kassenwechsel. */
  zbSelbst: number;
  hinweise: HinweisCode[];
  /** Rechenweg in Zahlen, sprachneutral (die Oberfläche formuliert). */
  weg: Record<string, number>;
}

function fertig(e: Omit<Ergebnis, 'selbst'>): Ergebnis {
  if (J(e.jahr).vorlaeufig) e.hinweise.push('vorlaeufig');
  return { ...e, selbst: c(e.kv.mitglied + e.pv.mitglied) };
}

/** Beschäftigte: §§ 226, 249 SGB V; § 58 SGB XI; Übergangsbereich § 20 Abs. 2a SGB IV. */
export function angestellt(o: { brutto: number; zb: number; jahr: Jahr; sachsen?: boolean; eltern: Eltern }): Ergebnis {
  const w = J(o.jahr); const hinweise: HinweisCode[] = [];
  const zuab = pvZuAb(o.eltern, w);
  const kvSatz = w.kv_allgemein + o.zb;
  const brutto = Math.max(0, o.brutto);
  if (brutto <= w.geringfuegigkeit) {
    hinweise.push('minijob');
    const agPausch = pct(brutto, w.minijob_ag_kv);
    return fertig({ status: 'angestellt', jahr: o.jahr, zb: o.zb, basisKv: 0, basisPv: 0, kvSatz: w.kv_allgemein, pvSatz: w.pv_satz, pvZuAb: zuab,
      kv: { mitglied: 0, andere: agPausch, gesamt: agPausch }, pv: { mitglied: 0, andere: 0, gesamt: 0 }, andere: 'arbeitgeber', zbSelbst: 0, hinweise, weg: { brutto, agPausch } });
  }
  if (o.sachsen) hinweise.push('sachsen');
  if (brutto * 12 > w.jaeg_jahr) hinweise.push('ueberJaeg');
  if (brutto <= w.uebergang_oben) {
    hinweise.push('uebergang');
    if (o.sachsen) hinweise.push('sachsenUebergang');
    const G = w.geringfuegigkeit, O = w.uebergang_oben, F = w.faktor_f;
    const beGes = c(F * G + (O / (O - G) - (G / (O - G)) * F) * (brutto - G));
    const beAn = c((O / (O - G)) * (brutto - G));
    // Gesamtbeitrag = halber Beitrag auf BE gesamt, gerundet, verdoppelt (Rechenweg der Einzugsstellen).
    const kvGes = c(2 * pct(beGes, kvSatz / 2)); const kvAn = pct(beAn, kvSatz / 2);
    const pvGes = c(2 * pct(beGes, w.pv_satz / 2)); const pvAnHalb = pct(beAn, w.pv_satz / 2);
    const pvZu = pct(beAn, zuab);
    const pvAn = c(pvAnHalb + pvZu);
    return fertig({ status: 'angestellt', jahr: o.jahr, zb: o.zb, basisKv: beGes, basisPv: beGes, kvSatz: w.kv_allgemein, pvSatz: w.pv_satz, pvZuAb: zuab,
      kv: { mitglied: kvAn, andere: c(kvGes - kvAn), gesamt: kvGes }, pv: { mitglied: pvAn, andere: c(pvGes - pvAnHalb), gesamt: c(pvGes + pvZu) },
      andere: 'arbeitgeber', zbSelbst: pct(beAn, o.zb / 2), hinweise, weg: { brutto, beGes, beAn, F, G, O } });
  }
  const basisKv = Math.min(brutto, w.bbgKv); const basisPv = Math.min(brutto, w.bbgPv);
  if (brutto > w.bbgKv) hinweise.push('ueberBbgKv');
  if (brutto > w.bbgPv) { hinweise.push('ueberBbgPv'); if (w.bbgPv < w.bbgKv) hinweise.push('pvBbg2027'); }
  const kvHalb = pct(basisKv, kvSatz / 2);
  const s = o.sachsen ? w.pv_sachsen_an_mehr : 0;
  const pvAn = pct(basisPv, w.pv_satz / 2 + s + zuab);
  const pvAg = pct(basisPv, w.pv_satz / 2 - s);
  return fertig({ status: 'angestellt', jahr: o.jahr, zb: o.zb, basisKv, basisPv, kvSatz: w.kv_allgemein, pvSatz: w.pv_satz, pvZuAb: zuab,
    kv: { mitglied: kvHalb, andere: kvHalb, gesamt: c(kvHalb * 2) }, pv: { mitglied: pvAn, andere: pvAg, gesamt: c(pvAn + pvAg) },
    andere: 'arbeitgeber', zbSelbst: pct(basisKv, o.zb / 2), hinweise, weg: { brutto, sachsen: s } });
}

/**
 * Pflichtversicherte Rentner (KVdR): Rente §§ 247, 249a SGB V (Hälfte trägt die Rentenversicherung);
 * Betriebsrente als Versorgungsbezug §§ 226 Abs. 2, 229, 248 SGB V (voller Satz, Freibetrag); Pflege § 59 SGB XI (allein).
 */
export function rentner(o: { rente: number; betriebsrente?: number; zb: number; jahr: Jahr; eltern: Eltern }): Ergebnis {
  const w = J(o.jahr); const hinweise: HinweisCode[] = [];
  const zuab = pvZuAb(o.eltern, w);
  const kvSatz = w.kv_allgemein + o.zb;
  const rente = Math.min(Math.max(0, o.rente), w.bbgKv);
  if (o.rente > w.bbgKv) hinweise.push('ueberBbgKv');
  const vb = Math.max(0, o.betriebsrente ?? 0);
  // Freigrenze: bis zu einem Zwanzigstel der Bezugsgröße bleiben Versorgungsbezüge beitragsfrei (KV und PV).
  // Darüber zieht die KV bei Betriebsrenten einen Freibetrag in gleicher Höhe ab, die PV nicht (§ 226 Abs. 2 Satz 2 SGB V gilt nur für die KV).
  const vbUeber = vb > w.vbFrei;
  if (vb > 0 && !vbUeber) hinweise.push('vbFrei');
  if (vbUeber) hinweise.push('vbFreibetrag');
  const vbKv = vbUeber ? Math.min(Math.max(0, vb - w.vbFrei), Math.max(0, w.bbgKv - rente)) : 0;
  const rentePv = Math.min(Math.max(0, o.rente), w.bbgPv);
  const vbPv = vbUeber ? Math.min(vb, Math.max(0, w.bbgPv - rentePv)) : 0;
  const kvRenteHalb = pct(rente, kvSatz / 2);
  const kvVb = pct(vbKv, kvSatz);
  const pvSatzM = w.pv_satz + zuab;
  const pvR = pct(rentePv, pvSatzM); const pvV = pct(vbPv, pvSatzM);
  return fertig({ status: 'rentner', jahr: o.jahr, zb: o.zb, basisKv: c(rente + vbKv), basisPv: c(rentePv + vbPv), kvSatz: w.kv_allgemein, pvSatz: w.pv_satz, pvZuAb: zuab,
    kv: { mitglied: c(kvRenteHalb + kvVb), andere: kvRenteHalb, gesamt: c(kvRenteHalb * 2 + kvVb) }, pv: { mitglied: c(pvR + pvV), andere: 0, gesamt: c(pvR + pvV) },
    andere: 'rentenversicherung', zbSelbst: c(pct(rente, o.zb / 2) + pct(vbKv, o.zb)), hinweise,
    weg: { rente, vb, vbKv, vbPv, vbFrei: w.vbFrei, kvRenteHalb, kvVb } });
}

/** Freiwillig versicherte Selbstständige: § 240 SGB V (Mindestbemessung, BBG), § 243 (14,0 % ohne Krankengeld), § 59 Abs. 4 SGB XI. */
export function selbststaendig(o: { einkommen: number; zb: number; jahr: Jahr; krankengeld: boolean; eltern: Eltern }): Ergebnis {
  const w = J(o.jahr); const hinweise: HinweisCode[] = [];
  const zuab = pvZuAb(o.eltern, w);
  const e = Math.max(0, o.einkommen);
  if (e < w.mindestFreiwillig) hinweise.push('mindest');
  if (e > w.bbgKv) hinweise.push('ueberBbgKv');
  if (e > w.bbgPv) { hinweise.push('ueberBbgPv'); if (w.bbgPv < w.bbgKv) hinweise.push('pvBbg2027'); }
  if (!o.krankengeld) hinweise.push('ohneKrankengeld');
  const basisKv = Math.min(Math.max(e, w.mindestFreiwillig), w.bbgKv);
  const basisPv = Math.min(Math.max(e, w.mindestFreiwillig), w.bbgPv);
  const kvSatz = o.krankengeld ? w.kv_allgemein : w.kv_ermaessigt;
  const kv = pct(basisKv, kvSatz + o.zb);
  const pv = pct(basisPv, w.pv_satz + zuab);
  return fertig({ status: 'selbststaendig', jahr: o.jahr, zb: o.zb, basisKv, basisPv, kvSatz, pvSatz: w.pv_satz, pvZuAb: zuab,
    kv: { mitglied: kv, andere: 0, gesamt: kv }, pv: { mitglied: pv, andere: 0, gesamt: pv }, andere: 'niemand', zbSelbst: pct(basisKv, o.zb), hinweise,
    weg: { einkommen: e, mindest: w.mindestFreiwillig } });
}

/** Pflichtversicherte Studierende: § 236 SGB V (BAföG-Bedarf als Einnahme), § 245 (sieben Zehntel), Pflege § 59 Abs. 1 SGB XI. */
export function student(o: { zb: number; jahr: Jahr; eltern: Eltern }): Ergebnis {
  const w = J(o.jahr); const hinweise: HinweisCode[] = ['student30'];
  const zuab = pvZuAb(o.eltern, w);
  const b = w.bafoeg_bedarf;
  const kv = pct(b, w.kvStudent + o.zb);
  const pv = pct(b, w.pv_satz + zuab);
  return fertig({ status: 'student', jahr: o.jahr, zb: o.zb, basisKv: b, basisPv: b, kvSatz: w.kvStudent, pvSatz: w.pv_satz, pvZuAb: zuab,
    kv: { mitglied: kv, andere: 0, gesamt: kv }, pv: { mitglied: pv, andere: 0, gesamt: pv }, andere: 'niemand', zbSelbst: pct(b, o.zb), hinweise, weg: { bafoeg: b } });
}

export interface Eingabe { status: Status; einkommen: number; betriebsrente?: number; krankengeld?: boolean; sachsen?: boolean; eltern: Eltern; jahr: Jahr }
/** Ein Einstieg für alle Gruppen: `einkommen` ist Bruttolohn, Rente oder Gewinn im Monat (bei Studierenden ignoriert). */
export function beitrag(i: Eingabe, zb: number): Ergebnis {
  switch (i.status) {
    case 'rentner': return rentner({ rente: i.einkommen, betriebsrente: i.betriebsrente, zb, jahr: i.jahr, eltern: i.eltern });
    case 'selbststaendig': return selbststaendig({ einkommen: i.einkommen, zb, jahr: i.jahr, krankengeld: i.krankengeld ?? false, eltern: i.eltern });
    case 'student': return student({ zb, jahr: i.jahr, eltern: i.eltern });
    default: return angestellt({ brutto: i.einkommen, zb, jahr: i.jahr, sachsen: i.sachsen, eltern: i.eltern });
  }
}

/** Ersparnis im Jahr für das Mitglied, wenn es von Satz `von` zu Satz `zu` wechselt (nur der Zusatzbeitrag unterscheidet die Kassen). */
export function ersparnisJahr(i: Eingabe, von: number, zu: number): number {
  return c((beitrag(i, von).selbst - beitrag(i, zu).selbst) * 12);
}

/** Familienversicherung § 10 Abs. 1 Nr. 5 SGB V: Gesamteinkommen bis 1/7 der Bezugsgröße, mit Minijob bis zur Geringfügigkeitsgrenze. */
export function familienversicherung(o: { einkommen: number; minijob: boolean; jahr: Jahr }) {
  const w = J(o.jahr);
  const grenze = o.minijob ? w.geringfuegigkeit : w.famGrenze;
  return { moeglich: o.einkommen <= grenze, grenze, abstand: c(grenze - o.einkommen) };
}
