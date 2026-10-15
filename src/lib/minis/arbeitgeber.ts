import { angestellt } from '../engine/beitrag';
import { KASSEN } from '../engine/kassen';
import { formatNumber } from '../format';
import { T, eur, type L, type Rows } from './_kit';
const LISTE = KASSEN.filter((k) => k.zb !== null).sort((a, b) => a.kurz.localeCompare(b.kurz, 'de'));
const TK = Math.max(0, LISTE.findIndex((k) => k.id === 'techniker-krankenkasse'));
/** Arbeitgeberanteil an Kranken- und Pflegeversicherung (§ 249 SGB V, § 58 SGB XI) bei einer gewählten Kasse. */
export default (l: L) => ({
  title: T(l, 'Was der Arbeitgeber für Sie an die Kasse zahlt', 'What your employer pays to the fund for you'),
  cta: T(l, 'Ihren eigenen Anteil rechnen', 'Work out your own share'),
  inputs: [
    { id: 'b', label: T(l, 'Bruttolohn im Monat', 'Gross pay a month'), def: 3800, unit: '€', max: 1000000 },
    { id: 'k', label: T(l, 'Krankenkasse', 'Health fund'), def: TK, options: LISTE.map((k, i) => ({ value: String(i), label: `${k.kurz} (${formatNumber(k.zb!, 2, l)} %)` })) },
  ],
  run: ({ b, k }: Record<string, number>) => {
    const kasse = LISTE[k] ?? LISTE[TK];
    const r = angestellt({ brutto: b, zb: kasse.zb!, jahr: 2026, eltern: 'k1' });
    const ag = r.kv.andere + r.pv.andere;
    return {
      head: [T(l, 'Arbeitgeberanteil im Monat', 'Employer share a month'), eur(ag, l)],
      rows: [
        [T(l, 'Krankenversicherung', 'Health insurance'), eur(r.kv.andere, l)],
        [T(l, 'Pflegeversicherung', 'Care insurance'), eur(r.pv.andere, l)],
        [T(l, 'Ihr eigener Anteil', 'Your own share'), eur(r.selbst, l)],
        [T(l, 'Brutto plus Arbeitgeberanteil KV/PV', 'Gross plus employer health/care'), eur(b + ag, l)],
      ] as Rows,
      note: T(l, '2026, ohne Renten- und Arbeitslosenversicherung, außerhalb Sachsens.', '2026, excluding pension and unemployment insurance, outside Saxony.'),
    };
  },
});
