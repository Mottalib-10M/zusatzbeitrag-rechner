/** Auswahllisten und Hinweistexte, die mehrere Rechner teilen. */
import { tx, fm, type L } from './kit';
import { KASSEN, LAENDER, LAND_NAME } from '../../lib/engine/kassen';
import type { HinweisCode } from '../../lib/engine/beitrag';
import type { JW } from '../../lib/engine/params';

export const statusOpt = (l: L) => [
  { value: 'angestellt', label: tx(l, 'angestellt', 'an employee') },
  { value: 'rentner', label: tx(l, 'Rentner, Rentnerin', 'a pensioner') },
  { value: 'selbststaendig', label: tx(l, 'selbstständig, freiwillig versichert', 'self-employed, voluntary member') },
  { value: 'student', label: tx(l, 'Student, Studentin', 'a student') },
];
export const elternOpt = (l: L) => [
  { value: 'k1', label: tx(l, 'ein Kind oder Kinder über 25', 'one child, or children over 25') },
  { value: 'kinderlos', label: tx(l, 'keine Kinder, 23 oder älter', 'no children, aged 23 or over') },
  { value: 'unter23', label: tx(l, 'keine Kinder, unter 23', 'no children, under 23') },
  { value: 'k2', label: tx(l, 'zwei Kinder unter 25', 'two children under 25') },
  { value: 'k3', label: tx(l, 'drei Kinder unter 25', 'three children under 25') },
  { value: 'k4', label: tx(l, 'vier Kinder unter 25', 'four children under 25') },
  { value: 'k5', label: tx(l, 'fünf oder mehr unter 25', 'five or more under 25') },
];
export const landOpt = (l: L) => LAENDER.map((c) => ({ value: c, label: LAND_NAME[c][l] })).sort((a, b) => a.label.localeCompare(b.label, 'de'));
/** Alle Kassen mit Satz, alphabetisch; geschlossene Betriebskassen stehen dabei, weil man dort Mitglied sein kann. */
export const kassenOpt = (l: L) => {
  const f = fm(l);
  return KASSEN.filter((k) => k.zb !== null).sort((a, b) => a.kurz.localeCompare(b.kurz, 'de')).map((k) => ({ value: k.id, label: `${k.kurz} (${f.pz(k.zb!)})` }));
};
export const jahrOpt = (_l: L) => [{ value: '2026', label: '2026' }, { value: '2027', label: '2027' }];
export const janeinOpt = (l: L) => [{ value: '0', label: tx(l, 'Nein', 'No') }, { value: '1', label: tx(l, 'Ja', 'Yes') }];

