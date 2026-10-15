import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { kasse, KASSEN } from '../../lib/engine/kassen';
import { angestellt } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** AOK Niedersachsen: Ortskrankenkasse eines Flächenlands, das Bremen umschließt; Familienlagen aus dem Motor. */
const ID = 'aok-die-gesundheitskasse-fur-niedersachsen';
const p = profil(ID);
const w = J(2026);
const hb = kostenZeile(kasse('aok-bremen-bremerhaven'));
const vsHb = Math.round((hb.lohn - p.lohn) * 12);
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < p.zb).length + 1;
const gleich = aoks.filter((k) => k.zb === p.zb && k.id !== ID);
const rNI = p.raengeLand.find((r) => r.l === 'NI')!;
const fam = (e: 'kinderlos' | 'k1' | 'k3' | 'k5') => angestellt({ brutto: BEISPIEL.lohn, zb: p.zb, jahr: 2026, eltern: e }).selbst;
const ohne = fam('kinderlos'), eins = fam('k1'), drei = fam('k3'), fuenf = fam('k5');
const nachbarn = ['aok-bremen-bremerhaven', 'aok-nordwest-die-gesundheitskasse', 'aok-sachsen-anhalt-die-gesundheitskasse', 'aok-die-gesundheitskasse-in-hessen'].map((id) => kostenZeile(kasse(id)));
const tab = [kostenZeile(p.k), ...nachbarn].sort((a, b) => a.k.zb! - b.k.zb!);
const d = (x: { lohn: number }) => Math.round((x.lohn - p.lohn) * 12);
const ordEn = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 17,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID, land: 'NI' },
  related: ['guenstigste-krankenkasse-niedersachsen', 'guenstigste-krankenkasse-bremen', 'pflegeversicherung-beitrag', 'aok-nordwest-die-gesundheitskasse'],
  sources: ['gkvListe', 'sgb5_242', 'sgb11_55', 'sgb5_175'],
  de: {
    slug: 'aok-niedersachsen-zusatzbeitrag',
    nav: 'AOK Niedersachsen',
    card: `${DE.pk(p.zb)} Zusatzbeitrag, nur in Niedersachsen geöffnet; Familien mit mehreren Kindern zahlen weniger Pflege.`,
    title: 'AOK Niedersachsen Zusatzbeitrag 2027: Beitrag für Familien',
    description: `AOK Niedersachsen, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Monatsbeitrag mit keinem, einem, drei oder fünf Kindern, Abstand zur AOK Bremen und zu Kassen in Niedersachsen.`,
    h1: 'AOK Niedersachsen: Zusatzbeitrag und Beitrag nach Familienlage',
    intro: `Die AOK Niedersachsen verlangt ${DE.pk(p.zb)}; mit drei Kindern unter 25 zahlen Sie ${DE.eur(Math.round((eins - drei) * 12))} im Jahr weniger als mit einem.`,
    resume: `Die AOK Niedersachsen, amtlich „AOK - Die Gesundheitskasse für Niedersachsen“, ist laut Liste des GKV-Spitzenverbands nur für Niedersachsen geöffnet und erhebt einen Zusatzbeitrag von ${DE.pk(p.zb)}. Damit liegt sie unter den ${aoks.length} Ortskrankenkassen auf Platz ${aokPlatz}${gleich.length ? `, gemeinsam mit ${gleich.map((k) => k.kurz).join(' und ')}` : ''}. Wer zwischen Emsland und Harz wohnt oder arbeitet, zahlt bei ${DE.eur(BEISPIEL.lohn)} brutto mit einem Kind ${DE.eur(eins)} im Monat für Kranken- und Pflegeversicherung. Die Zahl der Kinder verändert den Betrag stärker als manche Kassenwahl: Kinderlose ab 23 zahlen ${DE.eur(ohne)}, Eltern mit drei Kindern unter 25 nur ${DE.eur(drei)}, weil ab dem zweiten Kind ein Abschlag auf die Pflege gilt. Die Stadtstaaten-AOK in Bremen verlangt ${DE.pk(hb.k.zb!)}; bei diesem Lohn sind das ${DE.eur(Math.abs(vsHb))} im Jahr ${vsHb > 0 ? 'mehr' : 'weniger'}. Unter den ${rNI.n} in Niedersachsen wählbaren Kassen steht die AOK auf Rang ${rNI.rang}.`,
    faqs: [
      { q: 'Wie viel weniger zahle ich bei der AOK Niedersachsen mit mehreren Kindern?', a: `Ab dem zweiten Kind unter 25 sinkt Ihr Pflegeanteil um ${DE.pz(w.pv_abschlag_kind)} je Kind, höchstens bis zum fünften. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie mit einem Kind ${DE.eur(eins)}, mit drei ${DE.eur(drei)} und mit fünf ${DE.eur(fuenf)} im Monat. Der Abschlag gilt bei jeder Kasse gleich; die Kinder müssen der beitragsabführenden Stelle nachgewiesen sein.` },
      { q: 'Ich wohne in Niedersachsen und arbeite in Bremen. Welche AOK kann ich wählen?', a: `Beide. Die AOK Niedersachsen steht Ihnen über den Wohnort offen, die AOK Bremen/Bremerhaven über den Arbeitsort. Heute verlangt die Bremer Kasse ${DE.pk(hb.k.zb!)}, die niedersächsische ${DE.pk(p.zb)}; bei ${DE.eur(BEISPIEL.lohn)} brutto liegen ${DE.eur(Math.abs(vsHb))} im Jahr dazwischen. Zusätzlich können Sie jede bundesweit geöffnete Kasse wählen.` },
      { q: 'Lohnt sich ein Wechsel von der AOK Niedersachsen zur günstigsten Kasse?', a: `Bei ${DE.eur(BEISPIEL.lohn)} brutto spart ${p.billigste.kurz} mit ${DE.pk(p.billigste.zb!)} ${DE.eur(p.proJahrVsBilligste)} im Jahr, an der Bemessungsgrenze ${DE.eur(p.proJahrVsBilligsteBbg)}. Ob dieser Betrag einen Wechsel rechtfertigt, hängt auch von Service und Erreichbarkeit vor Ort ab, die keine Liste misst. Prüfen Sie vorher, ob die günstigere Kasse in Ihrem Land tatsächlich geöffnet ist.` },
      { q: 'Was zahlen kinderlose Mitglieder der AOK Niedersachsen?', a: `Ab dem 23. Geburtstag kommt ein Zuschlag von ${DE.pz(w.pv_kinderlos)} auf die Pflege hinzu, den Sie allein tragen. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie dann ${DE.eur(ohne)} im Monat statt ${DE.eur(eins)}. Wer Kinder hat, die älter als 25 sind, gilt nicht als kinderlos und zahlt den Zuschlag nicht.` },
    ],
    body: (h) => `
<h2>Familie und Kasse: was den Beitrag wirklich bewegt</h2>
<p>Bei der AOK Niedersachsen wie bei jeder anderen Kasse hängt der Pflegeanteil an der Elterneigenschaft. Für Familien in Niedersachsen bringt ein drittes Kind deshalb mehr als der Wechsel zu einer günstigeren Kasse, und kinderlose Mitglieder zahlen jedes Jahr mehr, gleich wo sie versichert sind. Die Tabelle zeigt Ihren eigenen Anteil bei ${h.eur(BEISPIEL.lohn)} brutto.</p>
${h.table(['Familienlage', 'Ihr Beitrag im Monat', 'im Jahr'], [
  ['kinderlos, ab 23', h.eur(ohne), h.eur(ohne * 12)],
  ['ein Kind', h.eur(eins), h.eur(eins * 12)],
  ['drei Kinder unter 25', h.eur(drei), h.eur(drei * 12)],
  ['fünf Kinder unter 25', h.eur(fuenf), h.eur(fuenf * 12)],
], `AOK Niedersachsen, ${h.eur(BEISPIEL.lohn)} brutto, 2026`, ['l', 'r', 'r'])}
<h2>Niedersachsen, Bremen und die Nachbar-AOKs</h2>
<p>Niedersachsen umschließt Bremen und grenzt an fünf weitere Länder mit eigener Ortskrankenkasse. Wer in einer Grenzregion lebt, etwa in Osnabrück mit Arbeitsplatz in Westfalen oder in Wolfsburg mit Arbeitsplatz in Sachsen-Anhalt, kann zwischen zwei AOKs wählen. Die Unterschiede in Euro:</p>
${h.table(['AOK', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber AOK Niedersachsen im Jahr'], tab.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind`, ['l', 'r', 'r', 'r'])}
<p>Rentner zahlen bei der AOK Niedersachsen mit ${h.eur(BEISPIEL.rente)} gesetzlicher Rente ${h.eur(p.rente)} im Monat, Selbstständige mit ${h.eur(BEISPIEL.gewinn)} Gewinn ${h.eur(p.selbst)}, Studierende ${h.eur(p.student)}. Alle wählbaren Kassen des Landes stehen auf der Seite ${h.a('guenstigste-krankenkasse-niedersachsen', 'günstigste Krankenkasse in Niedersachsen')}, die Bremer Rangliste unter ${h.a('guenstigste-krankenkasse-bremen', 'Bremen')}.</p>
<h2>Kinder nachweisen und Kasse wechseln</h2>
<p>Damit der Abschlag für Kinder ankommt, müssen Elterneigenschaft und Alter der Kinder nachgewiesen sein, bei Beschäftigten gegenüber dem Arbeitgeber, bei Selbstzahlern gegenüber der Pflegekasse; ein automatisiertes Meldeverfahren übernimmt das zunehmend (§ 55 Abs. 3a SGB XI). Ein Kassenwechsel ändert daran nichts. Er wird zum Ende des übernächsten Monats wirksam, und familienversicherte Kinder wechseln mit. Wer im Herbst über einen Wechsel nachdenkt, kann den Beschluss der AOK für das neue Jahr abwarten: Steigt der Satz, gilt das Sonderkündigungsrecht auch innerhalb der ersten zwölf Monate.</p>`,
  },
  en: {
    slug: 'aok-niedersachsen-additional-contribution',
    nav: 'AOK Niedersachsen',
    card: `${EN.pk(p.zb)} additional rate, open in Lower Saxony only; families with several children pay less care insurance.`,
    title: 'AOK Niedersachsen Additional Contribution 2027: Families',
    description: `AOK Niedersachsen additional rate in 2026: ${EN.pk(p.zb)}. Monthly cost with no, one, three or five children, the gap to AOK Bremen and other funds in Lower Saxony.`,
    h1: 'AOK Niedersachsen: additional rate and cost by family situation',
    intro: `AOK Niedersachsen charges ${EN.pk(p.zb)}; with three children under 25 you pay ${EN.eur(Math.round((eins - drei) * 12))} a year less than with one.`,
    resume: `AOK Niedersachsen, officially “AOK - Die Gesundheitskasse für Niedersachsen”, is listed by the GKV-Spitzenverband as open in Lower Saxony only and charges an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)}. That puts it ${ordEn(aokPlatz)} among the ${aoks.length} regional AOK funds${gleich.length ? `, level with ${gleich.map((k) => k.kurz).join(' and ')}` : ''}. Anyone living or working between the Emsland and the Harz pays ${EN.eur(eins)} a month for health and care insurance on ${EN.eur(BEISPIEL.lohn)} gross with one child. The number of children moves the amount more than some choices of fund: childless members aged 23 and over pay ${EN.eur(ohne)}, parents of three children under 25 only ${EN.eur(drei)}, because a care discount applies from the second child. The city-state AOK in Bremen charges ${EN.pk(hb.k.zb!)}, which at that pay is ${EN.eur(Math.abs(vsHb))} a year ${vsHb > 0 ? 'more' : 'less'}. Among the ${rNI.n} funds open in Lower Saxony, the AOK ranks ${rNI.rang}.`,
    faqs: [
      { q: 'How much less do I pay at AOK Niedersachsen with several children?', a: `From the second child under 25 your care share falls by ${EN.pz(w.pv_abschlag_kind)} per child, up to the fifth. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(eins)} with one child, ${EN.eur(drei)} with three and ${EN.eur(fuenf)} with five each month. The discount is the same at every fund; the children must be proven to whoever pays in your contributions.` },
      { q: 'I live in Lower Saxony and work in Bremen. Which AOK can I join?', a: `Both. AOK Niedersachsen is open to you through your home, AOK Bremen/Bremerhaven through your workplace. Today the Bremen fund charges ${EN.pk(hb.k.zb!)} and the Lower Saxony fund ${EN.pk(p.zb)}; on ${EN.eur(BEISPIEL.lohn)} gross that is ${EN.eur(Math.abs(vsHb))} a year apart. You can also join any nationwide fund.` },
      { q: 'Does switching from AOK Niedersachsen to the cheapest fund pay?', a: `On ${EN.eur(BEISPIEL.lohn)} gross, ${p.billigste.kurz} at ${EN.pk(p.billigste.zb!)} saves ${EN.eur(p.proJahrVsBilligste)} a year, at the contribution ceiling ${EN.eur(p.proJahrVsBilligsteBbg)}. Whether that justifies a move also depends on service and local offices, which no list measures. Check first that the cheaper fund is actually open in your state, which the ranking above does for you.` },
      { q: 'What do childless AOK Niedersachsen members pay?', a: `From your 23rd birthday a ${EN.pz(w.pv_kinderlos)} care surcharge applies, paid by you alone. On ${EN.eur(BEISPIEL.lohn)} gross you then pay ${EN.eur(ohne)} a month instead of ${EN.eur(eins)}. Parents whose children are over 25 are not childless and do not pay the surcharge.` },
    ],
    body: (h) => `
