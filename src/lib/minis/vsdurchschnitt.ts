import { angestellt } from '../engine/beitrag';
import { J } from '../engine/params';
import { T, eur, pz, pk, kassenOpt, kassenIndex, KASSEN_MIT_SATZ, type L, type Rows } from './_kit';
/** Eigene Kasse gegen den amtlichen durchschnittlichen Zusatzbeitragssatz (§ 242a SGB V), Anteil der Beschäftigten. */
export default (l: L) => ({
  title: T(l, 'Ihre Kasse gegen den Durchschnittssatz', 'Your fund against the average rate'),
  cta: T(l, 'Alle Kassen Ihres Landes vergleichen', 'Compare every fund in your state'),
  inputs: [
    { id: 'k', label: T(l, 'Ihre Krankenkasse', 'Your health fund'), def: Math.max(0, kassenIndex('barmer')), options: kassenOpt(l) },
    { id: 'b', label: T(l, 'Bruttolohn im Monat', 'Gross pay a month'), def: 3800, unit: '€', max: 1000000 },
  ],
  run: ({ k, b }: Record<string, number>) => {
    const w = J(2026);
    const kasse = KASSEN_MIT_SATZ[k] ?? KASSEN_MIT_SATZ[0];
    const eigen = angestellt({ brutto: b, zb: kasse.zb!, jahr: 2026, eltern: 'k1' });
    const mittel = angestellt({ brutto: b, zb: w.zb_durchschnitt, jahr: 2026, eltern: 'k1' });
    const d = (eigen.selbst - mittel.selbst) * 12;
    return {
      head: [d > 0 ? T(l, 'Mehr als beim Durchschnitt, im Jahr', 'More than at the average, a year') : T(l, 'Weniger als beim Durchschnitt, im Jahr', 'Less than at the average, a year'), eur(Math.abs(d), l)],
      rows: [
        [T(l, `Satz ${kasse.kurz}`, `${kasse.kurz} rate`), pk(kasse.zb!, l)],
        [T(l, 'Durchschnittssatz 2026', 'Average rate 2026'), pz(w.zb_durchschnitt, l)],
        [T(l, 'Ihr Anteil im Monat bei Ihrer Kasse', 'Your monthly share at your fund'), eur(eigen.selbst, l)],
      ] as Rows,
    };
  },
});
