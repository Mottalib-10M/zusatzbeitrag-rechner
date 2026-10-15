import { angestellt } from '../engine/beitrag';
import { KASSEN, offen } from '../engine/kassen';
import { formatNumber } from '../format';
import { T, eur, type L, type Rows } from './_kit';
const LISTE = KASSEN.filter((k) => k.zb !== null).sort((a, b) => a.kurz.localeCompare(b.kurz, 'de'));
const START = Math.max(0, LISTE.findIndex((k) => k.id === 'barmer'));
/** Was der Preisunterschied zur günstigsten bundesweit wählbaren Kasse über 1, 3 und 5 Jahre ausmacht (heutige Sätze). */
export default (l: L) => ({
  title: T(l, 'Ihre Kasse gegen die günstigste: über die Jahre', 'Your fund against the cheapest: over the years'),
  cta: T(l, 'Alle Kassen Ihres Landes vergleichen', 'Compare every fund in your state'),
  inputs: [
    { id: 'k', label: T(l, 'Ihre Krankenkasse', 'Your health fund'), def: START, options: LISTE.map((k, i) => ({ value: String(i), label: `${k.kurz} (${formatNumber(k.zb!, 2, l)} %)` })) },
    { id: 'b', label: T(l, 'Bruttolohn im Monat', 'Gross pay a month'), def: 3800, unit: '€', max: 1000000 },
  ],
  run: ({ k, b }: Record<string, number>) => {
    const eigene = LISTE[k] ?? LISTE[START];
    const bund = offen().filter((x) => x.art === 'bundesweit');
    const billig = bund[0];
    const m = angestellt({ brutto: b, zb: eigene.zb!, jahr: 2026, eltern: 'k1' }).selbst - angestellt({ brutto: b, zb: billig.zb!, jahr: 2026, eltern: 'k1' }).selbst;
    const j = Math.max(0, m) * 12;
    return {
      head: [T(l, `Mehr als bei ${billig.kurz}, in einem Jahr`, `More than at ${billig.kurz}, one year`), eur(j, l)],
      rows: [
        [T(l, 'In drei Jahren', 'Over three years'), eur(j * 3, l)],
        [T(l, 'In fünf Jahren', 'Over five years'), eur(j * 5, l)],
        [T(l, 'Günstigste bundesweit wählbare Kasse', 'Cheapest fund open nationwide'), `${billig.kurz} (${formatNumber(billig.zb!, 2, l)} %)`],
      ] as Rows,
      note: T(l, 'Ihr Anteil als Beschäftigte(r) mit einem Kind; heutige Sätze ohne künftige Änderungen.', 'Your share as an employee with one child; today’s rates, no future changes assumed.'),
    };
  },
});
