import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, laenderVergleich, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN, kasse } from '../../lib/engine/kassen';

/** Nordrhein-Westfalen: längste Kassenliste aller Länder, zwei AOKs je nach Landesteil. */
const p = landProfil('NW');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const nordwest = kasse('aok-nordwest-die-gesundheitskasse');
const rheinland = kasse('aok-rheinland-hamburg-die-gesundheitskasse');
const rang = (id: string) => p.r.filter((k) => k.zb! < kasse(id).zb!).length + 1;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokDiff = Math.round(Math.abs(kostenZeile(rheinland).lohn - kostenZeile(nordwest).lohn) * 12);
const billigereAok = nordwest.zb! <= rheinland.zb! ? nordwest : rheinland;
const teurereAok = billigereAok.id === nordwest.id ? rheinland : nordwest;
const vergleich = laenderVergleich();
const meiste = Math.max(...vergleich.map((x) => x.n));
const istMeiste = p.n === meiste;
const regionalNw = p.regional.filter((k) => k.kassenart !== 'AOK');

export default defineGuide({
  id: 'guenstigste-krankenkasse-nordrhein-westfalen',
  group: 'laender',
  order: 59,
  land: 'NW',
  tool: 'beitrag',
  toolPreset: { land: 'NW', kasse: 'aok-nordwest-die-gesundheitskasse' },
  related: ['aok-nordwest-die-gesundheitskasse', 'aok-rheinland-hamburg-die-gesundheitskasse', 'guenstigste-krankenkasse-niedersachsen', 'guenstigste-krankenkasse-hessen', 'zusatzbeitrag-liste'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_242', 'sgb5_249'],
  de: {
    slug: 'guenstigste-krankenkasse-nordrhein-westfalen',
    nav: 'Nordrhein-Westfalen',
    card: `${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; zwei AOKs: NordWest mit ${DE.pk(nordwest.zb!)}, Rheinland/Hamburg mit ${DE.pk(rheinland.zb!)}.`,
    title: 'Günstigste Krankenkasse NRW 2027: alle Kassen, beide AOKs',
    description: `Nordrhein-Westfalen 2026/2027: wählbare Krankenkassen von ${DE.pk(p.billig.zb!)} bis ${DE.pk(p.teuer.zb!)} in Euro, AOK NordWest und AOK Rheinland/Hamburg im Vergleich, mit Rangliste.`,
    h1: 'Günstigste Krankenkasse in Nordrhein-Westfalen',
    intro: `NRW hat ${istMeiste ? 'die längste Kassenliste aller Länder' : 'eine der längsten Kassenlisten'}: ${p.n} Kassen ab ${DE.pk(p.billig.zb!)}, dazu zwei Ortskrankenkassen mit verschiedenen Sätzen.`,
    resume: `In Nordrhein-Westfalen stehen laut Liste des GKV-Spitzenverbands ${p.n} Krankenkassen zur Wahl, ${istMeiste ? 'mehr als in jedem anderen Land' : 'fast so viele wie im Land mit der längsten Liste'}: ${p.bund.length} bundesweit geöffnete und ${p.regional.length} regionale. Die Zusatzbeiträge reichen von ${DE.pk(p.billig.zb!)} bei ${p.billig.kurz} bis ${DE.pk(p.teuer.zb!)} bei ${p.teuer.kurz}; bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind sind das ${DE.eur(p.spanneJahr)} im Jahr Unterschied. Als einziges Land hat NRW zwei Ortskrankenkassen, je nach Landesteil: die AOK NordWest in Westfalen-Lippe mit ${DE.pk(nordwest.zb!)} und die AOK Rheinland/Hamburg im Rheinland mit ${DE.pk(rheinland.zb!)}. In der Landesliste werden beide geführt; welche für Sie die zuständige Ortskrankenkasse ist, hängt davon ab, ob Sie in Münster und Dortmund oder in Köln und Düsseldorf wohnen oder arbeiten. Zwischen beiden liegen bei diesem Lohn ${DE.eur(aokDiff)} im Jahr, und beide dürfen Sie wählen, wenn Sie in NRW wohnen oder arbeiten.`,
    faqs: [
      { q: 'Welche AOK ist in NRW für mich zuständig?', a: `Das richtet sich nach dem Landesteil. In Westfalen und Lippe, also etwa in Dortmund, Münster, Bielefeld oder Paderborn, ist es die AOK NordWest (${DE.pk(nordwest.zb!)}). Im Rheinland, etwa in Köln, Düsseldorf, Aachen oder Duisburg, ist es die AOK Rheinland/Hamburg (${DE.pk(rheinland.zb!)}). Die Liste des GKV-Spitzenverbands nennt für beide nur das Land Nordrhein-Westfalen.` },
      { q: 'Wie weit liegen die beiden AOKs in NRW auseinander?', a: `${billigereAok.kurz} verlangt ${DE.pk(billigereAok.zb!)} und steht in der NRW-Rangliste auf Platz ${rang(billigereAok.id)}, ${teurereAok.kurz} mit ${DE.pk(teurereAok.zb!)} auf Platz ${rang(teurereAok.id)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind sind das ${DE.eur(aokDiff)} im Jahr für Sie. Unter allen ${aoks.length} AOKs gehören beide eher ins Mittelfeld oder darüber.` },
      { q: 'Welche Kasse ist in Nordrhein-Westfalen am günstigsten?', a: `${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, danach ${top.slice(1, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie dort ${DE.eur(p.lohnBillig)} im Monat für Kranken- und Pflegeversicherung. Die Reihenfolge berücksichtigt nur den Zusatzbeitrag, nicht Service oder Satzungsleistungen.` },
      { q: 'Warum gibt es in NRW so viele regionale Kassen?', a: `Viele Betriebs- und Innungskrankenkassen öffnen ihre Satzung für das bevölkerungsreichste Land, oft zusammen mit Nachbarländern. In der NRW-Liste stehen ${regionalNw.length} solcher regionalen Kassen neben den AOKs, ${p.nurHier.length ? `davon nur hier geöffnet: ${p.nurHier.map((k) => k.kurz).join(', ')}` : 'keine davon ausschließlich für NRW'}. Für Sie heißt das: mehr Auswahl, aber auch mehr Vergleichsarbeit.` },
      { q: 'Darf ich in Köln die AOK NordWest wählen?', a: `Die Liste des GKV-Spitzenverbands führt beide AOKs als für Nordrhein-Westfalen geöffnet, ohne nach Landesteilen zu trennen. Maßgeblich ist am Ende die Satzung der Kasse; fragen Sie im Zweifel vor dem Antrag nach. Bei ${DE.eur(BEISPIEL.lohn)} brutto liegen zwischen den beiden AOKs ${DE.eur(aokDiff)} im Jahr, die günstigste offene Kasse spart gegenüber ${billigereAok.kurz} weitere ${DE.eur(Math.round((kostenZeile(billigereAok).lohn - p.lohnBillig) * 12))}.` },
      { q: 'Was zahlen Rentner im Ruhrgebiet bei der AOK NordWest?', a: `Mit ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente und einem Kind ${DE.eur(kostenZeile(nordwest).rente)} im Monat für Kranken- und Pflegeversicherung, bei ${p.billig.kurz} ${DE.eur(kostenZeile(p.billig).rente)}. Die Rentenversicherung trägt die Hälfte der Krankenversicherung, die Pflege zahlen Rentner allein. Ein neuer Zusatzbeitrag wird erst ab dem zweiten Folgemonat von der Rente abgezogen.` },
    ],
    body: (h) => `
<h2>Westfalen-Lippe oder Rheinland: zwei Ortskrankenkassen</h2>
<p>Nordrhein-Westfalen ist das einzige Land, das zwei AOKs nebeneinander hat. Die Grenze verläuft entlang der alten Landesteile: Westfalen-Lippe gehört zur AOK NordWest, die zugleich ${h.a('guenstigste-krankenkasse-schleswig-holstein', 'Schleswig-Holstein')} versichert; das Rheinland zur AOK Rheinland/Hamburg, die auch für ${h.a('guenstigste-krankenkasse-hamburg', 'Hamburg')} zuständig ist. Beide Kassen haben ihre eigene Seite:</p>
${h.table(['AOK', 'Gebiet in NRW', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'Rang in NRW'], [
  [kLink(h, nordwest), 'Westfalen-Lippe', h.pk(nordwest.zb!), h.eur(kostenZeile(nordwest).lohn), String(rang(nordwest.id))],
  [kLink(h, rheinland), 'Rheinland', h.pk(rheinland.zb!), h.eur(kostenZeile(rheinland).lohn), String(rang(rheinland.id))],
], `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'l', 'r', 'r', 'r'])}
<h2>Die günstigsten Kassen an Rhein und Ruhr</h2>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<p>Bei ${p.n} Kassen hilft die Rangliste im Rechner oben mehr als jede Empfehlung: Sie sortiert alle für NRW geöffneten Kassen nach Ihrem Beitrag in Euro und zeigt, was Sie gegenüber Ihrer heutigen Kasse im Jahr sparen oder mehr zahlen. An der Beitragsbemessungsgrenze von ${h.eur(w.bbgKv, 2)} wächst der Abstand zwischen günstigster und teuerster Kasse auf ${h.eur(p.spanneJahrBbg)} im Jahr.</p>
<h2>Pendeln über die Landesgrenzen</h2>
<p>Wer im Münsterland wohnt und in Osnabrück arbeitet, darf auch die Kassen ${h.a('guenstigste-krankenkasse-niedersachsen', 'Niedersachsens')} wählen; wer aus dem Siegerland nach ${h.a('guenstigste-krankenkasse-hessen', 'Hessen')} pendelt, die hessischen. Der Wechsel selbst ist überall gleich: Antrag bei der neuen Kasse, neue Mitgliedschaft ab dem übernächsten Monatsersten (${h.a('krankenkasse-wechseln', 'Termin rechnen')}). Die Pflegeversicherung wird in NRW hälftig geteilt, je ${h.pz(w.pv_satz / 2)}.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-north-rhine-westphalia',
    nav: 'North Rhine-Westphalia',
    card: `${p.n} funds from ${EN.pk(p.billig.zb!)}; two AOKs: NordWest at ${EN.pk(nordwest.zb!)}, Rheinland/Hamburg at ${EN.pk(rheinland.zb!)}.`,
    title: 'Cheapest Health Insurance NRW 2027: All Funds, Both AOKs',
    description: `North Rhine-Westphalia 2026/2027: funds you can join from ${EN.pk(p.billig.zb!)} to ${EN.pk(p.teuer.zb!)}, cost in euros, AOK NordWest and AOK Rheinland/Hamburg compared, full ranking.`,
    h1: 'Cheapest health insurance in North Rhine-Westphalia',
    intro: `NRW has ${istMeiste ? 'the longest fund list of any state' : 'one of the longest fund lists'}: ${p.n} funds from ${EN.pk(p.billig.zb!)}, plus two regional AOK funds with different rates.`,
    resume: `In North Rhine-Westphalia (Nordrhein-Westfalen, NRW) the GKV-Spitzenverband list offers ${p.n} health funds, ${istMeiste ? 'more than any other state' : 'nearly as many as the state with the longest list'}: ${p.bund.length} open nationwide and ${p.regional.length} regional. Additional rates run from ${EN.pk(p.billig.zb!)} at ${p.billig.kurz} to ${EN.pk(p.teuer.zb!)} at ${p.teuer.kurz}; on ${EN.eur(BEISPIEL.lohn)} gross with one child that is ${EN.eur(p.spanneJahr)} a year. NRW is the only state with two regional AOK funds, depending on the region: AOK NordWest in Westphalia-Lippe at ${EN.pk(nordwest.zb!)} and AOK Rheinland/Hamburg in the Rhineland at ${EN.pk(rheinland.zb!)}. The state list includes both; which one is your local AOK depends on whether you live or work around Münster and Dortmund or around Cologne and Düsseldorf. At that pay the two are ${EN.eur(aokDiff)} a year apart, and you may join either if you live or work in NRW.`,
    faqs: [
      { q: 'Which AOK is responsible for me in NRW?', a: `It depends on the region. In Westphalia and Lippe, for example Dortmund, Münster, Bielefeld or Paderborn, it is AOK NordWest (${EN.pk(nordwest.zb!)}). In the Rhineland, for example Cologne, Düsseldorf, Aachen or Duisburg, it is AOK Rheinland/Hamburg (${EN.pk(rheinland.zb!)}). The GKV-Spitzenverband list names only the state of North Rhine-Westphalia for both.` },
      { q: 'How far apart are the two AOKs in NRW?', a: `${billigereAok.kurz} charges ${EN.pk(billigereAok.zb!)} and ranks ${rang(billigereAok.id)} in NRW, ${teurereAok.kurz} at ${EN.pk(teurereAok.zb!)} ranks ${rang(teurereAok.id)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child that is ${EN.eur(aokDiff)} a year for you. Among all ${aoks.length} AOK funds both sit mid-table or higher.` },
      { q: 'Which fund is cheapest in North Rhine-Westphalia?', a: `${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, then ${top.slice(1, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohnBillig)} a month there for health and care insurance. The order reflects the additional rate only, not service or extra benefits.` },
      { q: 'Why are there so many regional funds in NRW?', a: `Many company and guild funds open their statutes to Germany’s most populous state, often together with neighbouring states. The NRW list has ${regionalNw.length} such regional funds besides the AOKs, ${p.nurHier.length ? `of which open only here: ${p.nurHier.map((k) => k.kurz).join(', ')}` : 'none of them open to NRW alone'}. For you that means more choice, and more comparing.` },
      { q: 'Can I join AOK NordWest while living in Cologne?', a: `The GKV-Spitzenverband list shows both AOK funds as open to North Rhine-Westphalia without splitting the state into regions. The fund’s statutes are what finally count, so ask before applying if in doubt. On ${EN.eur(BEISPIEL.lohn)} gross the two AOKs are ${EN.eur(aokDiff)} a year apart, and the cheapest open fund saves another ${EN.eur(Math.round((kostenZeile(billigereAok).lohn - p.lohnBillig) * 12))} compared with ${billigereAok.kurz}.` },
      { q: 'What do pensioners in the Ruhr pay at AOK NordWest?', a: `With a ${EN.eur(BEISPIEL.rente)} state pension and one child, ${EN.eur(kostenZeile(nordwest).rente)} a month for health and care insurance, against ${EN.eur(kostenZeile(p.billig).rente)} at ${p.billig.kurz}. The pension insurance pays half the health contribution; pensioners pay care insurance alone. A new additional rate is deducted from the pension only from the second month after it changes.` },
    ],
    body: (h) => `
<h2>Westphalia-Lippe or the Rhineland: two regional funds</h2>
<p>North Rhine-Westphalia is the only state with two AOK funds side by side. The line follows the old regions: Westphalia-Lippe belongs to AOK NordWest, which also covers ${h.a('guenstigste-krankenkasse-schleswig-holstein', 'Schleswig-Holstein')}; the Rhineland belongs to AOK Rheinland/Hamburg, which is also responsible for ${h.a('guenstigste-krankenkasse-hamburg', 'Hamburg')}. Both have their own page:</p>
${h.table(['AOK', 'Area in NRW', 'Additional rate', 'You pay a month', 'Rank in NRW'], [
  [kLink(h, nordwest), 'Westphalia-Lippe', h.pk(nordwest.zb!), h.eur(kostenZeile(nordwest).lohn), String(rang(nordwest.id))],
  [kLink(h, rheinland), 'Rhineland', h.pk(rheinland.zb!), h.eur(kostenZeile(rheinland).lohn), String(rang(rheinland.id))],
], `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'l', 'r', 'r', 'r'])}
<h2>The cheapest funds on the Rhine and Ruhr</h2>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<p>With ${p.n} funds, the ranking in the calculator above helps more than any recommendation: it sorts every fund open to NRW by your contribution in euros and shows what you would save or pay extra a year compared with your current fund. At the contribution ceiling of ${h.eur(w.bbgKv, 2)} the gap between the cheapest and dearest fund reaches ${h.eur(p.spanneJahrBbg)} a year.</p>
<h2>Commuting across state borders</h2>
<p>If you live in the Münsterland and work in Osnabrück, you may also choose the funds of ${h.a('guenstigste-krankenkasse-niedersachsen', 'Lower Saxony')}; commute from the Siegerland into ${h.a('guenstigste-krankenkasse-hessen', 'Hesse')} and the Hessian ones are open to you. Switching itself is the same everywhere: apply to the new fund, membership from the first day of the month after next (${h.a('krankenkasse-wechseln', 'work out the date')}). Care insurance is split in half in NRW, ${h.pz(w.pv_satz / 2)} each.</p>`,
  },
});
