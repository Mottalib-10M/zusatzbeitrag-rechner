import { wechsel, type Monat } from '../engine/wechsel';
import { T, type L, type Rows } from './_kit';
const MDE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const MEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** Sonderkündigungsrecht (§ 175 Abs. 4 Satz 6 SGB V): Frist, Beginn der neuen Kasse, Monate mit dem höheren Satz. */
export default (l: L) => {
  const name = (m: Monat) => `${(l === 'en' ? MEN : MDE)[m.m - 1]} ${m.y}`;
  return {
    title: T(l, 'Ihre Frist nach einer Erhöhung', 'Your deadline after a rate rise'),
    cta: T(l, 'Alle Wechseltermine rechnen', 'Work out every switch date'),
    inputs: [
      { id: 'e', label: T(l, 'Höherer Satz gilt ab', 'Higher rate applies from'), def: 1, options: Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: name({ y: 2027, m: i + 1 }) })) },
      { id: 'w', label: T(l, 'Sie wählen die neue Kasse', 'You join the new fund'), def: 1, options: [{ value: '0', label: T(l, 'im Monat davor', 'the month before') }, { value: '1', label: T(l, 'im Monat der Erhöhung', 'in the month of the rise') }] },
    ],
    run: ({ e, w }: Record<string, number>) => {
      const erh: Monat = { y: 2027, m: e };
      const erkl: Monat = w === 0 ? (e === 1 ? { y: 2026, m: 12 } : { y: 2027, m: e - 1 }) : erh;
      // Mitglied seit sechs Monaten: Ohne die Erhöhung wäre ein Wechsel noch gesperrt.
      const seit: Monat = { y: erh.m > 6 ? 2027 : 2026, m: ((erh.m + 5) % 12) + 1 };
      const r = wechsel(erkl, seit, erh);
      const eins = (m: Monat) => (l === 'en' ? `1 ${name(m)}` : `1. ${name(m)}`);
      return {
        head: [T(l, 'Neue Kasse ab', 'New fund from'), eins(r.beginn)],
        rows: [
          [T(l, 'Spätester Monat für die Wahl', 'Last month to join'), name(erh)],
          [T(l, 'Letzter Monat bei der alten Kasse', 'Last month with the old fund'), name(r.letzterMonat)],
          [T(l, 'Monate mit dem höheren Satz', 'Months at the higher rate'), String(r.monateErhoeht)],
        ] as Rows,
        note: T(l, 'Gilt auch während der zwölf Monate Bindung.', 'Applies even within the twelve-month lock-in.'),
      };
    },
  };
};
