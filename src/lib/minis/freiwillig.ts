import { selbststaendig } from '../engine/beitrag';
import { J } from '../engine/params';
import { T, eur, type L, type Rows } from './_kit';
/** Freiwillig Versicherte ohne Arbeitgeber: Beitrag auf alle Einnahmen, mindestens auf die Mindestbemessung (§ 240 Abs. 4 SGB V), Satz mit Durchschnitts-Zusatzbeitrag. */
export default (l: L) => ({
  title: T(l, 'Ihr Beitrag als freiwilliges Mitglied', 'Your contribution as a voluntary member'),
  cta: T(l, 'Mit dem Satz Ihrer Kasse rechnen', 'Use your own fund’s rate'),
  inputs: [
    { id: 'e', label: T(l, 'Alle Einnahmen im Monat', 'All income a month'), def: 1000, unit: '€', max: 1000000 },
    { id: 'kg', label: T(l, 'Krankengeld versichert?', 'Sick pay insured?'), def: 0, options: [{ value: '0', label: T(l, 'Nein (14,0 %)', 'No (14.0%)') }, { value: '1', label: T(l, 'Ja (14,6 %)', 'Yes (14.6%)') }] },
  ],
  run: ({ e, kg }: Record<string, number>) => {
    const w = J(2026);
    const r = selbststaendig({ einkommen: e, zb: w.zb_durchschnitt, jahr: 2026, krankengeld: kg === 1, eltern: 'k1' });
    const mindest = e < w.mindestFreiwillig;
    return {
      head: [T(l, 'Beitrag im Monat, Kranken- und Pflegeversicherung', 'Monthly contribution, health and care'), eur(r.selbst, l)],
      rows: [
        [T(l, 'Angesetzt werden', 'Assessed income'), eur(r.basisKv, l, 2)],
        [T(l, 'Krankenversicherung', 'Health insurance'), eur(r.kv.mitglied, l)],
        [T(l, 'Pflegeversicherung', 'Care insurance'), eur(r.pv.mitglied, l)],
        [T(l, 'Mindestbemessung greift', 'Minimum base applies'), mindest ? T(l, 'ja', 'yes') : T(l, 'nein', 'no')],
      ] as Rows,
      note: T(l, 'Mit dem durchschnittlichen Zusatzbeitrag 2026 und einem Kind gerechnet.', 'Calculated with the 2026 average additional rate and one child.'),
    };
  },
});
