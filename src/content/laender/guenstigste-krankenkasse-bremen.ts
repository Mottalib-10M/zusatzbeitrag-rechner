import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN } from '../../lib/engine/kassen';

/** Bremen: Rangliste aus der Liste des GKV-Spitzenverbands; eigene AOK für zwei Städte, Pendeln mit Niedersachsen. */
const p = landProfil('HB');
const ni = landProfil('NI');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aokNi = ni.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const aokDiff = Math.round((kostenZeile(aok).lohn - kostenZeile(aokNi).lohn) * 12);
const nurNi = ni.r.filter((k) => !p.r.some((x) => x.id === k.id));
const aokMehrDe = aok.zb! > aokNi.zb! ? `${DE.eur(Math.abs(aokDiff))} im Jahr mehr als` : aok.zb! < aokNi.zb! ? `${DE.eur(Math.abs(aokDiff))} im Jahr weniger als` : 'genauso viel wie';
const aokMehrEn = aok.zb! > aokNi.zb! ? `${EN.eur(Math.abs(aokDiff))} a year more than` : aok.zb! < aokNi.zb! ? `${EN.eur(Math.abs(aokDiff))} a year less than` : 'the same as';

export default defineGuide({
  id: 'guenstigste-krankenkasse-bremen',
  group: 'laender',
  order: 54,
  land: 'HB',
  tool: 'beitrag',
  toolPreset: { land: 'HB', kasse: 'aok-bremen-bremerhaven' },
  related: ['guenstigste-krankenkasse-niedersachsen', 'aok-die-gesundheitskasse-fur-niedersachsen', 'guenstigste-krankenkasse-hamburg', 'zusatzbeitrag-liste', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_242', 'sgb11_55'],
  de: {
    slug: 'guenstigste-krankenkasse-bremen',
    nav: 'Bremen',
    card: `${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; die AOK Bremen/Bremerhaven verlangt ${DE.pk(aok.zb!)}, die AOK Niedersachsen ${DE.pk(aokNi.zb!)}.`,
    title: 'Günstigste Krankenkasse Bremen 2027: Kassen und AOK in Euro',
    description: `Bremen und Bremerhaven 2026/2027: wählbare Krankenkassen von ${DE.pk(p.billig.zb!)} bis ${DE.pk(p.teuer.zb!)} Zusatzbeitrag, Beitrag in Euro, eigene AOK und Pendeln nach Niedersachsen.`,
    h1: 'Günstigste Krankenkasse in Bremen und Bremerhaven',
    intro: `Im kleinsten Land sind ${p.n} Kassen wählbar, ab ${DE.pk(p.billig.zb!)}; die eigene AOK Bremen/Bremerhaven steht mit ${DE.pk(aok.zb!)} auf Platz ${p.aokRang}.`,
    resume: `Das Land Bremen besteht aus zwei Städten, hat aber eine eigene Ortskrankenkasse: die AOK Bremen/Bremerhaven, laut Liste des GKV-Spitzenverbands nur für Bremen geöffnet und mit einem Zusatzbeitrag von ${DE.pk(aok.zb!)}. Insgesamt stehen Bremern ${p.n} Kassen offen, ${p.bund.length} bundesweit und ${p.regional.length} regional. Die günstigste ist ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, die teuerste ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}; bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind trennen sie ${DE.eur(p.spanneJahr)} im Jahr. Weil Bremen ganz von Niedersachsen umgeben ist, pendeln viele über die Landesgrenze, etwa aus Delmenhorst, Achim oder Osterholz-Scharmbeck. Für sie zählen Wohn- und Arbeitsort: Sie dürfen auch die Kassen Niedersachsens wählen, darunter die AOK Niedersachsen mit ${DE.pk(aokNi.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} zahlen Mitglieder der Bremer AOK ${aokMehrDe} bei der niedersächsischen.`,
    faqs: [
      { q: 'Ist die AOK Bremen/Bremerhaven teurer als die AOK Niedersachsen?', a: `Die Bremer AOK verlangt ${DE.pk(aok.zb!)}, die niedersächsische ${DE.pk(aokNi.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlen Sie bei der Bremer ${aokMehrDe} bei der niedersächsischen. Wählen dürfen Sie die AOK Niedersachsen nur, wenn Sie in Niedersachsen wohnen oder arbeiten.` },
      { q: 'Ich wohne in Delmenhorst und arbeite in Bremen. Welche Kassen kommen in Frage?', a: `Jede Kasse, die für Niedersachsen oder für Bremen geöffnet ist. ${nurNi.length ? `Nur über Niedersachsen erreichbar sind etwa ${nurNi.slice(0, 3).map((k) => k.kurz).join(', ')}.` : 'Beide Listen sind derzeit gleich.'} Die beiden AOKs schließen sich dabei nicht aus: Sie wählen die, die Ihnen besser passt. Der Rechner zeigt beide Ranglisten, wenn Sie das Bundesland umstellen.` },
      { q: 'Welche Kasse ist im Land Bremen am günstigsten?', a: `${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, gefolgt von ${top.slice(1, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Mit ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie bei ${p.billig.kurz} ${DE.eur(p.lohnBillig)} im Monat, Kranken- und Pflegeversicherung zusammen. Zusatzleistungen und Service bewertet diese Reihenfolge nicht.` },
      { q: 'Gilt für Bremerhaven dieselbe Kassenliste wie für Bremen?', a: `Ja. Die Liste des GKV-Spitzenverbands kennt nur Länder, keine Städte, und Bremerhaven gehört zum Land Bremen. Die AOK Bremen/Bremerhaven trägt beide Städte im Namen und hat in beiden denselben Satz von ${DE.pk(aok.zb!)}. Unter den ${aoks.length} AOKs ist er der ${aokPlatz}. niedrigste.` },
      { q: 'Was zahlen Studierende in Bremen bei der AOK?', a: `Auf den gesetzlich festen BAföG-Bedarf von ${DE.eur(w.bafoeg_bedarf)} zahlen Studierende sieben Zehntel des allgemeinen Satzes, den vollen Zusatzbeitrag und die Pflege, alles allein. Bei einem Zusatzbeitrag von ${DE.pk(aok.zb!)} ist das mehr als bei ${p.billig.kurz}; den Betrag zeigt der Rechner oben, wenn Sie „Student“ einstellen.` },
    ],
    body: (h) => `
<h2>Zwei Städte, eine eigene AOK, viele Pendler</h2>
<p>Kaum ein Land ist so eng mit seinem Nachbarn verflochten wie Bremen mit ${h.a('guenstigste-krankenkasse-niedersachsen', 'Niedersachsen')}. Für die Krankenkasse ist das ein Vorteil: Wer auf der einen Seite wohnt und auf der anderen arbeitet, darf aus beiden Listen wählen. Der Vergleich der beiden AOKs und der beiden günstigsten Kassen:</p>
${h.table(['', 'Bremen', 'Niedersachsen'], [
  ['AOK', `${h.pk(aok.zb!)}`, `${h.pk(aokNi.zb!)}`],
  ['AOK, Ihr Beitrag im Monat', h.eur(kostenZeile(aok).lohn), h.eur(kostenZeile(aokNi).lohn)],
  ['Günstigste Kasse', `${kLink(h, p.billig)}, ${h.pk(p.billig.zb!)}`, `${kLink(h, ni.billig)}, ${h.pk(ni.billig.zb!)}`],
  ['Wählbare Kassen', String(p.n), String(ni.n)],
], `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r'])}
<h2>Rangliste für Bremen</h2>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `Die fünf günstigsten, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<p>Gegenüber ${p.billig.kurz} zahlen Mitglieder der Bremer AOK bei diesem Lohn ${h.eur(p.aokVsBillig)} im Jahr mehr. Bis zur Beitragsbemessungsgrenze von ${h.eur(w.bbgKv, 2)} wächst der Abstand mit dem Lohn, weil der Zusatzbeitrag ein Prozentsatz ist.</p>
<h2>Rente in Bremen und Bremerhaven</h2>
<p>Rentnerinnen und Rentner zahlen den halben allgemeinen Satz und den halben Zusatzbeitrag auf ihre gesetzliche Rente, die Rentenversicherung trägt die andere Hälfte; die Pflege zahlen sie allein. Mit ${h.eur(BEISPIEL.rente)} Rente und einem Kind sind das bei der AOK Bremen/Bremerhaven ${h.eur(kostenZeile(aok).rente)} und bei ${kLink(h, p.billig)} ${h.eur(kostenZeile(p.billig).rente)} im Monat. Eine Betriebsrente aus einem Bremer Unternehmen trägt den vollen Satz allein, abzüglich eines Freibetrags von ${h.eur(w.vbFrei, 2)} in der Krankenversicherung.</p>
<h2>So wechseln Bremer</h2>
<p>Antrag bei der neuen Kasse genügt, sie benachrichtigt die alte. Neue Mitgliedschaft ab dem übernächsten Monatsersten, nach zwölf Monaten Bindung oder sofort nach einer Erhöhung (${h.a('krankenkasse-wechseln', 'Fristen rechnen')}). Den Pflegebeitrag teilen sich Beschäftigte und Arbeitgeber in Bremen hälftig, je ${h.pz(w.pv_satz / 2)}. Weiter nördlich lohnt der Blick nach ${h.a('guenstigste-krankenkasse-hamburg', 'Hamburg')}, wenn Sie dort arbeiten.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-bremen',
    nav: 'Bremen',
    card: `${p.n} funds from ${EN.pk(p.billig.zb!)}; AOK Bremen/Bremerhaven charges ${EN.pk(aok.zb!)}, AOK Niedersachsen ${EN.pk(aokNi.zb!)}.`,
    title: 'Cheapest Health Insurance Bremen 2027: Funds and AOK, Euros',
    description: `Bremen and Bremerhaven 2026/2027: funds you can join from ${EN.pk(p.billig.zb!)} to ${EN.pk(p.teuer.zb!)} additional rate, cost in euros, the city’s own AOK and Lower Saxony commuters.`,
    h1: 'Cheapest health insurance in Bremen and Bremerhaven',
    intro: `Germany’s smallest state offers ${p.n} funds from ${EN.pk(p.billig.zb!)}; its own AOK Bremen/Bremerhaven ranks ${p.aokRang} at ${EN.pk(aok.zb!)}.`,
    resume: `The state of Bremen is made up of two cities but has its own regional fund: AOK Bremen/Bremerhaven, open only to Bremen according to the GKV-Spitzenverband list, with an additional rate of ${EN.pk(aok.zb!)}. In total ${p.n} funds are open to Bremen residents, ${p.bund.length} nationwide and ${p.regional.length} regional. The cheapest is ${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, the most expensive ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}; on ${EN.eur(BEISPIEL.lohn)} gross with one child they are ${EN.eur(p.spanneJahr)} a year apart. Because Bremen is entirely surrounded by Lower Saxony, many people cross the border to work, from Delmenhorst, Achim or Osterholz-Scharmbeck for example. For them both home and workplace count: they may also choose Lower Saxony’s funds, including AOK Niedersachsen at ${EN.pk(aokNi.zb!)}. On ${EN.eur(BEISPIEL.lohn)}, members of the Bremen AOK pay ${aokMehrEn} at the Lower Saxony one.`,
    faqs: [
      { q: 'Is AOK Bremen/Bremerhaven more expensive than AOK Niedersachsen?', a: `The Bremen AOK charges ${EN.pk(aok.zb!)}, the Lower Saxony one ${EN.pk(aokNi.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child you pay ${aokMehrEn} at the Lower Saxony fund. You may only join AOK Niedersachsen if you live or work in Lower Saxony.` },
      { q: 'I live in Delmenhorst and work in Bremen. Which funds can I join?', a: `Any fund open to Lower Saxony or to Bremen. ${nurNi.length ? `Reachable only through Lower Saxony are, for example, ${nurNi.slice(0, 3).map((k) => k.kurz).join(', ')}.` : 'Both lists are currently identical.'} The two AOKs do not exclude each other: you choose whichever suits you better. The calculator shows both rankings when you switch the state.` },
      { q: 'Which fund is cheapest in the state of Bremen?', a: `${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, followed by ${top.slice(1, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohnBillig)} a month at ${p.billig.kurz}, health and care insurance together. Extra benefits and service are not part of this ranking.` },
      { q: 'Does Bremerhaven have the same fund list as Bremen?', a: `Yes. The GKV-Spitzenverband list works by state, not by city, and Bremerhaven belongs to the state of Bremen. AOK Bremen/Bremerhaven carries both cities in its name and charges the same ${EN.pk(aok.zb!)} in each. Among the ${aoks.length} AOK funds it is number ${aokPlatz} from the bottom.` },
      { q: 'What do students in Bremen pay at the AOK?', a: `On the statutory BAföG need rate of ${EN.eur(w.bafoeg_bedarf)}, students pay seven tenths of the general rate, the full additional rate and care insurance, all alone. With an additional rate of ${EN.pk(aok.zb!)} that is more than at ${p.billig.kurz}; select “student” in the calculator above for the exact figure.` },
    ],
    body: (h) => `
<h2>Two cities, one AOK, lots of commuters</h2>
<p>Few states are as intertwined with a neighbour as Bremen is with ${h.a('guenstigste-krankenkasse-niedersachsen', 'Lower Saxony')}. For health insurance that helps: if you live on one side and work on the other, you can choose from both lists. The two AOKs and the two cheapest funds compared:</p>
${h.table(['', 'Bremen', 'Lower Saxony'], [
  ['AOK', `${h.pk(aok.zb!)}`, `${h.pk(aokNi.zb!)}`],
  ['AOK, you pay a month', h.eur(kostenZeile(aok).lohn), h.eur(kostenZeile(aokNi).lohn)],
  ['Cheapest fund', `${kLink(h, p.billig)}, ${h.pk(p.billig.zb!)}`, `${kLink(h, ni.billig)}, ${h.pk(ni.billig.zb!)}`],
  ['Funds open', String(p.n), String(ni.n)],
], `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r'])}
<h2>Ranking for Bremen</h2>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `The five cheapest, ${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<p>Compared with ${p.billig.kurz}, members of the Bremen AOK pay ${h.eur(p.aokVsBillig)} a year more at this pay. Up to the contribution ceiling of ${h.eur(w.bbgKv, 2)} the gap grows with pay, because the additional rate is a percentage.</p>
<h2>Retiring in Bremen and Bremerhaven</h2>
<p>Pensioners pay half the general rate and half the additional rate on their state pension, with the pension insurance paying the other half; they pay care insurance alone. On a ${h.eur(BEISPIEL.rente)} pension with one child that is ${h.eur(kostenZeile(aok).rente)} a month at AOK Bremen/Bremerhaven and ${h.eur(kostenZeile(p.billig).rente)} at ${kLink(h, p.billig)}. A company pension pays the full rate alone, less an allowance of ${h.eur(w.vbFrei, 2)} for health insurance.</p>
<h2>Switching in Bremen</h2>
<p>An application to the new fund is enough; it notifies the old one. Membership starts on the first day of the month after next, after twelve months’ lock-in or straight after a rate rise (${h.a('krankenkasse-wechseln', 'work out the dates')}). Employees and employers in Bremen split care insurance in half, ${h.pz(w.pv_satz / 2)} each. Further north, ${h.a('guenstigste-krankenkasse-hamburg', 'Hamburg')} is worth a look if you work there.</p>`,
  },
});
