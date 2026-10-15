import { J } from '../engine/params';
import { T, eur, type L, type Rows } from './_kit';
/** Versicherungspflichtgrenze (§ 6 Abs. 6 SGB V): liegt Ihr Jahresentgelt darüber, 2026 und 2027? */
export default (l: L) => ({
  title: T(l, 'Liegen Sie über der Versicherungspflichtgrenze?', 'Are you above the compulsory insurance threshold?'),
  cta: T(l, 'Beitrag als freiwilliges Mitglied rechnen', 'Work out your contribution'),
  inputs: [{ id: 'j', label: T(l, 'Regelmäßiges Jahresbrutto', 'Regular gross pay a year'), def: 80000, unit: '€', max: 10000000 }],
  run: ({ j }: Record<string, number>) => {
    const a = J(2026).jaeg_jahr, b = J(2027).jaeg_jahr;
    const st = (g: number) => (j > g ? T(l, 'darüber', 'above') : T(l, 'nicht darüber', 'not above'));
    const frei = j > a && j > b;
    return {
      head: [T(l, 'Versicherungsfrei ab 2027?', 'Exempt from 2027?'), frei ? T(l, 'ja', 'yes') : T(l, 'nein', 'no')],
      rows: [
        [T(l, `Grenze 2026 (${eur(a, l)})`, `Threshold 2026 (${eur(a, l)})`), st(a)],
        [T(l, `Grenze 2027 (${eur(b, l)})`, `Threshold 2027 (${eur(b, l)})`), st(b)],
        [T(l, 'Abstand zur Grenze 2027', 'Gap to the 2027 threshold'), eur(Math.abs(j - b), l)],
      ] as Rows,
      note: T(l, 'Die Pflicht endet nur, wenn das Entgelt auch die Grenze des Folgejahres übersteigt (§ 6 Abs. 4 SGB V). Grenze 2027 vorläufig.', 'Compulsory cover ends only if pay also exceeds the next year’s threshold (section 6(4) SGB V). 2027 threshold provisional.'),
    };
  },
});
