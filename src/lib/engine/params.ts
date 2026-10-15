/** Rechtswerte 2026 und 2027 (vorläufig) aus params-2026.json. Jede Zahl im Rechner und im Text kommt von hier. */
import raw from '../../data/params-2026.json';

export type Jahr = 2026 | 2027;
export const JAHRE: Jahr[] = [2026, 2027];
export type Params = typeof raw;
export type SourceKey = keyof typeof raw.sources;
export const P: Params = raw;

export interface JahrWerte {
  status: string; kv_allgemein: number; kv_ermaessigt: number; kv_student_faktor: number;
  zb_durchschnitt: number; zb_durchschnitt_status: string; bbg_kv_jahr: number; bbg_pv_jahr: number; jaeg_jahr: number;
  bezugsgroesse_monat: number; geringfuegigkeit: number; uebergang_oben: number; faktor_f: number;
  pv_satz: number; pv_kinderlos: number; pv_abschlag_kind: number; pv_sachsen_an_mehr: number;
  rv_satz: number; av_satz: number; bafoeg_bedarf: number; minijob_ag_kv: number;
}

/** Werte eines Jahres samt abgeleiteter Monatsgrößen. */
export function J(j: Jahr) {
  const w = (raw.jahre as Record<string, JahrWerte>)[String(j)];
  return {
    ...w,
    jahr: j,
    vorlaeufig: w.status !== 'in_kraft',
    bbgKv: w.bbg_kv_jahr / 12,
    bbgPv: w.bbg_pv_jahr / 12,
    jaegMonat: w.jaeg_jahr / 12,
    /** § 226 Abs. 2 SGB V: Freigrenze und Freibetrag für Versorgungsbezüge, ein Zwanzigstel der Bezugsgröße. */
    vbFrei: w.bezugsgroesse_monat / 20,
    /** § 10 Abs. 1 Nr. 5 SGB V: Familienversicherung bis zu einem Siebtel der Bezugsgröße. */
    famGrenze: Math.round((w.bezugsgroesse_monat / 7) * 100) / 100,
    /** § 240 Abs. 4 SGB V: mindestens ein Neunzigstel der Bezugsgröße je Kalendertag, × 30 Tage. */
    mindestFreiwillig: Math.round((w.bezugsgroesse_monat / 90) * 30 * 100) / 100,
    /** § 245 SGB V: sieben Zehntel des allgemeinen Beitragssatzes. */
    kvStudent: Math.round(w.kv_allgemein * w.kv_student_faktor * 1000) / 1000,
  };
}
export type JW = ReturnType<typeof J>;