/** Ein Satz je Hinweis, mit den Zahlen des Jahres. */
export function hinweisText(h: HinweisCode, l: L, w: JW): string | null {
  const f = fm(l);
  switch (h) {
    case 'minijob': return tx(l, `Minijob bis ${f.eur(w.geringfuegigkeit)}: Sie zahlen keinen Krankenkassenbeitrag, der Arbeitgeber eine Pauschale von ${f.ps(w.minijob_ag_kv, 1)}. Versichert sind Sie darüber nicht, sondern über die Familie oder eine eigene Mitgliedschaft.`, `Minijob up to ${f.eur(w.geringfuegigkeit)}: you pay no health contribution; the employer pays a flat ${f.ps(w.minijob_ag_kv, 1)}. It does not insure you; you need family cover or your own membership.`);
    case 'uebergang': return tx(l, `Übergangsbereich ${f.eur(w.geringfuegigkeit + 0.01, 2)} bis ${f.eur(w.uebergang_oben)}: Ihr Anteil wird nach § 20 Abs. 2a SGB IV ermäßigt (Faktor F ${f.num(w.faktor_f, 4)}).`, `Transition zone ${f.eur(w.geringfuegigkeit + 0.01, 2)} to ${f.eur(w.uebergang_oben)}: your share is reduced under section 20(2a) SGB IV (factor F ${f.num(w.faktor_f, 4)}).`);
    case 'sachsenUebergang': return tx(l, 'Sachsen im Übergangsbereich: Ihr Pflegeanteil ist der halbe Satz plus 0,5 Punkte auf die ermäßigte Grundlage Ihres Anteils; der Arbeitgeber trägt den Rest des Gesamtbeitrags (§ 58 Abs. 3 und 5 SGB XI, Gemeinsames Rundschreiben vom 16.08.2022, Beispiel 9).', 'Saxony in the transition zone: your care share is half the rate plus 0.5 points on the reduced base of your share; the employer pays the rest of the total (section 58(3) and (5) SGB XI, joint circular of 16 August 2022, example 9).');
    case 'ueberBbgKv': return tx(l, `Über ${f.eur(w.bbgKv, 2)} im Monat steigt der Beitrag nicht weiter (Beitragsbemessungsgrenze ${w.jahr}).`, `Above ${f.eur(w.bbgKv, 2)} a month the contribution stops rising (${w.jahr} ceiling).`);
    case 'pvBbg2027': return tx(l, `Pflege 2027 nach geltendem § 55 Abs. 2 SGB XI nur bis ${f.eur(w.bbgPv)}; der Entwurf des Pflegeneuordnungsgesetzes will die Grenze an die ${f.eur(w.bbgKv)} der Krankenversicherung angleichen.`, `Care insurance in 2027 under the current section 55(2) SGB XI only up to ${f.eur(w.bbgPv)}; the draft Care Reorganisation Act would align it with the ${f.eur(w.bbgKv)} health ceiling.`);
    case 'ueberJaeg': return tx(l, `Mit mehr als ${f.eur(w.jaeg_jahr)} im Jahr sind Sie versicherungsfrei und bleiben freiwillig gesetzlich versichert; der Arbeitgeber zahlt den gleichen Zuschuss (§ 257 SGB V).`, `Above ${f.eur(w.jaeg_jahr)} a year you are exempt from compulsory cover; as a voluntary member the employer pays the same subsidy (section 257 SGB V).`);
    case 'vbFrei': return tx(l, `Betriebsrente bis ${f.eur(w.vbFrei, 2)}: beitragsfrei in Kranken- und Pflegeversicherung.`, `Company pension up to ${f.eur(w.vbFrei, 2)}: no contributions at all.`);
    case 'vbFreibetrag': return tx(l, `Betriebsrente: In der Krankenversicherung bleiben ${f.eur(w.vbFrei, 2)} frei, der Rest trägt den vollen Satz allein; in der Pflege zählt sie ganz.`, `Company pension: ${f.eur(w.vbFrei, 2)} is exempt for health insurance and the rest pays the full rate; care insurance counts all of it.`);
    case 'mindest': return tx(l, `Mindestens ${f.eur(w.mindestFreiwillig, 2)} im Monat werden angesetzt (§ 240 Abs. 4 SGB V), auch bei weniger Gewinn.`, `At least ${f.eur(w.mindestFreiwillig, 2)} a month is assessed (section 240(4) SGB V), even with lower profit.`);
    case 'ohneKrankengeld': return tx(l, `Ohne Krankengeld gilt der ermäßigte Satz von ${f.ps(w.kv_ermaessigt, 1)}; mit Wahlerklärung ${f.ps(w.kv_allgemein, 1)} und Krankengeld ab der siebten Woche.`, `Without sick pay the reduced ${f.ps(w.kv_ermaessigt, 1)} applies; opting in costs ${f.ps(w.kv_allgemein, 1)} and pays sick pay from week seven.`);
    case 'student30': return tx(l, 'Die studentische Versicherung endet in der Regel mit dem Semester, in dem Sie 30 werden (§ 190 Abs. 9 SGB V); danach freiwillig mit Mindestbeitrag.', 'Student cover usually ends with the semester in which you turn 30 (section 190(9) SGB V); after that you pay as a voluntary member.');
    case 'vorlaeufig': return tx(l, '2027: Grenzen aus dem Kabinettsbeschluss vom 7. Oktober 2026 (Bundesrat steht aus), Kassensätze von heute.', '2027: thresholds from the cabinet decision of 7 October 2026 (Bundesrat pending), fund rates as of today.');
    case 'sachsen': return tx(l, 'Sachsen: Beschäftigte tragen 0,5 Punkte mehr Pflegebeitrag, der Arbeitgeber entsprechend weniger (§ 58 Abs. 3 SGB XI).', 'Saxony: employees pay 0.5 points more care contribution and the employer that much less (section 58(3) SGB XI).');
    default: return null;
  }
}
