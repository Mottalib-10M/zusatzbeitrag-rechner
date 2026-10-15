/**
 * Zahlenformat für Texte außerhalb von `body(h)`: zitierbarer Absatz, FAQ, Titel. Jede Rechtszahl kommt aus P/J,
 * jedes Beispielergebnis aus dem Motor; geschrieben wird sie nur über diese Formatierer (RECETTE §4.1, §17.4).
 */
import { formatMoney, formatNumber, formatDecimal } from './format';
export { P, J } from './engine/params';
const mk = (l: 'de' | 'en') => ({
  eur: (n: number, d = 0) => formatMoney(n, d, l),
  num: (n: number, d = 0) => formatNumber(n, d, l),
  /** Satz in Prozent: 2,69 → „2,69 %“, 2,9 → „2,9 %“ (Leerzeichen geschützt). */
  pz: (x: number, d = 2) => `${formatDecimal(x, d, l)}\u00a0%`,
  /** Kassensatz mit zwei festen Stellen wie in der amtlichen Liste: 2,50 %. */
  pk: (x: number) => `${formatNumber(x, 2, l)}\u00a0%`,
});
export const DE = mk('de');
export const EN = mk('en');
