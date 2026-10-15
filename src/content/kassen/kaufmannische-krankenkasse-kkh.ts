import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { kasse, KASSEN } from '../../lib/engine/kassen';
import { angestellt } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** KKH: Ersatzkasse, bundesweit; Blick auf Gutverdienende über der Versicherungspflichtgrenze und auf 2027. */
const ID = 'kaufmannische-krankenkasse-kkh';
const p = profil(ID);
const w = J(2026), w27 = J(2027);
const me = kostenZeile(p.k);
const eks = KASSEN.filter((k) => k.kassenart === 'EK' && k.zb !== null).map(kostenZeile).sort((a, b) => a.k.zb! - b.k.zb!);
const ekRang = eks.findIndex((x) => x.k.id === ID) + 1;
const hkk = kostenZeile(kasse('handelskrankenkasse-hkk'));
const j = (x: { lohn: number }) => Math.round((x.lohn - me.lohn) * 12);
// Gutverdiener: Monatsgehalt über der Versicherungspflichtgrenze, freiwillig gesetzlich versichert.
const hochBrutto = Math.ceil(w.jaeg_jahr / 12 / 100) * 100 + 500;
const hoch26 = angestellt({ brutto: hochBrutto, zb: p.zb, jahr: 2026, eltern: 'k1' });
const hoch27 = angestellt({ brutto: hochBrutto, zb: p.zb, jahr: 2027, eltern: 'k1' });
const hochHkk = angestellt({ brutto: hochBrutto, zb: hkk.k.zb!, jahr: 2026, eltern: 'k1' });
const sparHoch = Math.round((hoch26.selbst - hochHkk.selbst) * 12);

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 22,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID, einkommen: hochBrutto },
  related: ['versicherungspflichtgrenze', 'beitragsbemessungsgrenze', 'handelskrankenkasse-hkk', 'barmer', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_6', 'sgb5_257', 'sgb5_223'],
  de: {
    slug: 'kkh-zusatzbeitrag',
    nav: 'KKH',
    card: `${DE.pk(p.zb)} Zusatzbeitrag; mit ${DE.eur(hochBrutto)} brutto zahlen Sie den Höchstbeitrag von ${DE.eur(hoch26.selbst)} im Monat.`,
    title: 'KKH Zusatzbeitrag 2027: Höchstbeitrag und Vergleich in Euro',
    description: `KKH, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Was Angestellte bis zum Höchstbeitrag zahlen, freiwillig Versicherte über der Pflichtgrenze, Ausblick 2027 und Abstand zur hkk.`,
    h1: 'KKH: Zusatzbeitrag und Höchstbeitrag für Gutverdienende',
    intro: `Die KKH verlangt ${DE.pk(p.zb)}; wer mehr als ${DE.eur(w.bbgKv, 2)} brutto verdient, zahlt dort ${DE.eur(hoch26.selbst)} im Monat, 2027 voraussichtlich ${DE.eur(hoch27.selbst)}.`,
    resume: `Die Kaufmännische Krankenkasse, kurz KKH, ist eine bundesweit geöffnete Ersatzkasse. Laut Liste des GKV-Spitzenverbands erhebt sie ${DE.pk(p.zb)} Zusatzbeitrag und liegt damit ${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte ${p.unterDurchschnitt ? 'unter' : 'über'} dem amtlichen Durchschnitt von ${DE.pz(w.zb_durchschnitt)}. Unter den ${eks.length} Ersatzkassen steht sie auf Platz ${ekRang} nach Preis, unter allen ${p.nBund} frei wählbaren Kassen auf Rang ${p.rangBund}. Bei ${DE.eur(BEISPIEL.lohn)} brutto mit einem Kind zahlen Sie ${DE.eur(p.lohn)} im Monat. Am deutlichsten wird der Satz bei hohen Gehältern: Wer über der Versicherungspflichtgrenze von ${DE.eur(w.jaeg_jahr)} im Jahr verdient und freiwillig gesetzlich bleibt, zahlt bei der KKH den Höchstbeitrag von ${DE.eur(hoch26.selbst)} im Monat; der Arbeitgeber gibt einen Zuschuss in gleicher Höhe wie bei Pflichtversicherten. Bei der günstigsten Ersatzkasse, der hkk, wären es ${DE.eur(sparHoch)} im Jahr weniger. 2027 steigt die Bemessungsgrenze nach dem Kabinettsbeschluss auf ${DE.eur(w27.bbgKv)} im Monat, der Höchstbeitrag bei gleichem Satz damit auf ${DE.eur(hoch27.selbst)}.`,
    faqs: [
      { q: 'Wie hoch ist der Höchstbeitrag bei der KKH?', a: `2026 ${DE.eur(hoch26.selbst)} im Monat für Ihren Anteil an Kranken- und Pflegeversicherung, mit einem Kind, ab einem Bruttolohn von ${DE.eur(w.bbgKv, 2)}. Darüber steigt nichts mehr. Für 2027 sind ${DE.eur(hoch27.selbst)} zu erwarten, wenn die KKH ihren Satz hält, weil die Grenze der Krankenversicherung um ${DE.eur(Math.round(w27.bbgKv - w.bbgKv))} im Monat steigt.` },
      { q: 'Ich verdiene über der Versicherungspflichtgrenze. Zahlt der Arbeitgeber trotzdem die Hälfte?', a: `Ja, als Beitragszuschuss nach § 257 SGB V: Er zahlt so viel, wie er bei einem pflichtversicherten Beschäftigten tragen müsste, also die Hälfte des allgemeinen Satzes und des Zusatzbeitrags der KKH auf Ihr Gehalt bis zur Bemessungsgrenze, dazu den halben Pflegebeitrag. Ihr eigener Anteil bleibt damit derselbe wie bei Pflichtversicherten.` },
      { q: 'Wie viel spare ich als Gutverdiener mit einem Wechsel von der KKH zur hkk?', a: `Die hkk verlangt ${DE.pk(hkk.k.zb!)}. Bei einem Gehalt über der Bemessungsgrenze zahlen Sie dort ${DE.eur(sparHoch)} im Jahr weniger, bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(Math.abs(j(hkk)))}. Beide sind Ersatzkassen und bundesweit geöffnet; der Wechsel braucht nur einen Antrag bei der neuen Kasse.` },
      { q: 'Was zahlen KKH-Mitglieder in Rente?', a: `Mit ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente ${DE.eur(p.rente)} im Monat für Kranken- und Pflegeversicherung, die Rentenversicherung trägt die zweite Hälfte der Krankenversicherung. Eine Änderung des KKH-Satzes wirkt bei der Rente erst ab dem zweiten Folgemonat. Betriebsrenten über dem Freibetrag tragen den vollen Satz.` },
    ],
    body: (h) => `
<h2>Gutverdienende bei der KKH: der Höchstbeitrag in Zahlen</h2>
<p>Unter der Beitragsbemessungsgrenze wächst der Beitrag mit jedem Euro Gehalt, darüber bleibt er stehen. Wer gut verdient, zahlt deshalb bei jeder Kasse einen festen Höchstbeitrag, und der Unterschied zwischen zwei Kassen ist dort am größten. Bei der KKH liegt dieser Betrag mit ${h.pk(p.zb)} Zusatzbeitrag so:</p>
${h.table(['Gehalt im Monat', 'Jahr', 'Ihr Anteil bei der KKH', 'bei der hkk'], [
  [h.eur(BEISPIEL.lohn), '2026', h.eur(p.lohn), h.eur(hkk.lohn)],
  [h.eur(hochBrutto), '2026', h.eur(hoch26.selbst), h.eur(hochHkk.selbst)],
  [h.eur(hochBrutto), '2027', h.eur(hoch27.selbst), '·'],
], 'Kranken- und Pflegeversicherung, ein Kind; 2027 mit den vorläufigen Grenzen und dem heutigen Satz', ['l', 'r', 'r', 'r'])}
<p>Wer mit seinem Gehalt die Versicherungspflichtgrenze von ${h.eur(w.jaeg_jahr)} im Jahr überschreitet, kann in die private Krankenversicherung wechseln oder freiwillig gesetzlich bleiben. Für die Entscheidung zählt mehr als der Zusatzbeitrag: Familienversicherung für Kinder und Ehepartner gibt es nur gesetzlich, und wer ab dem 55. Geburtstag privat versichert ist, kommt in der Regel nicht mehr in die gesetzliche Versicherung zurück (§ 6 Abs. 3a SGB V). Ein Wechsel innerhalb der gesetzlichen Kassen ist dagegen jederzeit nach den üblichen Fristen möglich und kostet nichts; die Grenzen erklären die Seiten ${h.a('versicherungspflichtgrenze', 'Versicherungspflichtgrenze')} und ${h.a('beitragsbemessungsgrenze', 'Beitragsbemessungsgrenze')}.</p>
<h2>Die KKH unter den Ersatzkassen</h2>
${h.table(['Ersatzkasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber KKH im Jahr'], eks.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'r'])}
<h2>Wechsel und Erhöhung</h2>
<p>Ersatzkassen sind traditionell bundesweit geöffnet; ein Wechsel von oder zur KKH gelingt daher in jedem Land. Die neue Mitgliedschaft beginnt nach dem übernächsten Monat. Erhöht die KKH zum Jahreswechsel, gilt das Sonderkündigungsrecht, auch wenn Sie erst kurz Mitglied sind (${h.a('krankenkasse-wechseln', 'Termin berechnen')}). Selbstständige mit ${h.eur(BEISPIEL.gewinn)} Gewinn zahlen bei der KKH ${h.eur(p.selbst)} im Monat ohne Krankengeld. Beschäftigte teilen dem Arbeitgeber nach dem Wechsel nur den Namen der neuen Kasse mit; Meldungen und Beiträge laufen danach automatisch an die neue Kasse, und familienversicherte Angehörige wechseln mit.</p>`,
  },
  en: {
    slug: 'kkh-additional-contribution',
    nav: 'KKH',
    card: `${EN.pk(p.zb)} additional rate; on ${EN.eur(hochBrutto)} gross you pay the maximum of ${EN.eur(hoch26.selbst)} a month.`,
    title: 'KKH Additional Contribution 2027: Maximum Cost in Euros',
    description: `KKH additional rate in 2026: ${EN.pk(p.zb)}. What employees pay up to the maximum, voluntary members above the compulsory threshold, 2027 outlook and the gap to hkk.`,
    h1: 'KKH: additional rate and the maximum for high earners',
    intro: `KKH charges ${EN.pk(p.zb)}; earn more than ${EN.eur(w.bbgKv, 2)} gross and you pay ${EN.eur(hoch26.selbst)} a month there, likely ${EN.eur(hoch27.selbst)} in 2027.`,
    resume: `Kaufmännische Krankenkasse, known as KKH, is a substitute fund (Ersatzkasse) open nationwide. According to the GKV-Spitzenverband list it charges an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)}, ${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points ${p.unterDurchschnitt ? 'below' : 'above'} the official average of ${EN.pz(w.zb_durchschnitt)}. Of the ${eks.length} substitute funds it is number ${ekRang} on price, and it ranks ${p.rangBund} of all ${p.nBund} open funds. On ${EN.eur(BEISPIEL.lohn)} gross with one child you pay ${EN.eur(p.lohn)} a month. The rate shows most on high salaries: if you earn above the compulsory insurance threshold of ${EN.eur(w.jaeg_jahr)} a year and stay in statutory insurance voluntarily, KKH charges the maximum of ${EN.eur(hoch26.selbst)} a month, and your employer pays the same subsidy as for compulsory members. At the cheapest substitute fund, hkk, it would be ${EN.eur(sparHoch)} a year less. In 2027 the ceiling rises to ${EN.eur(w27.bbgKv)} a month under the cabinet decision, taking the maximum to ${EN.eur(hoch27.selbst)} at the same rate.`,
    faqs: [
      { q: 'What is the maximum contribution at KKH?', a: `In 2026, ${EN.eur(hoch26.selbst)} a month for your share of health and care insurance, with one child, from gross pay of ${EN.eur(w.bbgKv, 2)}. Nothing rises above that. For 2027 expect ${EN.eur(hoch27.selbst)} if KKH keeps its rate, because the health ceiling goes up by ${EN.eur(Math.round(w27.bbgKv - w.bbgKv))} a month.` },
      { q: 'I earn above the compulsory threshold. Does my employer still pay half?', a: `Yes, as a contribution subsidy under section 257 SGB V: the employer pays what it would pay for a compulsorily insured employee, half of the general rate and of KKH’s additional rate on your pay up to the ceiling, plus half the care contribution. Your own share therefore stays the same as for compulsory members.` },
      { q: 'How much does a high earner save moving from KKH to hkk?', a: `hkk charges ${EN.pk(hkk.k.zb!)}. On pay above the ceiling you pay ${EN.eur(sparHoch)} a year less there, on ${EN.eur(BEISPIEL.lohn)} gross ${EN.eur(Math.abs(j(hkk)))}. Both are substitute funds open nationwide; switching takes just an application to the new fund, after which you give your employer the new fund’s name.` },
      { q: 'What do KKH members pay in retirement?', a: `On a ${EN.eur(BEISPIEL.rente)} state pension, ${EN.eur(p.rente)} a month for health and care insurance; the pension insurance pays the other half of health insurance. A change in KKH’s rate reaches the pension only from the second month after it. Company pensions above the allowance pay the full rate.` },
    ],
    body: (h) => `
<h2>High earners at KKH: the maximum in figures</h2>
<p>Below the contribution ceiling the contribution grows with every euro of pay; above it, it stops. High earners therefore pay a fixed maximum at every fund, and that is where the difference between two funds is greatest. At KKH, with its ${h.pk(p.zb)} additional rate, the figures look like this:</p>
${h.table(['Monthly pay', 'Year', 'Your share at KKH', 'at hkk'], [
  [h.eur(BEISPIEL.lohn), '2026', h.eur(p.lohn), h.eur(hkk.lohn)],
  [h.eur(hochBrutto), '2026', h.eur(hoch26.selbst), h.eur(hochHkk.selbst)],
  [h.eur(hochBrutto), '2027', h.eur(hoch27.selbst), '·'],
], 'Health and care insurance, one child; 2027 with provisional ceilings and today’s rate', ['l', 'r', 'r', 'r'])}
<p>If your pay passes the compulsory insurance threshold of ${h.eur(w.jaeg_jahr)} a year, you can move to private health insurance or stay in statutory insurance voluntarily. More than the additional rate matters for that decision: free family cover for children and spouses exists only in statutory insurance, and anyone privately insured from age 55 can generally not return to statutory insurance (section 6(3a) SGB V). Switching between statutory funds, by contrast, is always possible within the usual deadlines and costs nothing; the thresholds are explained on the pages ${h.a('versicherungspflichtgrenze', 'compulsory insurance threshold')} and ${h.a('beitragsbemessungsgrenze', 'contribution ceiling')}.</p>
<h2>KKH among the substitute funds</h2>
${h.table(['Substitute fund', 'Additional rate', 'You pay a month', 'vs KKH a year'], eks.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'r'])}
<h2>Switching and rate rises</h2>
<p>Substitute funds have always been open nationwide, so moving to or from KKH works in every state. The new membership starts after the month after next. If KKH raises its rate at the turn of the year, the special termination right applies even if you joined only recently (${h.a('krankenkasse-wechseln', 'work out the date')}). Self-employed members on ${h.eur(BEISPIEL.gewinn)} profit pay ${h.eur(p.selbst)} a month at KKH without sick pay.</p>`,
  },
});
