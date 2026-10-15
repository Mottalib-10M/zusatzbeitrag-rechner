import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN, kasse } from '../../lib/engine/kassen';

/** Berlin: Rangliste aus der Liste des GKV-Spitzenverbands; Vergleich mit Brandenburg (gemeinsame AOK Nordost, Pendler). */
const p = landProfil('BE');
const bb = landProfil('BB');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const tk = kasse('techniker-krankenkasse');
const nurBerlin = p.r.filter((k) => !bb.r.some((x) => x.id === k.id));
const pendlerVorteil = Math.round((kostenZeile(bb.billig).lohn - kostenZeile(p.billig).lohn) * 12);
const ueberSchnitt = aok.zb! > w.zb_durchschnitt;

export default defineGuide({
  id: 'guenstigste-krankenkasse-berlin',
  group: 'laender',
  order: 52,
  land: 'BE',
  tool: 'beitrag',
  toolPreset: { land: 'BE', kasse: 'aok-nordost-die-gesundheitskasse' },
  related: ['aok-nordost-die-gesundheitskasse', 'guenstigste-krankenkasse-brandenburg', 'guenstigste-krankenkasse-mecklenburg-vorpommern', 'zusatzbeitrag-liste', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_242', 'sgb5_249'],
  de: {
    slug: 'guenstigste-krankenkasse-berlin',
    nav: 'Berlin',
    card: `${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; die AOK Nordost verlangt ${DE.pk(aok.zb!)} und gilt auch in Brandenburg und Mecklenburg-Vorpommern.`,
    title: 'Günstigste Krankenkasse Berlin 2027: alle Kassen in Euro',
    description: `Berlin 2026/2027: jede wählbare Krankenkasse von ${DE.pk(p.billig.zb!)} bis ${DE.pk(p.teuer.zb!)} Zusatzbeitrag, Ihr Monatsbeitrag in Euro, die AOK Nordost und der Vorteil für Pendler.`,
    h1: 'Günstigste Krankenkasse in Berlin: alle Kassen für Berliner',
    intro: `Berliner können zwischen ${p.n} Kassen wählen, ab ${DE.pk(p.billig.zb!)} bei ${p.billig.kurz}; die AOK Nordost liegt mit ${DE.pk(aok.zb!)} auf Platz ${p.aokRang}.`,
    resume: `In Berlin stehen laut Liste des GKV-Spitzenverbands ${p.n} gesetzliche Krankenkassen zur Wahl, ${p.bund.length} bundesweite und ${p.regional.length} regional geöffnete. Am günstigsten ist ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)} Zusatzbeitrag, am teuersten ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind macht das ${DE.eur(p.spanneJahr)} im Jahr für Sie aus, an der Beitragsbemessungsgrenze ${DE.eur(p.spanneJahrBbg)}. Die Ortskrankenkasse der Hauptstadt ist die AOK Nordost, die zugleich Brandenburg und Mecklenburg-Vorpommern versichert. Ihr Satz von ${DE.pk(aok.zb!)} liegt ${ueberSchnitt ? 'über' : 'unter'} dem amtlichen Durchschnitt von ${DE.pz(w.zb_durchschnitt)}; unter den ${aoks.length} AOKs ist er der ${aokPlatz}. niedrigste. Weil in Berlin Wohnort oder Arbeitsort zählt, profitieren auch Brandenburger, die in der Stadt arbeiten, von der Berliner Liste. Wer neu nach Berlin zieht und noch nie gesetzlich versichert war, wählt frei und ohne Wartezeit.`,
    faqs: [
      { q: 'Welche Krankenkasse ist in Berlin die günstigste?', a: `${p.billig.kurz} mit ${DE.pk(p.billig.zb!)} Zusatzbeitrag. Danach folgen ${top.slice(1, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie bei ${p.billig.kurz} ${DE.eur(p.lohnBillig)} im Monat, Kranken- und Pflegeversicherung zusammen. Ob Beratung, App oder Bonusprogramm passen, zeigt der Satz nicht.` },
      { q: 'Ich wohne in Potsdam und arbeite in Berlin. Welche Kassen darf ich wählen?', a: `Alle, die für Brandenburg oder für Berlin geöffnet sind, denn die Wahl richtet sich nach Wohn- oder Beschäftigungsort. ${nurBerlin.length ? `Nur über Ihren Berliner Arbeitsplatz erreichbar sind etwa ${nurBerlin.slice(0, 3).map((k) => k.kurz).join(', ')}.` : 'Beide Listen sind derzeit gleich.'} Bei ${DE.eur(BEISPIEL.lohn)} brutto bringt die günstigste Berliner Kasse gegenüber der günstigsten Brandenburger ${DE.eur(Math.max(0, pendlerVorteil))} im Jahr.` },
      { q: 'Ist die AOK Nordost in Berlin teurer als die TK?', a: `Die AOK Nordost verlangt ${DE.pk(aok.zb!)}, die Techniker Krankenkasse ${DE.pk(tk.zb!)}. ${aok.zb! > tk.zb! ? `Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen AOK-Mitglieder damit ${DE.eur(Math.round((kostenZeile(aok).lohn - kostenZeile(tk).lohn) * 12))} im Jahr mehr als TK-Mitglieder.` : 'Die AOK Nordost ist damit nicht teurer.'} Gegenüber der günstigsten in Berlin wählbaren Kasse beträgt der Abstand ${DE.eur(p.aokVsBillig)} im Jahr. Die gesetzlichen Leistungen sind bei allen Kassen gleich.` },
      { q: 'Gibt es Krankenkassen, die nur in Berlin geöffnet sind?', a: `${p.nurHier.length ? `Ja: ${p.nurHier.map((k) => k.kurz).join(', ')}.` : 'Nein. Keine Kasse der Liste ist ausschließlich für Berlin geöffnet; selbst die AOK Nordost gilt für drei Länder.'} Die regional geöffneten Kassen in der Berliner Rangliste sind Betriebs- und Innungskrankenkassen, die ihre Satzung für mehrere Länder, darunter Berlin, geöffnet haben.` },
      { q: 'Was zahlen Berliner Studierende bei der günstigsten Kasse?', a: `Studierende zahlen auf den gesetzlich festen BAföG-Bedarf von ${DE.eur(w.bafoeg_bedarf)} sieben Zehntel des allgemeinen Satzes plus den vollen Zusatzbeitrag ihrer Kasse und die Pflege. Wer an einer Berliner Hochschule eingeschrieben ist, kann jede Kasse der Berliner Liste wählen. Den genauen Betrag zeigt der Rechner oben, wenn Sie „Student“ einstellen.` },
    ],
    body: (h) => `
<h2>Hauptstadt mit geteilter AOK</h2>
<p>Berlin hat seit der Fusion der Ortskrankenkassen keine eigene AOK mehr. Die AOK Nordost versichert Berlin, ${h.a('guenstigste-krankenkasse-brandenburg', 'Brandenburg')} und ${h.a('guenstigste-krankenkasse-mecklenburg-vorpommern', 'Mecklenburg-Vorpommern')} zum selben Satz von ${h.pk(aok.zb!)}. In der Berliner Rangliste steht sie auf Platz ${p.aokRang} von ${p.n}. Für ein Mitglied mit ${h.eur(BEISPIEL.lohn)} brutto liegt der Unterschied zur günstigsten wählbaren Kasse bei ${h.eur(p.aokVsBillig)} im Jahr; an der Beitragsbemessungsgrenze von ${h.eur(w.bbgKv, 2)} wird er entsprechend größer, weil der Zusatzbeitrag mit dem Lohn wächst.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `Die fünf günstigsten für Berlin, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Pendeln zwischen Berlin und Brandenburg</h2>
<p>Täglich fahren viele Menschen aus dem Umland in die Stadt. Für sie zählt bei der Kassenwahl sowohl der Wohnort im Brandenburger Speckgürtel als auch der Arbeitsplatz in Berlin. ${bb.billig.id === p.billig.id ? `Die günstigste Kasse ist in beiden Ländern dieselbe, ${p.billig.kurz}.` : `In Brandenburg führt ${bb.billig.kurz} mit ${h.pk(bb.billig.zb!)} die Liste an, in Berlin ${p.billig.kurz} mit ${h.pk(p.billig.zb!)}; wer in Berlin arbeitet, darf die Berliner Kasse wählen.`} Endet der Berliner Job, bleibt die Mitgliedschaft bestehen; eine regional geöffnete Kasse muss Sie nicht hinauswerfen, nur weil Sie den Arbeitsort wechseln.</p>
<h2>Was Berliner beim Wechsel beachten</h2>
<p>Der Antrag bei der neuen Kasse genügt, die bisherige wird elektronisch benachrichtigt. Neue Mitgliedschaft ab dem übernächsten Monatsersten, nach zwölf Monaten Bindung oder sofort nach einer Erhöhung (${h.a('krankenkasse-wechseln', 'Termin rechnen')}). Den Pflegebeitrag teilen sich Beschäftigte und Arbeitgeber in Berlin hälftig, je ${h.pz(w.pv_satz / 2)}; Kinderlose ab 23 zahlen ${h.pz(w.pv_kinderlos)} dazu. Alle Kassen mit Satz und Öffnungsgebiet stehen in der ${h.a('zusatzbeitrag-liste', 'Liste der Zusatzbeiträge')}. Wer aus dem Ausland nach Berlin zieht und zum ersten Mal gesetzlich versichert wird, hat keine Bindungsfrist abzuwarten und wählt seine Kasse einfach mit dem ersten Arbeitsvertrag.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-berlin',
    nav: 'Berlin',
    card: `${p.n} funds from ${EN.pk(p.billig.zb!)}; AOK Nordost charges ${EN.pk(aok.zb!)} and also covers Brandenburg and Mecklenburg-Western Pomerania.`,
    title: 'Cheapest Health Insurance Berlin 2027: Every Fund in Euros',
    description: `Berlin 2026/2027: every statutory health fund you can join from ${EN.pk(p.billig.zb!)} to ${EN.pk(p.teuer.zb!)} additional rate, your cost in euros, AOK Nordost and the commuter edge.`,
    h1: 'Cheapest health insurance in Berlin: every fund for Berliners',
    intro: `Berliners can choose from ${p.n} funds, from ${EN.pk(p.billig.zb!)} at ${p.billig.kurz}; AOK Nordost, at ${EN.pk(aok.zb!)}, ranks ${p.aokRang}.`,
    resume: `In Berlin the GKV-Spitzenverband list offers ${p.n} statutory health funds, ${p.bund.length} nationwide and ${p.regional.length} regionally open. The cheapest is ${p.billig.kurz} with an additional rate of ${EN.pk(p.billig.zb!)}, the most expensive ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child that is ${EN.eur(p.spanneJahr)} a year in your share, ${EN.eur(p.spanneJahrBbg)} at the contribution ceiling. The capital’s regional fund is AOK Nordost, which also covers Brandenburg and Mecklenburg-Western Pomerania. Its rate of ${EN.pk(aok.zb!)} is ${ueberSchnitt ? 'above' : 'below'} the official average of ${EN.pz(w.zb_durchschnitt)}; among the ${aoks.length} AOK funds it is number ${aokPlatz} from the bottom. Because home or workplace counts, Brandenburg residents who work in the city can also use the Berlin list, which matters for anyone moving to Berlin for a job.`,
    faqs: [
      { q: 'Which health fund is cheapest in Berlin?', a: `${p.billig.kurz} with an additional rate of ${EN.pk(p.billig.zb!)}, followed by ${top.slice(1, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohnBillig)} a month at ${p.billig.kurz}, health and care insurance together. Whether advice in English, the app or a bonus scheme suit you is not reflected in the rate.` },
      { q: 'I live in Potsdam and work in Berlin. Which funds can I join?', a: `Any fund open to Brandenburg or to Berlin, because the choice follows your home or your workplace. ${nurBerlin.length ? `Reachable only through your Berlin job are, for example, ${nurBerlin.slice(0, 3).map((k) => k.kurz).join(', ')}.` : 'Both lists are currently the same.'} On ${EN.eur(BEISPIEL.lohn)} gross the cheapest Berlin fund saves ${EN.eur(Math.max(0, pendlerVorteil))} a year against the cheapest Brandenburg one.` },
      { q: 'Is AOK Nordost in Berlin more expensive than TK?', a: `AOK Nordost charges ${EN.pk(aok.zb!)}, Techniker Krankenkasse ${EN.pk(tk.zb!)}. ${aok.zb! > tk.zb! ? `On ${EN.eur(BEISPIEL.lohn)} gross AOK members therefore pay ${EN.eur(Math.round((kostenZeile(aok).lohn - kostenZeile(tk).lohn) * 12))} a year more than TK members.` : 'So AOK Nordost is not dearer.'} Against the cheapest fund open in Berlin the gap is ${EN.eur(p.aokVsBillig)} a year. Both funds cover the same statutory benefits, so the price gap is the main measurable difference.` },
      { q: 'Are there funds open only in Berlin?', a: `${p.nurHier.length ? `Yes: ${p.nurHier.map((k) => k.kurz).join(', ')}.` : 'No. No fund on the list is open to Berlin alone; even AOK Nordost covers three states.'} The regionally open funds in the Berlin ranking are company and guild funds that have opened their statutes to several states, Berlin among them.` },
      { q: 'What do students in Berlin pay at the cheapest fund?', a: `Students pay seven tenths of the general rate plus their fund’s full additional rate and care insurance, on the statutory BAföG need rate of ${EN.eur(w.bafoeg_bedarf)}. Anyone enrolled at a Berlin university may choose any fund on the Berlin list. Select “student” in the calculator above to see the exact amount.` },
    ],
    body: (h) => `
<h2>A capital that shares its AOK</h2>
<p>Since the regional funds merged, Berlin has had no AOK of its own. AOK Nordost covers Berlin, ${h.a('guenstigste-krankenkasse-brandenburg', 'Brandenburg')} and ${h.a('guenstigste-krankenkasse-mecklenburg-vorpommern', 'Mecklenburg-Western Pomerania')} at the same rate of ${h.pk(aok.zb!)}. In the Berlin ranking it sits at ${p.aokRang} of ${p.n}. For a member on ${h.eur(BEISPIEL.lohn)} gross the gap to the cheapest fund open to them is ${h.eur(p.aokVsBillig)} a year; at the contribution ceiling of ${h.eur(w.bbgKv, 2)} it grows, because the additional rate rises with pay.</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `The five cheapest for Berlin, ${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Commuting between Berlin and Brandenburg</h2>
<p>Many people travel into the city from the surrounding belt every day. For them both the home in Brandenburg and the job in Berlin count when choosing a fund. ${bb.billig.id === p.billig.id ? `The cheapest fund is the same in both states, ${p.billig.kurz}.` : `In Brandenburg ${bb.billig.kurz} tops the list at ${h.pk(bb.billig.zb!)}, in Berlin ${p.billig.kurz} at ${h.pk(p.billig.zb!)}; anyone working in Berlin may join the Berlin fund.`} If the Berlin job ends, membership continues; a regionally open fund cannot drop you just because your workplace changes.</p>
<h2>What newcomers to Berlin should know</h2>
<p>An application to the new fund is enough; the old one is notified electronically. Membership starts on the first day of the month after next, after twelve months’ lock-in or straight after a rate rise (${h.a('krankenkasse-wechseln', 'work out the date')}). If you are new to Germany and have no previous statutory fund, there is no lock-in to wait for: you simply choose. Employees and employers in Berlin split care insurance in half, ${h.pz(w.pv_satz / 2)} each; childless members from 23 add ${h.pz(w.pv_kinderlos)}. Every fund with its rate and area is in the ${h.a('zusatzbeitrag-liste', 'list of additional rates')}.</p>`,
  },
});
