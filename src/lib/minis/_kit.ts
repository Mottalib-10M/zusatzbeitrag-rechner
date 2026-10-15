/** Gemeinsame Helfer der Mini-Rechner (vom Register ignoriert: Präfix „_“). */
import { formatMoney, formatNumber, formatDecimal } from '../format';
import { KASSEN } from '../engine/kassen';
export type L = 'de' | 'en';
export const T = <A>(l: L, de: A, en: A) => (l === 'en' ? en : de);
export const eur = (x: number, l: L, d?: number) => formatMoney(x, d ?? 0, l);
export const pz = (x: number, l: L, d = 2) => `${formatDecimal(x, d, l)} %`;
/** Kassensatz, zwei feste Stellen wie in der amtlichen Liste (2,50 %). */
export const pk = (x: number, l: L) => `${formatNumber(x, 2, l)}\u00a0%`;
export const num = (x: number, l: L, d = 0) => formatNumber(x, d, l);
export const janein = (l: L) => [{ value: '0', label: T(l, 'Nein', 'No') }, { value: '1', label: T(l, 'Ja', 'Yes') }];
/** Pflege-Elterneigenschaft als Zahl (Mini-Rechner kennen nur Zahlen): 0 ein Kind, 1 kinderlos ab 23, 2..5 Kinder unter 25. */
export const elternOpt = (l: L) => [
  { value: '0', label: T(l, 'ein Kind oder Kinder über 25', 'one child or children over 25') },
  { value: '1', label: T(l, 'keine Kinder, ab 23', 'no children, 23 or over') },
  { value: '2', label: T(l, 'zwei Kinder unter 25', 'two children under 25') },
  { value: '3', label: T(l, 'drei Kinder unter 25', 'three children under 25') },
  { value: '4', label: T(l, 'vier Kinder unter 25', 'four children under 25') },
  { value: '5', label: T(l, 'fünf oder mehr unter 25', 'five or more under 25') },
];
export const elternVon = (x: number) => (x === 1 ? 'kinderlos' : x >= 2 ? (`k${Math.min(5, x)}` as 'k2') : 'k1');
/** Kassen mit Satz als Auswahl (Wert = Index in KASSEN_MIT_SATZ). */
export const KASSEN_MIT_SATZ = KASSEN.filter((k) => k.zb !== null).sort((a, b) => a.kurz.localeCompare(b.kurz, 'de'));
export const kassenOpt = (l: L) => KASSEN_MIT_SATZ.map((k, i) => ({ value: String(i), label: `${k.kurz} (${pk(k.zb!, l)})` }));
export const kassenIndex = (id: string) => KASSEN_MIT_SATZ.findIndex((k) => k.id === id);
export type Rows = [string, string][];
