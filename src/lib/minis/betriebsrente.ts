import { rentner } from '../engine/beitrag';
import { J } from '../engine/params';
import { T, eur, type L, type Rows } from './_kit';
/** Beitrag auf die Betriebsrente (§§ 226 Abs. 2, 229, 248 SGB V): KV mit Freibetrag, PV mit Freigrenze, voller Satz allein. */
export default (l: L) => ({
  title: T(l, 'Was von Ihrer Betriebsrente an die Kasse geht', 'How much of your company pension goes to the fund'),
  cta: T(l, 'Beitrag auf Rente und Betriebsrente rechnen', 'Work out pension and company pension together'),
  inputs: [{ id: 'v', label: T(l, 'Betriebsrente im Monat', 'Company pension a month'), def: 450, unit: '€', max: 100000 }],
  run: ({ v }: Record<string, number>) => {
    const w = J(2026);
    const r = rentner({ rente: 0, betriebsrente: v, zb: w.zb_durchschnitt, jahr: 2026, eltern: 'k1' });
    return {
      head: [T(l, 'Abzug im Monat', 'Deduction a month'), eur(r.selbst, l)],
      rows: [
        [T(l, 'Krankenversicherung', 'Health insurance'), eur(r.kv.mitglied, l)],
        [T(l, 'davon beitragspflichtig', 'contributory part'), eur(r.basisKv, l)],
        [T(l, 'Pflegeversicherung', 'Care insurance'), eur(r.pv.mitglied, l)],
        [T(l, 'Netto-Betriebsrente vor Steuer', 'Company pension before tax'), eur(v - r.selbst, l)],
      ] as Rows,
      note: T(l, `2026, durchschnittlicher Zusatzbeitrag, ein Kind, ohne weitere Versorgungsbezüge. Freibetrag ${eur(w.vbFrei, l, 2)}.`, `2026, average additional rate, one child, no other occupational income. Allowance ${eur(w.vbFrei, l, 2)}.`),
    };
  },
});
