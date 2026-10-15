import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { kasse, KASSEN } from '../../lib/engine/kassen';
import { angestellt } from '../../lib/engine/beitrag';

/** Sachsen: Rangliste aus der Liste des GKV-Spitzenverbands, Pflege-Sonderregel § 58 Abs. 3 SGB XI aus dem Motor. */
const p = landProfil('SN');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const tk = kasse('techniker-krankenkasse');
const sn = angestellt({ brutto: BEISPIEL.lohn, zb: aok.zb!, jahr: 2026, sachsen: true, eltern: 'k1' });
const sonst = angestellt({ brutto: BEISPIEL.lohn, zb: aok.zb!, jahr: 2026, sachsen: false, eltern: 'k1' });
const pvMehrMonat = sn.pv.mitglied - sonst.pv.mitglied;
const pvMehrJahr = Math.round(pvMehrMonat * 12);
const snKl = angestellt({ brutto: BEISPIEL.lohn, zb: aok.zb!, jahr: 2026, sachsen: true, eltern: 'kinderlos' });
const aokVsTkDe = aok.zb! < tk.zb! ? 'günstiger als' : aok.zb! > tk.zb! ? 'teurer als' : 'genauso teuer wie';
const aokVsTkEn = aok.zb! < tk.zb! ? 'cheaper than' : aok.zb! > tk.zb! ? 'dearer than' : 'the same price as';

