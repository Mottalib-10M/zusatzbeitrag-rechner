import { angestellt } from '../engine/beitrag';
import { T, eur, num, type L, type Rows } from './_kit';
/** Was eine Erhöhung des Zusatzbeitrags um x Punkte Beschäftigte kostet (halber Anteil, bis zur BBG). */
export default (l: L) => ({
  title: T(l, 'Was eine Erhöhung Sie kostet', 'What a rate increase costs you'),
  cta: T(l, 'Alle Kassen für Ihr Einkommen vergleichen', 'Compare every fund for your income'),
  inputs: [
    { id: 'b', label: T(l, 'Bruttolohn im Monat', 'Gross pay a month'), def: 3800, unit: '€', max: 1000000 },
    { id: 'p', label: T(l, 'Erhöhung', 'Increase'), def: 0.3, unit: T(l, 'Punkte', 'points'), max: 5, decimals: 2 },
  ],
  run: ({ b, p }: Record<string, number>) => {
    const vor = angestellt({ brutto: b, zb: 2.9, jahr: 2027, eltern: 'k1' });
    const nach = angestellt({ brutto: b, zb: 2.9 + p, jahr: 2027, eltern: 'k1' });
    const m = nach.selbst - vor.selbst;
    return { head: [T(l, 'Mehr im Jahr, Ihr Anteil', 'Extra a year, your share'), eur(m * 12, l)], rows: [[T(l, 'Mehr im Monat', 'Extra a month'), eur(m, l)], [T(l, 'Arbeitgeber zahlt zusätzlich', 'Employer pays on top'), eur(m, l)], [T(l, 'Beitragspflichtig (Grenze 2027)', 'Contributory (2027 ceiling)'), eur(vor.basisKv, l)], [T(l, 'Punkte', 'Points'), num(p, l, 2)]] as Rows };
  },
});
