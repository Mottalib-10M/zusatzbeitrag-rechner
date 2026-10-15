import { angestellt } from '../engine/beitrag';
import { J } from '../engine/params';
import { T, eur, pz, type L, type Rows } from './_kit';
/** Übergangsbereich (§ 20 Abs. 2a SGB IV): Ihr Anteil mit und ohne Ermäßigung, mit Durchschnitts-Zusatzbeitrag. */
export default (l: L) => ({
  title: T(l, 'Was der Übergangsbereich Ihnen spart', 'What the transition zone saves you'),
  cta: T(l, 'Beitrag bei Ihrer Kasse rechnen', 'Work out the cost at your fund'),
  inputs: [{ id: 'b', label: T(l, 'Bruttolohn im Monat', 'Gross pay a month'), def: 1200, unit: '€', max: 100000 }],
  run: ({ b }: Record<string, number>) => {
    const w = J(2026); const zb = w.zb_durchschnitt;
    const r = angestellt({ brutto: b, zb, jahr: 2026, eltern: 'k1' });
    // Ohne Ermäßigung: halber Satz auf das volle Brutto, aus dem Motor am oberen Rand des Bereichs hochgerechnet (dort ist die Ermäßigung null).
    const oben = angestellt({ brutto: w.uebergang_oben, zb, jahr: 2026, eltern: 'k1' }).selbst;
    const ohne = b <= w.geringfuegigkeit ? 0 : Math.round((oben * b / w.uebergang_oben) * 100) / 100;
    const imBereich = b > w.geringfuegigkeit && b <= w.uebergang_oben;
    const label = b <= w.geringfuegigkeit ? T(l, 'Minijob: kein eigener Beitrag', 'Minijob: no contribution of your own') : imBereich ? T(l, 'Ihr Anteil im Übergangsbereich', 'Your share in the transition zone') : T(l, 'Über dem Übergangsbereich', 'Above the transition zone');
    return {
      head: [label, eur(r.selbst, l)],
      rows: [
        [T(l, 'Ohne Übergangsbereich wären es', 'Without the transition zone'), eur(ohne, l)],
        [T(l, 'Ersparnis im Monat', 'Saving a month'), eur(Math.max(0, ohne - r.selbst), l)],
        [T(l, 'Arbeitgeber zahlt', 'Employer pays'), eur(r.kv.andere + r.pv.andere, l)],
      ] as Rows,
      note: T(l, `2026, Zusatzbeitrag ${pz(zb, l)}, ein Kind; Bereich bis ${eur(w.uebergang_oben, l)}.`, `2026, additional rate ${pz(zb, l)}, one child; band up to ${eur(w.uebergang_oben, l)}.`),
    };
  },
});