<h2>Family and fund: what really moves the contribution</h2>
<p>At AOK Niedersachsen, as at every fund, the care share depends on whether you are a parent. For families in Lower Saxony a third child therefore matters more than switching to a cheaper fund, and childless members pay more every year wherever they are insured. The table shows your own share on ${h.eur(BEISPIEL.lohn)} gross.</p>
${h.table(['Family situation', 'You pay a month', 'a year'], [
  ['childless, 23 or over', h.eur(ohne), h.eur(ohne * 12)],
  ['one child', h.eur(eins), h.eur(eins * 12)],
  ['three children under 25', h.eur(drei), h.eur(drei * 12)],
  ['five children under 25', h.eur(fuenf), h.eur(fuenf * 12)],
], `AOK Niedersachsen, ${h.eur(BEISPIEL.lohn)} gross, 2026`, ['l', 'r', 'r'])}
<h2>Lower Saxony, Bremen and the neighbouring AOKs</h2>
<p>Lower Saxony surrounds Bremen and borders five more states with regional funds of their own. If you live near a border, say in Osnabrück with a job in Westphalia or in Wolfsburg with a job in Saxony-Anhalt, you can choose between two AOKs. The differences in euros:</p>
${h.table(['AOK', 'Additional rate', 'You pay a month', 'vs AOK Niedersachsen a year'], tab.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `${h.eur(BEISPIEL.lohn)} gross, one child`, ['l', 'r', 'r', 'r'])}
<p>Pensioners at AOK Niedersachsen pay ${h.eur(p.rente)} a month on a ${h.eur(BEISPIEL.rente)} state pension, self-employed members ${h.eur(p.selbst)} on ${h.eur(BEISPIEL.gewinn)} profit, students ${h.eur(p.student)}. Every fund open in the state is on the page ${h.a('guenstigste-krankenkasse-niedersachsen', 'cheapest health insurance in Lower Saxony')}, the Bremen ranking under ${h.a('guenstigste-krankenkasse-bremen', 'Bremen')}.</p>
<h2>Proving your children and switching fund</h2>
<p>For the child discount to apply, your parenthood and the children’s ages must be proven, to the employer if you are employed or to the care fund if you pay yourself; an automated reporting procedure increasingly handles this (section 55(3a) SGB XI). Switching fund changes nothing here. A switch takes effect at the end of the month after next, and children covered free of charge move with you.</p>`,
  },
});
