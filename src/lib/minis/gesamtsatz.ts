import { angestellt } from '../engine/beitrag';
import { J } from '../engine/params';
import { T, eur, pz, kassenOpt, kassenIndex, KASSEN_MIT_SATZ, type L, type Rows } from './_kit';
/** Gesamtbeitragssatz einer Kasse (allgemeiner Satz + Zusatzbeitrag) und Ihr Anteil in Prozent und Euro. */
export default (l: L) => ({
  title: T(l, 'Beitragssatz Ihrer Kasse', 'Your fund’s contribution rate'),
  cta: T(l, 'Mit allen Kassen vergleichen', 'Compare with every fund'),
  inputs: [
    { id: 'k', label: T(l, 'Krankenkasse', 'Health fund'), def: Math.max(0, kassenIndex('techniker-krankenkasse')), options: kassenOpt(l) },
    { id: 'b', label: T(l, 'Bruttolohn im Monat', 'Gross pay a month'), def: 3800, unit: '€', max: 1000000 },
  ],
  run: ({ k, b }: Record<string, number>) => {
    const w = J(2026);
    const kasse = KASSEN_MIT_SATZ[k] ?? KASSEN_MIT_SATZ[0];
    const satz = w.kv_allgemein + kasse.zb!;
    const r = angestellt({ brutto: b, zb: kasse.zb!, jahr: 2026, eltern: 'k1' });
    return {
      head: [T(l, `Gesamtbeitragssatz ${kasse.kurz}`, `${kasse.kurz} total rate`), pz(satz, l)],
      rows: [
        [T(l, 'Ihr Anteil', 'Your share'), pz(satz / 2, l, 3)],
        [T(l, 'Krankenversicherung, Ihr Anteil im Monat', 'Health insurance, your share a month'), eur(r.kv.mitglied, l)],
        [T(l, 'Arbeitgeber zahlt dazu', 'Employer adds'), eur(r.kv.andere, l)],
      ] as Rows,
    };
  },
});
