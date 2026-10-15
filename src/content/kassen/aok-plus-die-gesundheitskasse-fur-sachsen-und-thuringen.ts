import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { KASSEN, rangliste } from '../../lib/engine/kassen';
import { angestellt } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** AOK PLUS: eine AOK für zwei Länder; in Sachsen tragen Beschäftigte mehr Pflegebeitrag (§ 58 Abs. 3 SGB XI). */
const ID = 'aok-plus-die-gesundheitskasse-fur-sachsen-und-thuringen';
const p = profil(ID);
const w = J(2026);
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < p.zb).length + 1;
const sn = angestellt({ brutto: BEISPIEL.lohn, zb: p.zb, jahr: 2026, sachsen: true, eltern: 'k1' });
const th = angestellt({ brutto: BEISPIEL.lohn, zb: p.zb, jahr: 2026, sachsen: false, eltern: 'k1' });
const snMehrJahr = Math.round((sn.selbst - th.selbst) * 12);
const rSN = p.raengeLand.find((r) => r.l === 'SN')!, rTH = p.raengeLand.find((r) => r.l === 'TH')!;
const vorSN = rangliste('SN').slice(0, 3), vorTH = rangliste('TH').slice(0, 3);
const ost = ['aok-sachsen-anhalt-die-gesundheitskasse', 'aok-nordost-die-gesundheitskasse'].map((id) => kostenZeile(KASSEN.find((k) => k.id === id)!));
const tab = [kostenZeile(p.k), ...ost].sort((a, b) => a.k.zb! - b.k.zb!);
const lageDe = (r: { rang: number; n: number }) => (r.rang / r.n <= 1 / 3 ? 'im vorderen Drittel' : r.rang / r.n <= 2 / 3 ? 'im Mittelfeld' : 'im hinteren Drittel');
const lageEn = (r: { rang: number; n: number }) => (r.rang / r.n <= 1 / 3 ? 'in the cheapest third' : r.rang / r.n <= 2 / 3 ? 'mid-table' : 'in the dearest third');
const d = (x: { lohn: number }) => Math.round((x.lohn - p.lohn) * 12);
const ordEn = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 15,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID, land: 'SN' },
  related: ['guenstigste-krankenkasse-sachsen', 'guenstigste-krankenkasse-thueringen', 'pflegeversicherung-beitrag', 'aok-nordost-die-gesundheitskasse'],
  sources: ['gkvListe', 'sgb11_58', 'sgb11_55', 'sgb5_242'],
  de: {
    slug: 'aok-plus-zusatzbeitrag',
    nav: 'AOK PLUS',
    card: `${DE.pk(p.zb)} Zusatzbeitrag in Sachsen und Thüringen; Beschäftigte in Sachsen zahlen mehr Pflegebeitrag.`,
    title: 'AOK PLUS Zusatzbeitrag 2027: Sachsen und Thüringen in Euro',
    description: `AOK PLUS, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Monatsbeitrag in Sachsen und Thüringen, warum sächsische Beschäftigte mehr Pflege zahlen, Vergleich in beiden Ländern.`,
    h1: 'AOK PLUS: Zusatzbeitrag in Sachsen und Thüringen',
    intro: `Die AOK PLUS verlangt ${DE.pk(p.zb)}; wer in Sachsen arbeitet, zahlt wegen der Pflege ${DE.eur(snMehrJahr)} im Jahr mehr als in Thüringen.`,
    resume: `Die AOK PLUS ist die gemeinsame Ortskrankenkasse von Sachsen und Thüringen; die Liste des GKV-Spitzenverbands zeigt sie mit ${DE.pk(p.zb)} Zusatzbeitrag und geöffnet für genau diese beiden Länder. Der Krankenkassenbeitrag ist in Leipzig und Erfurt derselbe, der Pflegebeitrag nicht: Sachsen hat 1995 als einziges Land keinen Feiertag zur Finanzierung der Pflegeversicherung gestrichen, deshalb tragen Beschäftigte dort ${DE.pz(w.pv_sachsen_an_mehr)} mehr und Arbeitgeber entsprechend weniger (§ 58 Abs. 3 SGB XI). Bei ${DE.eur(BEISPIEL.lohn)} brutto mit einem Kind zahlt ein sächsisches Mitglied ${DE.eur(sn.selbst)} im Monat, ein thüringisches ${DE.eur(th.selbst)}. Maßgeblich ist der Beschäftigungsort, nicht der Wohnort. Unter den ${aoks.length} AOKs hat die AOK PLUS den ${aokPlatz}. niedrigsten Satz. In Sachsen sind ${rSN.rang - 1} wählbare Kassen günstiger, in Thüringen ${rTH.rang - 1}. Gegenüber dem amtlichen Durchschnittssatz von ${DE.pz(w.zb_durchschnitt)} kostet sie bei diesem Lohn ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} im Jahr ${p.unterDurchschnitt ? 'weniger' : 'mehr'}.`,
    faqs: [
      { q: 'Warum zahle ich bei der AOK PLUS in Sachsen mehr als ein Kollege in Thüringen?', a: `Nicht wegen der Kasse, sondern wegen des Arbeitsorts. In Sachsen gilt für die Pflegeversicherung eine Sonderteilung: Beschäftigte tragen ${DE.pz(w.pv_satz / 2 + w.pv_sachsen_an_mehr)} statt ${DE.pz(w.pv_satz / 2)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto sind das ${DE.eur(snMehrJahr)} im Jahr. Der Arbeitgeber zahlt in Sachsen genau so viel weniger, die Summe bleibt gleich.` },
      { q: 'Welche Kassen sind in Sachsen günstiger als die AOK PLUS?', a: `In Sachsen stehen ${rSN.n} Kassen jedem offen. Den niedrigsten Satz haben ${vorSN.map((k) => `${k.kurz} (${DE.pk(k.zb!)})`).join(', ')}. Bei ${DE.eur(BEISPIEL.lohn)} brutto spart die günstigste gegenüber der AOK PLUS ${DE.eur(p.proJahrVsBilligste)} im Jahr. Die sächsische Pflegeregel gilt bei jeder Kasse gleich, sie spricht also weder für noch gegen einen Wechsel.` },
      { q: 'Und in Thüringen: welche Kassen liegen vor der AOK PLUS?', a: `In Thüringen sind ${rTH.n} Kassen wählbar, also weniger als in Sachsen, weil manche regionale Betriebskrankenkasse dort nicht geöffnet ist. Vorn liegen ${vorTH.map((k) => `${k.kurz} (${DE.pk(k.zb!)})`).join(', ')}; die AOK PLUS steht auf Rang ${rTH.rang}. Die vollständige Liste für Ihr Land zeigt der Rechner oben.` },
      { q: 'Gilt die sächsische Pflegeregel auch für Rentner der AOK PLUS?', a: `Nein. Rentner tragen den Pflegebeitrag ohnehin allein, mit ${DE.pz(w.pv_satz)} ihrer Rente, in Sachsen wie in Thüringen. Bei ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente zieht die Rentenversicherung bei der AOK PLUS insgesamt ${DE.eur(p.rente)} im Monat ab. Die Sonderteilung betrifft nur Beschäftigte und ihre Arbeitgeber.` },
    ],
    body: (h) => `
<h2>Eine Ortskrankenkasse für zwei Länder</h2>
<p>Die AOK PLUS ist aus dem Zusammenschluss der Ortskrankenkassen Sachsens und Thüringens entstanden und gilt in beiden Ländern mit einem gemeinsamen Satz. Für Versicherte zwischen Vogtland und Eichsfeld bedeutet das: Ein Umzug von Dresden nach Jena ändert am Zusatzbeitrag nichts, und wer in einem Land wohnt und im anderen arbeitet, bleibt bei derselben Kasse. In Sachsen-Anhalt, Berlin oder Brandenburg ist die AOK PLUS dagegen nicht geöffnet; dort gibt es jeweils eine eigene Ortskrankenkasse, wie die Tabelle zeigt.</p>
${h.table(['Ostdeutsche AOK', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber AOK PLUS im Jahr'], tab.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, ohne sächsische Pflegeregel`, ['l', 'r', 'r', 'r'])}
<h2>Pflege in Sachsen: der Unterschied in Zahlen</h2>
${h.table(['Arbeitsort', 'Pflege, Ihr Anteil', 'Pflege, Arbeitgeber', 'Ihr Beitrag gesamt'], [
  ['Sachsen', h.eur(sn.pv.mitglied), h.eur(sn.pv.andere), h.eur(sn.selbst)],
  ['Thüringen', h.eur(th.pv.mitglied), h.eur(th.pv.andere), h.eur(th.selbst)],
], `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, AOK PLUS, 2026`, ['l', 'r', 'r', 'r'])}
<p>Die Regel stammt aus dem Jahr 1995: Damit die Arbeitgeber durch den neuen Pflegebeitrag nicht belastet würden, strichen die Länder einen Feiertag, meist den Buß- und Bettag. Sachsen behielt ihn, und seitdem zahlen sächsische Beschäftigte den Ausgleich selbst. Im Rechner oben wird das berücksichtigt, sobald Sie Sachsen als Land wählen; Kinderlose ab 23 zahlen zusätzlich ${h.pz(w.pv_kinderlos)}. Mehr zur Pflege steht unter ${h.a('pflegeversicherung-beitrag', 'Beitrag zur Pflegeversicherung')}.</p>
<h2>Bleiben oder wechseln?</h2>
<p>Gemessen am Preis liegt die AOK PLUS in Sachsen ${lageDe(rSN)} der wählbaren Kassen, in Thüringen ${lageDe(rTH)}. Für Beschäftigte mit ${h.eur(BEISPIEL.lohnNiedrig)} brutto beträgt der eigene Monatsbeitrag ${h.eur(p.lohnNiedrig)} ohne die sächsische Pflegeregel, an der Bemessungsgrenze ${h.eur(p.lohnBbg)}. Wer wechseln will, findet die günstigsten wählbaren Kassen auf den Seiten für ${h.a('guenstigste-krankenkasse-sachsen', 'Sachsen')} und ${h.a('guenstigste-krankenkasse-thueringen', 'Thüringen')}. Der Wechsel wird zum Ende des übernächsten Monats wirksam; erhöht die AOK PLUS ihren Satz, entfällt die zwölfmonatige Bindung. Für Selbstständige mit ${h.eur(BEISPIEL.gewinn)} Gewinn kostet die AOK PLUS ${h.eur(p.selbst)} im Monat, für Studierende ${h.eur(p.student)}.</p>`,
  },
  en: {
    slug: 'aok-plus-additional-contribution',
    nav: 'AOK PLUS',
    card: `${EN.pk(p.zb)} additional rate in Saxony and Thuringia; employees in Saxony pay more for care insurance.`,
    title: 'AOK PLUS Additional Contribution 2027: Saxony and Thuringia',
    description: `AOK PLUS additional rate in 2026: ${EN.pk(p.zb)}. Monthly cost in Saxony and Thuringia, why Saxon employees pay more care insurance, ranking among both states’ funds.`,
    h1: 'AOK PLUS: additional rate in Saxony and Thuringia',
    intro: `AOK PLUS charges ${EN.pk(p.zb)}; working in Saxony costs ${EN.eur(snMehrJahr)} a year more than in Thuringia because of care insurance.`,
    resume: `AOK PLUS is the joint regional health fund of Saxony (Sachsen) and Thuringia (Thüringen); the GKV-Spitzenverband list shows it with an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)}, open in exactly these two states. Health insurance costs the same in Leipzig and Erfurt, care insurance does not: in 1995 Saxony was the only state that kept all its public holidays when long-term care insurance began, so employees there pay ${EN.pz(w.pv_sachsen_an_mehr)} more and employers that much less (section 58(3) SGB XI). On ${EN.eur(BEISPIEL.lohn)} gross with one child, a member working in Saxony pays ${EN.eur(sn.selbst)} a month, one working in Thuringia ${EN.eur(th.selbst)}. The place of work counts, not the home address. Among the ${aoks.length} AOKs, AOK PLUS has the ${ordEn(aokPlatz)} lowest rate. In Saxony ${rSN.rang - 1} open funds are cheaper, in Thuringia ${rTH.rang - 1}. Against the official average of ${EN.pz(w.zb_durchschnitt)} it costs ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} a year ${p.unterDurchschnitt ? 'less' : 'more'} at that pay.`,
    faqs: [
      { q: 'Why do I pay more at AOK PLUS in Saxony than a colleague in Thuringia?', a: `Not because of the fund but because of where you work. Saxony has a special care insurance split: employees carry ${EN.pz(w.pv_satz / 2 + w.pv_sachsen_an_mehr)} instead of ${EN.pz(w.pv_satz / 2)}. On ${EN.eur(BEISPIEL.lohn)} gross that is ${EN.eur(snMehrJahr)} a year. Employers in Saxony pay exactly that much less, so the total stays the same.` },
      { q: 'Which funds in Saxony are cheaper than AOK PLUS?', a: `In Saxony ${rSN.n} funds are open to anyone. The lowest rates belong to ${vorSN.map((k) => `${k.kurz} (${EN.pk(k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross the cheapest saves ${EN.eur(p.proJahrVsBilligste)} a year compared with AOK PLUS. The Saxon care rule applies equally at every fund, so it is no argument for or against switching.` },
      { q: 'And in Thuringia: which funds rank ahead of AOK PLUS?', a: `In Thuringia ${rTH.n} funds are open, fewer than in Saxony because some regional company funds are not open there. Ahead are ${vorTH.map((k) => `${k.kurz} (${EN.pk(k.zb!)})`).join(', ')}; AOK PLUS ranks ${rTH.rang}. The calculator above shows the complete list for your state.` },
      { q: 'Does the Saxon care rule apply to AOK PLUS pensioners?', a: `No. Pensioners pay care insurance alone anyway, at ${EN.pz(w.pv_satz)} of their pension, in Saxony as in Thuringia. On a ${EN.eur(BEISPIEL.rente)} state pension, the pension insurance deducts ${EN.eur(p.rente)} a month in total for AOK PLUS. The special split only concerns employees and their employers.` },
    ],
    body: (h) => `
<h2>One regional fund for two states</h2>
<p>AOK PLUS grew out of the merger of the Saxon and Thuringian regional funds and charges one joint rate in both states. For members between the Vogtland and the Eichsfeld this means moving from Dresden to Jena leaves the additional rate unchanged, and anyone living in one state and working in the other stays with the same fund. In Saxony-Anhalt, Berlin or Brandenburg AOK PLUS is not open; each has its own regional fund, as the table shows.</p>
${h.table(['Eastern AOK', 'Additional rate', 'You pay a month', 'vs AOK PLUS a year'], tab.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `${h.eur(BEISPIEL.lohn)} gross, one child, without the Saxon care rule`, ['l', 'r', 'r', 'r'])}
<h2>Care insurance in Saxony: the difference in figures</h2>
${h.table(['Place of work', 'Care, your share', 'Care, employer', 'Your total'], [
  ['Saxony', h.eur(sn.pv.mitglied), h.eur(sn.pv.andere), h.eur(sn.selbst)],
  ['Thuringia', h.eur(th.pv.mitglied), h.eur(th.pv.andere), h.eur(th.selbst)],
], `${h.eur(BEISPIEL.lohn)} gross, one child, AOK PLUS, 2026`, ['l', 'r', 'r', 'r'])}
<p>The rule dates from 1995: to spare employers the cost of the new care contribution, the states scrapped a public holiday, mostly the Day of Repentance and Prayer (Buß- und Bettag). Saxony kept it, and Saxon employees have paid the difference themselves ever since. The calculator above applies this as soon as you pick Saxony; childless members aged 23 and over add ${h.pz(w.pv_kinderlos)}. More under ${h.a('pflegeversicherung-beitrag', 'care insurance contributions')}.</p>
<h2>Stay or switch?</h2>
<p>On price, AOK PLUS sits ${lageEn(rSN)} of the funds open in Saxony and ${lageEn(rTH)} in Thuringia. Employees on ${h.eur(BEISPIEL.lohnNiedrig)} gross pay ${h.eur(p.lohnNiedrig)} a month without the Saxon care rule, ${h.eur(p.lohnBbg)} at the ceiling. If you want to move, the cheapest funds open to you are listed on the pages for ${h.a('guenstigste-krankenkasse-sachsen', 'Saxony')} and ${h.a('guenstigste-krankenkasse-thueringen', 'Thuringia')}. A switch takes effect at the end of the month after next; if AOK PLUS raises its rate, the twelve-month lock-in falls away. A self-employed member with ${h.eur(BEISPIEL.gewinn)} profit pays ${h.eur(p.selbst)} a month at AOK PLUS, a student ${h.eur(p.student)}.</p>`,
  },
});
