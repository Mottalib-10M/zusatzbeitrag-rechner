import { angestellt } from '../engine/beitrag';
import { J } from '../engine/params';
import { T, eur, type L, type Rows } from './_kit';
/** Beitrag 2026 und 2027 bei gleichem Lohn: was die höheren Beitragsbemessungsgrenzen kosten (Durchschnittssatz, ein Kind). */
export default (l: L) => ({
  title: T(l, 'Was die neue Grenze Sie 2027 kostet', 'What the new ceiling costs you in 2027'),
  cta: T(l, 'Beitrag bei Ihrer Kasse rechnen', 'Work out the cost at your fund'),
  inputs: [{ id: 'b', label: T(l, 'Bruttolohn im Monat', 'Gross pay a month'), def: 7000, unit: '€', max: 1000000 }],
  run: ({ b }: Record<string, number>) => {
    const zb = J(2026).zb_durchschnitt;
    const a = angestellt({ brutto: b, zb, jahr: 2026, eltern: 'k1' });
    const n = angestellt({ brutto: b, zb, jahr: 2027, eltern: 'k1' });
    const m = n.selbst - a.selbst;
    return {
      head: [T(l, 'Mehr im Jahr 2027, Ihr Anteil', 'Extra in 2027, your share'), eur(m * 12, l)],
      rows: [
        [T(l, 'Ihr Anteil im Monat 2026', 'Your monthly share 2026'), eur(a.selbst, l)],
        [T(l, 'Ihr Anteil im Monat 2027', 'Your monthly share 2027'), eur(n.selbst, l)],
        [T(l, 'Beitragspflichtig KV / PV 2027', 'Contributory health / care 2027'), `${eur(n.basisKv, l)} / ${eur(n.basisPv, l)}`],
      ] as Rows,
      note: T(l, 'Durchschnittlicher Zusatzbeitrag, ein Kind; 2027 vorläufig.', 'Average additional rate, one child; 2027 provisional.'),
    };
  },
});
