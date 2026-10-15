import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, landProfil, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { kasse, KASSEN } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** AOK Hessen: nur Hessen; Rhein-Main-Pendler aus Rheinland-Pfalz und Bayern haben eine zweite Ortskrankenkasse zur Wahl. */
const ID = 'aok-die-gesundheitskasse-in-hessen';
const p = profil(ID);
const w = J(2026);
const he = landProfil('HE');
const me = kostenZeile(p.k);
const rp = kostenZeile(kasse('aok-rheinland-pfalz-saarland-die-gesundheitskasse'));
const by = kostenZeile(kasse('aok-bayern-die-gesundheitskasse'));
const th = kostenZeile(kasse('aok-plus-die-gesundheitskasse-fur-sachsen-und-thuringen'));
const ni = kostenZeile(kasse('aok-die-gesundheitskasse-fur-niedersachsen'));
const nw = kostenZeile(kasse('aok-nordwest-die-gesundheitskasse'));
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < p.zb).length + 1;
const gleich = aoks.filter((k) => k.zb === p.zb && k.id !== ID);
const rHE = p.raengeLand.find((r) => r.l === 'HE')!;
const j = (x: { lohn: number }) => Math.round((x.lohn - me.lohn) * 12);
const ringsum = [me, rp, by, th, ni, nw].sort((a, b) => a.k.zb! - b.k.zb!);
const billigerNachbarn = ringsum.filter((x) => x.k.zb! < p.zb);
const teuerRegional = he.regional.filter((k) => k.zb! > p.zb).length;
const ordEn = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 20,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID, land: 'HE' },
  related: ['guenstigste-krankenkasse-hessen', 'guenstigste-krankenkasse-rheinland-pfalz', 'aok-bayern-die-gesundheitskasse', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_175', 'sgb5_249'],
  de: {
    slug: 'aok-hessen-zusatzbeitrag',
    nav: 'AOK Hessen',
    card: `${DE.pk(p.zb)} Zusatzbeitrag, nur in Hessen geöffnet; Pendler aus Mainz oder Aschaffenburg können eine zweite AOK wählen.`,
    title: 'AOK Hessen Zusatzbeitrag 2027: Beitrag, Rhein-Main-Pendler',
    description: `AOK Hessen, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Monatsbeitrag für Beschäftigte und Rentner, Vergleich mit allen Nachbar-AOKs, Wahlrecht für Pendler an Rhein und Main.`,
    h1: 'AOK Hessen: Zusatzbeitrag und Wahl für Pendler',
    intro: `Die AOK Hessen verlangt ${DE.pk(p.zb)}; ${billigerNachbarn.length ? `${billigerNachbarn.map((x) => x.k.kurz).join(' und ')} ${billigerNachbarn.length === 1 ? 'ist' : 'sind'} als Nachbar-AOK günstiger` : 'keine Nachbar-AOK ist günstiger'}.`,
    resume: `Für Hessen gibt es eine eigene Ortskrankenkasse, amtlich „AOK - Die Gesundheitskasse in Hessen“. Die Liste des GKV-Spitzenverbands zeigt sie mit ${DE.pk(p.zb)} Zusatzbeitrag und geöffnet nur für Hessen. Unter den ${aoks.length} AOKs steht sie auf Platz ${aokPlatz}${gleich.length ? `, gleichauf mit ${gleich.map((k) => k.kurz).join(' und ')}` : ''}. Wer in Kassel, Frankfurt oder Darmstadt wohnt oder arbeitet, zahlt bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung; Rentner mit ${DE.eur(BEISPIEL.rente)} Rente ${DE.eur(p.rente)}. In Hessen sind ${rHE.n} Kassen für jeden wählbar, ${rHE.rang - 1} davon mit niedrigerem Satz. Weil das Rhein-Main-Gebiet über die Landesgrenzen reicht, haben viele Pendler eine zweite Ortskrankenkasse zur Auswahl: Wer in Mainz wohnt, kann auch die ${rp.k.kurz} wählen (${DE.pk(rp.k.zb!)}), wer in Aschaffenburg wohnt, die AOK Bayern (${DE.pk(by.k.zb!)}). Gegenüber dem amtlichen Durchschnittssatz von ${DE.pz(w.zb_durchschnitt)} liegt die AOK Hessen bei diesem Lohn ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} im Jahr ${p.unterDurchschnitt ? 'darunter' : 'darüber'}.`,
    faqs: [
      { q: 'Ich wohne in Mainz und arbeite in Frankfurt. Lohnt die AOK Rheinland-Pfalz/Saarland?', a: `Sie dürfen beide Ortskrankenkassen wählen, die rheinland-pfälzische über den Wohnort, die hessische über den Arbeitsort. Die ${rp.k.kurz} verlangt ${DE.pk(rp.k.zb!)}; bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie dort ${DE.eur(Math.abs(j(rp)))} im Jahr ${j(rp) < 0 ? 'weniger' : 'mehr'} als bei der AOK Hessen. Die Pflege wird in beiden Ländern gleich geteilt.` },
      { q: 'Wie viele regionale Kassen in Hessen sind teurer als die AOK?', a: `Von den ${he.regional.length} Kassen, die nur für Hessen und einige weitere Länder geöffnet sind, verlangen ${teuerRegional} einen höheren Satz als die AOK Hessen. Bundesweit geöffnete Kassen kommen hinzu; die vollständige Rangliste für Hessen zeigt der Rechner oben, sobald Hessen als Land eingestellt ist.` },
      { q: 'Was zahle ich bei der AOK Hessen als Selbstständiger?', a: `Ohne Krankengeld den ermäßigten Satz von ${DE.pz(w.kv_ermaessigt)} plus ${DE.pk(p.zb)} Zusatzbeitrag und die volle Pflege, allein. Bei ${DE.eur(BEISPIEL.gewinn)} Monatsgewinn ergibt das ${DE.eur(p.selbst)}. Die AOK setzt den Beitrag nach dem letzten Einkommensteuerbescheid vorläufig fest und gleicht ihn später ab.` },
      { q: 'Wie viel kostet die AOK Hessen Studierende in Gießen oder Marburg?', a: `${DE.eur(p.student)} im Monat für Studierende unter 23 oder mit Kind, berechnet auf den gesetzlichen BAföG-Bedarf von ${DE.eur(w.bafoeg_bedarf)} mit ${DE.pz(w.kvStudent)} plus Zusatzbeitrag. Ein Studienort in Hessen genügt für die Wahl der AOK Hessen nicht immer; maßgeblich sind Wohnort oder Beschäftigungsort in Hessen.` },
    ],
    body: (h) => `
<h2>Hessen in der Mitte: sechs Ortskrankenkassen ringsum</h2>
<p>Kein anderes Flächenland grenzt an so viele Länder mit eigener AOK, von Bayern im Süden bis Niedersachsen im Norden. Für Grenzpendler zwischen Hessen und Bayern, Thüringen, Niedersachsen, Nordrhein-Westfalen oder Rheinland-Pfalz bedeutet das, dass zwei Ortskrankenkassen zur Wahl stehen: die des Wohnorts und die des Arbeitsorts. Die Tabelle stellt die AOK Hessen den Ortskrankenkassen ringsum gegenüber, in Euro für Ihren eigenen Anteil.</p>
${h.table(['AOK', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber AOK Hessen im Jahr'], ringsum.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'r'])}
<h2>Was die AOK Hessen kostet</h2>
${h.table(['Situation', 'Bemessung', 'Ihr Anteil im Monat'], [
  ['Arbeitnehmer', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Arbeitnehmer', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Arbeitnehmer an der Grenze', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studium', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, ein Kind; selbstständig ohne Krankengeld', ['l', 'r', 'r'])}
<p>Mit einem höheren Gehalt wächst der Unterschied, weil der Zusatzbeitrag bis zur Bemessungsgrenze mitläuft. Gegenüber der günstigsten frei wählbaren Kasse, ${p.billigste.kurz}, zahlen Mitglieder der AOK Hessen bei ${h.eur(BEISPIEL.lohn)} brutto ${h.eur(p.proJahrVsBilligste)} im Jahr mehr, an der Bemessungsgrenze ${h.eur(p.proJahrVsBilligsteBbg)}. Ob ${p.billigste.kurz} in Hessen geöffnet ist, zeigt die Rangliste; die Seite ${h.a('guenstigste-krankenkasse-hessen', 'günstigste Krankenkasse in Hessen')} fasst alle wählbaren Kassen zusammen.</p>
<h2>Ein- und Austritt</h2>
<p>Eintreten kann, wer in Hessen wohnt oder beschäftigt ist; für den Austritt genügt der Antrag bei einer anderen Kasse, die den Wechsel meldet. Die Frist endet mit dem übernächsten Monat, gleich an welchem Tag im Monat Sie den Antrag stellen. Erhöht die AOK Hessen ihren Satz, entfällt die Bindung von zwölf Monaten. Familienversicherte Angehörige wechseln mit dem Mitglied, ohne eigenen Antrag. Beschäftigte geben dem Arbeitgeber die neue Kasse an, Rentner müssen nichts tun, weil die neue Kasse die Rentenversicherung informiert. Wer eine Grenzregion im Blick hat, findet die Nachbarseite ${h.a('guenstigste-krankenkasse-rheinland-pfalz', 'Rheinland-Pfalz')} und den ${h.a('krankenkasse-wechseln', 'Fristenrechner')}.</p>`,
  },
  en: {
    slug: 'aok-hessen-additional-contribution',
    nav: 'AOK Hessen',
    card: `${EN.pk(p.zb)} additional rate, open in Hesse only; commuters from Mainz or Aschaffenburg can choose a second AOK.`,
    title: 'AOK Hessen Additional Contribution 2027: Cost and Commuters',
    description: `AOK Hessen additional rate in 2026: ${EN.pk(p.zb)}. Monthly cost for employees and pensioners, set against every neighbouring AOK, choices for Rhine-Main commuters.`,
    h1: 'AOK Hessen: additional rate and the choice for commuters',
    intro: `AOK Hessen charges ${EN.pk(p.zb)}; ${billigerNachbarn.length ? `${billigerNachbarn.map((x) => x.k.kurz).join(' and ')} ${billigerNachbarn.length === 1 ? 'is' : 'are'} cheaper among the neighbouring AOKs` : 'no neighbouring AOK is cheaper'}.`,
    resume: `Hesse (Hessen) has its own regional health fund, officially “AOK - Die Gesundheitskasse in Hessen”. The GKV-Spitzenverband list shows it with an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)}, open in Hesse only. Among the ${aoks.length} AOKs it ranks ${ordEn(aokPlatz)}${gleich.length ? `, level with ${gleich.map((k) => k.kurz).join(' and ')}` : ''}. Anyone living or working in Kassel, Frankfurt or Darmstadt pays ${EN.eur(p.lohn)} a month for health and care insurance on ${EN.eur(BEISPIEL.lohn)} gross with one child; pensioners with a ${EN.eur(BEISPIEL.rente)} pension pay ${EN.eur(p.rente)}. In Hesse ${rHE.n} funds are open to anyone, ${rHE.rang - 1} of them with a lower rate. Because the Rhine-Main area spills across state borders, many commuters can pick a second regional fund: if you live in Mainz you can also choose ${rp.k.kurz} (${EN.pk(rp.k.zb!)}), if you live in Aschaffenburg AOK Bayern (${EN.pk(by.k.zb!)}). Compared with the official average rate of ${EN.pz(w.zb_durchschnitt)}, AOK Hessen is ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} a year ${p.unterDurchschnitt ? 'below' : 'above'} at that pay.`,
    faqs: [
      { q: 'I live in Mainz and work in Frankfurt. Is AOK Rheinland-Pfalz/Saarland worth it?', a: `You may choose either regional fund, the Rhineland-Palatinate one through your home and the Hessian one through your job. ${rp.k.kurz} charges ${EN.pk(rp.k.zb!)}; on ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(Math.abs(j(rp)))} a year ${j(rp) < 0 ? 'less' : 'more'} there than at AOK Hessen. Care insurance is split the same way in both states.` },
      { q: 'How many regional funds in Hesse are dearer than the AOK?', a: `Of the ${he.regional.length} funds open only to Hesse and a few other states, ${teuerRegional} charge a higher rate than AOK Hessen. Nationwide funds come on top; the calculator above shows the full ranking for Hesse once you set Hesse as your state.` },
      { q: 'What does AOK Hessen cost a self-employed member?', a: `Without sick pay, the reduced rate of ${EN.pz(w.kv_ermaessigt)} plus the ${EN.pk(p.zb)} additional rate and full care insurance, all paid by you. On ${EN.eur(BEISPIEL.gewinn)} monthly profit that is ${EN.eur(p.selbst)}. The AOK sets the contribution from your latest income tax assessment and adjusts it later.` },
      { q: 'How much does AOK Hessen cost students in Giessen or Marburg?', a: `${EN.eur(p.student)} a month for students under 23 or with a child, based on the statutory BAföG need rate of ${EN.eur(w.bafoeg_bedarf)} at ${EN.pz(w.kvStudent)} plus the additional rate. Studying in Hesse alone does not always qualify you to join AOK Hessen; what counts is a home or a job in Hesse.` },
    ],
    body: (h) => `
<h2>Hesse in the middle: six regional funds all around</h2>
<p>No other large state borders so many states with an AOK of their own, from Bavaria in the south to Lower Saxony in the north. For commuters between Hesse and Bavaria, Thuringia, Lower Saxony, North Rhine-Westphalia or Rhineland-Palatinate, two regional funds are on offer: the one where you live and the one where you work. The table sets AOK Hessen against the regional funds around it, in euros for your own share.</p>
${h.table(['AOK', 'Additional rate', 'You pay a month', 'vs AOK Hessen a year'], ringsum.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'r'])}
<h2>What AOK Hessen costs</h2>
${h.table(['Situation', 'Base', 'Your share a month'], [
  ['Employee', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employee', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employee at the ceiling', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Pension', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, one child; self-employed without sick pay', ['l', 'r', 'r'])}
<p>With higher pay the gap widens, because the additional rate applies up to the contribution ceiling. Compared with the cheapest fund open to everyone, ${p.billigste.kurz}, AOK Hessen members pay ${h.eur(p.proJahrVsBilligste)} a year more on ${h.eur(BEISPIEL.lohn)} gross and ${h.eur(p.proJahrVsBilligsteBbg)} at the ceiling. Whether ${p.billigste.kurz} is open in Hesse is shown in the ranking; the page ${h.a('guenstigste-krankenkasse-hessen', 'cheapest health insurance in Hesse')} brings every open fund together.</p>
<h2>Joining and leaving</h2>
<p>You can join if you live or work in Hesse; to leave, apply to another fund, which reports the switch. Notice runs to the end of the month after next, whatever day of the month you apply. If AOK Hessen raises its rate, the twelve-month lock-in falls away. Family members covered free of charge move with the member, with no application of their own. Employees tell their employer the new fund; pensioners need do nothing, as the new fund informs the pension insurance. If you live near a border, see the neighbouring page ${h.a('guenstigste-krankenkasse-rheinland-pfalz', 'Rhineland-Palatinate')} and the ${h.a('krankenkasse-wechseln', 'deadline calculator')}.</p>`,
  },
});
