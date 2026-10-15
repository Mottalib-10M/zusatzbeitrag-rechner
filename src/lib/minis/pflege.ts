import { angestellt } from '../engine/beitrag';
import { J } from '../engine/params';
import { T, eur, elternOpt, elternVon, type L, type Rows } from './_kit';
/** Pflegebeitrag der Beschäftigten nach Kinderzahl (§ 55 Abs. 3 SGB XI), Vergleich mit Kinderlosen ab 23. */
export default (l: L) => ({
  title: T(l, 'Ihr Pflegebeitrag nach Kinderzahl', 'Your care contribution by number of children'),
  cta: T(l, 'Gesamtbeitrag mit Krankenversicherung rechnen', 'Work out the total with health insurance'),
  inputs: [
    { id: 'b', label: T(l, 'Bruttolohn im Monat', 'Gross pay a month'), def: 3800, unit: '€', max: 1000000 },
    { id: 'e', label: T(l, 'Kinder', 'Children'), def: 2, options: elternOpt(l) },
  ],
  run: ({ b, e }: Record<string, number>) => {
    const zb = J(2026).zb_durchschnitt;
    const r = angestellt({ brutto: b, zb, jahr: 2026, eltern: elternVon(e) });
    const ohne = angestellt({ brutto: b, zb, jahr: 2026, eltern: 'kinderlos' });
    const d = (ohne.pv.mitglied - r.pv.mitglied) * 12;
    return {
      head: [T(l, 'Ihr Pflegebeitrag im Monat', 'Your care contribution a month'), eur(r.pv.mitglied, l)],
      rows: [
        [T(l, 'Arbeitgeber zahlt', 'Employer pays'), eur(r.pv.andere, l)],
        [T(l, 'Kinderlos ab 23 wären es', 'Childless 23+ would pay'), eur(ohne.pv.mitglied, l)],
        [T(l, 'Unterschied im Jahr', 'Difference a year'), eur(Math.abs(d), l)],
      ] as Rows,
      note: T(l, 'Außerhalb Sachsens; 2026.', 'Outside Saxony; 2026.'),
    };
  },
});