export default defineGuide({
  id: 'guenstigste-krankenkasse-sachsen',
  group: 'laender',
  order: 61,
  land: 'SN',
  tool: 'beitrag',
  toolPreset: { land: 'SN', kasse: 'aok-plus-die-gesundheitskasse-fur-sachsen-und-thuringen' },
  related: ['aok-plus-die-gesundheitskasse-fur-sachsen-und-thuringen', 'guenstigste-krankenkasse-thueringen', 'guenstigste-krankenkasse-sachsen-anhalt', 'pflegeversicherung-beitrag', 'zusatzbeitrag-liste'],
  sources: ['gkvListe', 'sgb11_58', 'sgb11_55', 'sgb5_175'],
  de: {
    slug: 'guenstigste-krankenkasse-sachsen',
    nav: 'Sachsen',
    card: `Ab ${DE.pk(p.billig.zb!)} Zusatzbeitrag; Beschäftigte zahlen in Sachsen ${DE.pz(w.pv_sachsen_an_mehr)} mehr Pflegebeitrag als anderswo.`,
    title: 'Günstigste Krankenkasse Sachsen 2027: Kassen und Pflege',
    description: `Krankenkassen in Sachsen 2026/2027: Zusatzbeitrag von ${DE.pk(p.billig.zb!)} bis ${DE.pk(p.teuer.zb!)}, die AOK PLUS im Vergleich und warum Beschäftigte hier mehr Pflegebeitrag zahlen.`,
    h1: 'Günstigste Krankenkasse in Sachsen und der sächsische Pflegebeitrag',
    intro: `In Sachsen wählen Sie zwischen ${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; dazu kommt ein Pflegeanteil, der ${DE.pz(w.pv_sachsen_an_mehr)} über dem Rest der Republik liegt.`,
    resume: `Sachsen ist das einzige Bundesland, in dem Beschäftigte einen größeren Teil der Pflegeversicherung tragen als ihr Arbeitgeber: von den ${DE.pz(w.pv_satz)} zahlen sie ${DE.pz(w.pv_satz / 2 + w.pv_sachsen_an_mehr)}, der Arbeitgeber ${DE.pz(w.pv_satz / 2 - w.pv_sachsen_an_mehr)} (§ 58 Abs. 3 SGB XI). Bei ${DE.eur(BEISPIEL.lohn)} brutto kostet das ${DE.eur(pvMehrJahr)} im Jahr mehr als bei gleichem Lohn in einem Nachbarland, und zwar bei jeder Kasse gleich. Beim Zusatzbeitrag haben Sie dagegen die Wahl: ${p.n} Kassen sind für Sachsen geöffnet, von ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)} bis ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}. Bei diesem Lohn und einem Kind liegen zwischen beiden ${DE.eur(p.spanneJahr)} im Jahr für Sie. Die Ortskrankenkasse ist die AOK PLUS, die Sachsen und Thüringen gemeinsam versichert; sie verlangt ${DE.pk(aok.zb!)} und steht in der sächsischen Rangliste auf Platz ${p.aokRang}.`,
    faqs: [
      { q: 'Warum zahlen Arbeitnehmer in Sachsen mehr Pflegeversicherung?', a: `Als die Pflegeversicherung 1995 kam, sollten die Länder einen Feiertag streichen, damit die Arbeitgeber ihren Beitragsanteil über mehr Arbeitszeit ausgleichen. Sachsen behielt den Buß- und Bettag. Deshalb tragen Beschäftigte dort bis heute ${DE.pz(w.pv_sachsen_an_mehr)} des Pflegebeitrags zusätzlich und der Arbeitgeber entsprechend weniger, festgelegt in § 58 Abs. 3 SGB XI.` },
      { q: 'Gilt die sächsische Pflegeregel auch für Kinderlose?', a: `Ja, beide Regeln stapeln sich. Kinderlose ab 23 zahlen in Sachsen ${DE.pz(w.pv_satz / 2 + w.pv_sachsen_an_mehr + w.pv_kinderlos)} ihres Bruttos für die Pflege. Bei ${DE.eur(BEISPIEL.lohn)} sind das ${DE.eur(snKl.pv.mitglied)} im Monat, während ein Elternteil mit einem Kind ${DE.eur(sn.pv.mitglied)} zahlt. Der Arbeitgeberanteil bleibt in beiden Fällen bei ${DE.eur(sn.pv.andere)}.` },
      { q: 'Ich wohne in Sachsen und arbeite in Bayern. Welche Pflegeregel gilt?', a: `Für den Pflegeanteil zählt der Beschäftigungsort, nicht der Wohnort: § 58 Abs. 3 SGB XI knüpft an das Land an, in dem Sie arbeiten. Wer im Vogtland wohnt und in Hof beschäftigt ist, zahlt den normalen hälftigen Anteil. Bei der Wahl der Kasse zählen dagegen Wohn- und Arbeitsort, Sie dürfen also aus beiden Landeslisten wählen.` },
      { q: 'Wie günstig ist die AOK PLUS im Vergleich?', a: `Die AOK PLUS verlangt ${DE.pk(aok.zb!)} und ist damit ${aokVsTkDe} die Techniker Krankenkasse (${DE.pk(tk.zb!)}). Unter den ${aoks.length} Ortskrankenkassen hat sie den ${aokPlatz}. niedrigsten Satz. Gegenüber der günstigsten in Sachsen wählbaren Kasse zahlen Sie bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(p.aokVsBillig)} im Jahr mehr.` },
      { q: 'Warum ist mein Netto nach dem Umzug nach Sachsen gesunken?', a: `Wenn Kasse und Brutto gleich geblieben sind, liegt es meist am Pflegebeitrag: Mit dem Arbeitsort in Sachsen rechnet die Lohnabrechnung den zusätzlichen Anteil von ${DE.pz(w.pv_sachsen_an_mehr)} automatisch ein. Auf dem Lohnzettel steht er nicht als eigene Zeile, sondern steckt in der Pflegeversicherung des Arbeitnehmers.` },
    ],
    body: (h) => `
<h2>Was der Buß- und Bettag auf dem Lohnzettel kostet</h2>
<p>Die sächsische Sonderteilung betrifft nur Beschäftigte. Rentner, Selbstständige und Studierende zahlen die Pflege ohnehin allein, für sie ändert sich nichts. Für Angestellte rechnet der Rechner oben die Regel automatisch ein, sobald Sie Sachsen als Bundesland wählen. Das folgende Beispiel vergleicht denselben Lohn bei der AOK PLUS mit und ohne die sächsische Teilung:</p>
${h.table(['Pflegeversicherung, ein Kind', 'Sachsen', 'übrige Länder'], [
  ['Ihr Anteil im Monat', h.eur(sn.pv.mitglied, 2), h.eur(sonst.pv.mitglied, 2)],
  ['Anteil des Arbeitgebers', h.eur(sn.pv.andere, 2), h.eur(sonst.pv.andere, 2)],
  ['Ihr Gesamtbeitrag Kranken- und Pflegeversicherung', h.eur(sn.selbst), h.eur(sonst.selbst)],
], `${h.eur(BEISPIEL.lohn)} brutto, Zusatzbeitrag der AOK PLUS, 2026`, ['l', 'r', 'r'])}
<p>Mehr als ${h.eur(Math.ceil(pvMehrMonat))} im Monat sind das nicht, aber die Summe wächst bis zur Beitragsbemessungsgrenze mit. Ein Kassenwechsel kann den Nachteil nicht ausgleichen, weil der Pflegebeitrag bei allen Kassen gleich hoch ist; ausgleichen lässt sich nur der Zusatzbeitrag.</p>
<h2>Die günstigsten Kassen für Sachsen</h2>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, mit sächsischem Pflegeanteil im Rechner`, ['l', 'r', 'r', 'l'])}
<p>Die AOK PLUS ist für Sachsen und ${h.a('guenstigste-krankenkasse-thueringen', 'Thüringen')} zuständig. Wer zwischen Leipzig und Halle pendelt, kann zusätzlich die Kassen aus ${h.a('guenstigste-krankenkasse-sachsen-anhalt', 'Sachsen-Anhalt')} wählen, darunter die eigene AOK des Nachbarlandes. Welche Kasse welchen Satz verlangt, steht für alle Länder in der ${h.a('zusatzbeitrag-liste', 'vollständigen Liste')}; wie die Pflege mit Kindern sinkt, erklärt der Ratgeber zum ${h.a('pflegeversicherung-beitrag', 'Pflegebeitrag')}.</p>
<h2>Rente, Studium und Selbstständigkeit in Sachsen</h2>
<p>Wer in Dresden oder Chemnitz Rente bezieht, merkt von der sächsischen Teilung nichts: Rentner tragen die Pflegeversicherung schon immer vollständig selbst, die Rentenversicherung beteiligt sich nur an der Krankenversicherung. Dasselbe gilt für Studierende in Leipzig oder Freiberg, deren Beitrag auf dem gesetzlich festen BAföG-Bedarf von ${h.eur(w.bafoeg_bedarf)} beruht, und für freiwillig versicherte Selbstständige. Für diese drei Gruppen zählt in Sachsen allein der Zusatzbeitrag der gewählten Kasse, und dort lohnt der Vergleich genauso wie im übrigen Bundesgebiet. Stellen Sie im Rechner oben einfach Ihre Lage ein; die Rangliste ordnet sich neu.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-saxony',
    nav: 'Saxony',
    card: `From ${EN.pk(p.billig.zb!)} additional rate; employees in Saxony pay ${EN.pz(w.pv_sachsen_an_mehr)} more care contribution than elsewhere.`,
    title: 'Cheapest Health Insurance Saxony 2027: Funds and Care Rule',
    description: `Health funds in Saxony for 2026/2027: additional rates from ${EN.pk(p.billig.zb!)} to ${EN.pk(p.teuer.zb!)}, AOK PLUS compared, and why employees here pay more for long-term care cover.`,
    h1: 'Cheapest health insurance in Saxony and the Saxon care rule',
    intro: `In Saxony you choose from ${p.n} funds starting at ${EN.pk(p.billig.zb!)}; on top, employees carry a care share ${EN.pz(w.pv_sachsen_an_mehr)} higher than in the rest of Germany.`,
    resume: `Saxony (Sachsen) is the only German state where employees pay a bigger part of long-term care insurance than their employer: of the ${EN.pz(w.pv_satz)}, employees carry ${EN.pz(w.pv_satz / 2 + w.pv_sachsen_an_mehr)} and employers ${EN.pz(w.pv_satz / 2 - w.pv_sachsen_an_mehr)} (section 58(3) of Book XI of the Social Code). On ${EN.eur(BEISPIEL.lohn)} gross that costs ${EN.eur(pvMehrJahr)} a year more than for the same job across the border, and it is identical at every fund. The additional rate, on the other hand, is your choice: ${p.n} funds are open in Saxony, from ${p.billig.kurz} at ${EN.pk(p.billig.zb!)} to ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}. With one child at that pay, the gap between them is ${EN.eur(p.spanneJahr)} a year in your share. The regional fund is AOK PLUS, which covers Saxony and Thuringia together; it charges ${EN.pk(aok.zb!)} and ranks ${p.aokRang} in Saxony.`,
    faqs: [
      { q: 'Why do employees in Saxony pay more for care insurance?', a: `When long-term care insurance started in 1995, each state was to scrap a public holiday so employers could recover their share through extra working time. Saxony kept its Day of Repentance and Prayer (Buß- und Bettag). So employees there still carry an extra ${EN.pz(w.pv_sachsen_an_mehr)} of the care contribution and employers that much less, under section 58(3) SGB XI.` },
      { q: 'Does the Saxon care rule also apply to childless members?', a: `Yes, the two rules add up. Childless members aged 23 and over in Saxony pay ${EN.pz(w.pv_satz / 2 + w.pv_sachsen_an_mehr + w.pv_kinderlos)} of gross pay for care. On ${EN.eur(BEISPIEL.lohn)} that is ${EN.eur(snKl.pv.mitglied)} a month, against ${EN.eur(sn.pv.mitglied)} for a parent with one child. The employer pays ${EN.eur(sn.pv.andere)} in both cases.` },
      { q: 'I live in Saxony but work in Bavaria. Which care rule applies?', a: `For the care share, your place of work decides, not your home: section 58(3) SGB XI refers to the state where you are employed. Someone living in the Vogtland and working in Hof pays the normal half share. When choosing a fund, though, both home and workplace count, so you may pick from either state’s list.` },
      { q: 'How does AOK PLUS compare on price?', a: `AOK PLUS charges ${EN.pk(aok.zb!)}, which makes it ${aokVsTkEn} Techniker Krankenkasse (${EN.pk(tk.zb!)}). Among the ${aoks.length} regional AOK funds it has rate number ${aokPlatz} from the bottom. Compared with the cheapest fund open in Saxony you pay ${EN.eur(p.aokVsBillig)} a year more on ${EN.eur(BEISPIEL.lohn)} gross.` },
      { q: 'Does my Saxon employer have to show the higher care share on my payslip?', a: `The payslip lists your care contribution as one line, already including the Saxon extra of ${EN.pz(w.pv_sachsen_an_mehr)}. Payroll software applies it automatically when the place of work is in Saxony. If you moved from another state and your net pay fell slightly with no change in fund, this rule is the usual reason.` },
    ],
    body: (h) => `
<h2>What a kept public holiday costs on your payslip</h2>
<p>The Saxon split only affects employees. Pensioners, self-employed members and students pay care insurance alone anyway, so nothing changes for them. For employees, the calculator above applies the rule as soon as you pick Saxony as your state. The example compares the same pay at AOK PLUS with and without the Saxon split:</p>
${h.table(['Care insurance, one child', 'Saxony', 'other states'], [
  ['Your share a month', h.eur(sn.pv.mitglied, 2), h.eur(sonst.pv.mitglied, 2)],
  ['Employer share', h.eur(sn.pv.andere, 2), h.eur(sonst.pv.andere, 2)],
  ['Your total health and care contribution', h.eur(sn.selbst), h.eur(sonst.selbst)],
], `${h.eur(BEISPIEL.lohn)} gross, AOK PLUS additional rate, 2026`, ['l', 'r', 'r'])}
<p>It is under ${h.eur(Math.ceil(pvMehrMonat))} a month, but it rises with pay up to the contribution ceiling. Switching fund cannot offset it, since the care contribution is the same at every fund; only the additional rate differs.</p>
<h2>The cheapest funds for Saxony</h2>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `${h.eur(BEISPIEL.lohn)} gross, one child; the calculator adds the Saxon care share`, ['l', 'r', 'r', 'l'])}
<p>AOK PLUS covers Saxony and ${h.a('guenstigste-krankenkasse-thueringen', 'Thuringia')}. If you commute between Leipzig and Halle, you may also choose the funds open in ${h.a('guenstigste-krankenkasse-sachsen-anhalt', 'Saxony-Anhalt')}, including that state’s own AOK. Every fund’s rate is in the ${h.a('zusatzbeitrag-liste', 'full list')}, and the guide to ${h.a('pflegeversicherung-beitrag', 'care contributions')} explains how the care rate falls with children.</p>
<h2>Pensioners, students and the self-employed in Saxony</h2>
<p>If you draw a pension in Dresden or Chemnitz, the Saxon split makes no difference: pensioners have always paid care insurance entirely themselves, and the pension insurance only shares the health contribution. The same goes for students in Leipzig or Freiberg, whose contribution rests on the statutory BAföG need rate of ${h.eur(w.bafoeg_bedarf)}, and for self-employed voluntary members. For these three groups only the chosen fund’s additional rate matters in Saxony, and comparing is just as worthwhile as anywhere else in Germany. Set your situation in the calculator above and the ranking reorders itself.</p>`,
  },
});
