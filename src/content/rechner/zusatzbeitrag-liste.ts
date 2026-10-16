import { defineGuide, type Helpers } from '../../lib/guide-types';
import { KASSEN, offen, statistik, STAND, HISTORIE, LAENDER, type Kassenart } from '../../lib/engine/kassen';
import { landProfil, kLink, BEISPIEL } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { displayDate } from '../../lib/format';

/** Die vollständige Liste (§ 242 Abs. 5 SGB V): Zählungen nach Kassenart und Öffnung, Änderungen seit Beginn der Aufzeichnung. */
const w = J(2026);
const mitSatz = KASSEN.filter((k) => k.zb !== null);
const alle = offen();
const st = statistik(alle);
const betrieb = mitSatz.filter((k) => k.art === 'betrieblich');
const bund = mitSatz.filter((k) => k.art === 'bundesweit');
const regional = mitSatz.filter((k) => k.art === 'regional');
const unter = alle.filter((k) => k.zb! < w.zb_durchschnitt).length;
const arten: Kassenart[] = ['AOK', 'EK', 'BKK', 'IKK', 'KBS'];
const proArt = arten.map((a) => { const ks = mitSatz.filter((k) => k.kassenart === a); const s = statistik(ks); return { a, n: ks.length, min: s.min, max: s.max }; });
type Ereignis = { datum: string; art: string; name?: string; alt?: number | string[]; neu?: number | string[]; zb?: number; anzahl?: number };
const ereignisse = (HISTORIE.ereignisse as Ereignis[]).filter((e) => e.art !== 'start').slice(-12).reverse();
const start = (HISTORIE.ereignisse as Ereignis[]).find((e) => e.art === 'start');
const ARTNAME = { de: { AOK: 'AOK', EK: 'Ersatzkassen', BKK: 'Betriebskrankenkassen', IKK: 'Innungskrankenkassen', KBS: 'KNAPPSCHAFT', LKK: 'SVLFG' }, en: { AOK: 'AOK (regional funds)', EK: 'Substitute funds', BKK: 'Company funds (BKK)', IKK: 'Guild funds (IKK)', KBS: 'KNAPPSCHAFT', LKK: 'SVLFG' } };
/** Ein Land je Zeile: hier stehen die früheren Länderseiten gesammelt (günstigste Kasse, AOK, Spanne). */
const laender = LAENDER.map((l) => landProfil(l));
const proLand = (l: 'de' | 'en') => [...laender].sort((p, q) => p.name[l].localeCompare(q.name[l], 'de'));
const meisteKassen = [...laender].sort((p, q) => q.n - p.n)[0];
const wenigsteKassen = [...laender].sort((p, q) => p.n - q.n)[0];
const groessteSpanne = [...laender].sort((p, q) => q.spanneJahr - p.spanneJahr)[0];
const landTabelle = (h: Helpers, l: 'de' | 'en') => h.table(
  l === 'de' ? ['Land', 'wählbar', 'günstigste Kasse', 'AOK', 'Spanne im Jahr'] : ['State', 'open', 'cheapest fund', 'AOK', 'spread a year'],
  proLand(l).map((p) => [p.name[l], String(p.n), `${kLink(h, p.billig)}, ${h.pk(p.billig.zb!)}`, p.aok ? `${kLink(h, p.aok)}, ${h.pk(p.aok.zb!)}` : '–', h.eur(p.spanneJahr)]),
  l === 'de' ? `Spanne: günstigste gegen teuerste wählbare Kasse, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026` : `Spread: cheapest against most expensive open fund, ${h.eur(BEISPIEL.lohn)} gross, one child, 2026`,
  ['l', 'r', 'l', 'l', 'r']);
const ereignisTabelle = (h: Helpers, l: 'de' | 'en') => ereignisse.length
  ? h.table(l === 'de' ? ['Datum', 'Kasse', 'Änderung'] : ['Date', 'Fund', 'Change'], ereignisse.map((e) => [h.date(e.datum), e.name ?? '', e.art === 'satz' ? `${h.pk(e.alt as number)} → ${h.pk(e.neu as number)}` : e.art === 'neu' ? (l === 'de' ? 'neu in der Liste' : 'new in the list') : e.art === 'weg' ? (l === 'de' ? 'aus der Liste entfernt' : 'removed from the list') : (l === 'de' ? 'Öffnung geändert' : 'opening changed')]), l === 'de' ? 'Aufgezeichnet beim täglichen Abruf' : 'Recorded by the daily download', ['l', 'l', 'l'])
  : `<p>${l === 'de' ? `Seit Beginn der Aufzeichnung am ${h.date(start?.datum ?? STAND)} hat sich kein Satz geändert. Jede Änderung erscheint hier mit dem Tag, an dem sie in der amtlichen Liste steht.` : `No rate has changed since recording began on ${h.date(start?.datum ?? STAND)}. Every change will appear here with the day it shows up in the official list.`}</p>`;

export default defineGuide({
  id: 'zusatzbeitrag-liste',
  group: 'rechner',
  order: 2,
  tool: 'liste',
  related: ['zusatzbeitrag-2027', 'durchschnittlicher-zusatzbeitrag', 'krankenkasse-wechseln', 'beste-krankenkasse', 'techniker-krankenkasse'],
  sources: ['gkvListe', 'gkvListePdf', 'sgb5_242', 'sgb5_175', 'sgb5_173'],
  de: {
    slug: 'zusatzbeitrag-krankenkassen-liste',
    nav: 'Liste aller Zusatzbeiträge',
    card: `Alle ${mitSatz.length} Kassen mit Satz, nach Land und Kassenart filterbar, mit Ihrem Beitrag in Euro und jeder Änderung seit der Aufzeichnung.`,
    title: 'Zusatzbeitrag Krankenkassen Liste 2027: alle Kassen, täglich',
    description: `Liste der Zusatzbeiträge aller gesetzlichen Krankenkassen 2026/2027, von ${DE.pk(st.min)} bis ${DE.pk(st.max)}: nach Bundesland und Kassenart filtern, Ihr Beitrag in Euro.`,
    h1: 'Zusatzbeitrag aller Krankenkassen: die vollständige Liste',
    intro: `${alle.length} Kassen stehen in mindestens einem Land jedem offen, von ${DE.pk(st.min)} bis ${DE.pk(st.max)}; ${unter} liegen unter dem amtlichen Durchschnitt von ${DE.pz(w.zb_durchschnitt)}.`,
    resume: `Der GKV-Spitzenverband muss die Zusatzbeitragssätze aller gesetzlichen Krankenkassen laufend im Internet veröffentlichen (§ 242 Abs. 5 SGB V). Diese Liste lesen wir jeden Tag. Stand ${displayDate(STAND, 'de-DE')}: ${mitSatz.length} Kassen erheben einen Zusatzbeitrag, ${bund.length} davon sind bundesweit geöffnet, ${regional.length} nur in einzelnen Ländern und ${betrieb.length} nur für die Beschäftigten ihres Trägerunternehmens. Unter den ${alle.length} frei wählbaren Kassen reicht der Satz von ${DE.pk(st.min)} bis ${DE.pk(st.max)}, der ungewichtete Mittelwert liegt bei ${DE.pz(st.mittel)}, der Median bei ${DE.pz(st.median)}; der amtliche durchschnittliche Zusatzbeitragssatz für 2026 beträgt ${DE.pz(w.zb_durchschnitt)}. Die Tabelle unten zeigt jede Kasse mit dem Beitrag, den Beschäftigte mit Ihrem Bruttolohn dort zahlen. Wichtig für den Jahreswechsel: Die amtliche Liste zeigt einen neuen Satz erst ab dem Tag, an dem er gilt, eine Erhöhung zum Januar also erst am 1. Januar.`,
    faqs: [
      { q: 'Warum stehen manche Betriebskrankenkassen nicht in der Rangliste?', a: `Weil ${betrieb.length} Betriebskrankenkassen ihre Satzung nicht geöffnet haben: Sie nehmen nur Beschäftigte ihres Trägerunternehmens auf, oft auch deren Angehörige. In der Liste lassen sie sich mit dem Filter einblenden. Arbeiten Sie dort, kann eine solche Kasse günstig sein; für alle anderen ist sie nicht wählbar.` },
      { q: 'Was bedeutet „geöffnet in“ bei einer Krankenkasse?', a: 'Eine Kasse kann ihre Satzung für bestimmte Länder öffnen. Wählen dürfen Sie sie, wenn Sie in einem dieser Länder wohnen oder arbeiten; der Wohn- oder der Beschäftigungsort genügt. Die AOK ist immer an ihr Land oder ihre Region gebunden, Ersatzkassen sind bundesweit geöffnet.' },
      { q: 'In welchem Bundesland kann man unter den meisten Krankenkassen wählen?', a: `In ${meisteKassen.name.de} mit ${meisteKassen.n} wählbaren Kassen, am wenigsten sind es in ${wenigsteKassen.name.de} mit ${wenigsteKassen.n}. Der Unterschied kommt von den regionalen Kassen: Ersatzkassen sind überall geöffnet, AOKs, viele Betriebs- und Innungskassen nur in einzelnen Ländern. Am weitesten liegen günstigste und teuerste Kasse in ${groessteSpanne.name.de} auseinander, bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(groessteSpanne.spanneJahr)} im Jahr.` },
      { q: 'Wie oft ändern sich die Zusatzbeiträge?', a: 'Die meisten Kassen beschließen ihren Satz einmal im Jahr, im Dezember für den 1. Januar. Reicht das Geld nicht, darf eine Kasse auch unterjährig erhöhen; das löst jedes Mal ein Sonderkündigungsrecht aus. Senkungen sind seltener. Jede Änderung, die in der amtlichen Liste erscheint, halten wir mit Datum fest.' },
    ],
    body: (h) => `
<h2>Günstigste Krankenkasse in jedem Bundesland</h2>
<p>Welche Kassen Sie wählen dürfen, hängt vom Land ab, in dem Sie wohnen oder arbeiten; einer der beiden Orte genügt. Wer pendelt, etwa von Niedersachsen nach Bremen oder von Brandenburg nach Berlin, wählt aus beiden Listen. Die Tabelle zeigt für jedes Land die günstigste wählbare Kasse, die eigene AOK und den Abstand zwischen günstigster und teuerster Kasse; die vollständige Rangliste eines Landes zeigt der Filter „Bundesland“ oben.</p>
${landTabelle(h, 'de')}
<p>Zwei Besonderheiten verändern den Beitrag je nach Land. In Sachsen tragen Beschäftigte ${h.num(w.pv_sachsen_an_mehr, 1)} Prozentpunkte mehr Pflegebeitrag als anderswo, weil das Land 1995 keinen Feiertag gestrichen hat; maßgeblich ist der Arbeitsort (${h.a('pflegeversicherung-beitrag', 'Pflegebeitrag rechnen')}). Und die AOK ist an ihre Region gebunden: Die AOK Rheinland/Hamburg gilt in Hamburg und im Rheinland, die AOK Nordost in Berlin, Brandenburg und Mecklenburg-Vorpommern, die AOK PLUS in Sachsen und Thüringen, die AOK NordWest in Westfalen-Lippe und Schleswig-Holstein. Der Satz ist überall derselbe, nur die Auswahl daneben ändert sich.</p>
<h2>Die Kassenarten im Überblick</h2>
${h.table(['Kassenart', 'Kassen mit Satz', 'niedrigster', 'höchster'], proArt.map((x) => [ARTNAME.de[x.a], String(x.n), h.pk(x.min), h.pk(x.max)]), 'Alle Kassen mit Zusatzbeitrag, auch geschlossene Betriebskrankenkassen', ['l', 'r', 'r', 'r'])}
<p>Die Sozialversicherung für Landwirtschaft, Forsten und Gartenbau (SVLFG) erhebt als landwirtschaftliche Krankenkasse keinen Zusatzbeitrag und versichert nur Menschen aus der Landwirtschaft; sie fehlt deshalb in den Zählungen. Für alle anderen gilt: Der Zusatzbeitrag ist der einzige Teil des Beitrags, der sich zwischen den Kassen unterscheidet. Allgemeiner Satz (${h.pz(w.kv_allgemein)}), Beitragsbemessungsgrenze und Pflegebeitrag sind überall gleich.</p>
<h2>Änderungen seit Beginn der Aufzeichnung</h2>
${ereignisTabelle(h, 'de')}
<h2>So lesen Sie die Tabelle</h2>
<p>Die Spalte „Ihr Beitrag“ rechnet mit dem Bruttolohn im Feld oben, als Beschäftigter mit einem Kind, Kranken- und Pflegeversicherung zusammen; für Rente, Selbstständigkeit oder Studium nutzen Sie den ${h.a('home', 'Beitragsrechner')}. Die Reihenfolge ergibt sich allein aus dem Satz, nicht aus Leistungen oder Service. Wer wechseln will, findet die Fristen im ${h.a('krankenkasse-wechseln', 'Wechsel-Rechner')}. Haben zwei Kassen denselben Satz, teilen sie sich den Rang.</p>`,
  },
  en: {
    slug: 'additional-contribution-list',
    nav: 'List of all rates',
    card: `All ${mitSatz.length} funds with a rate, filter by state and type, your cost in euros and every change since recording began.`,
    title: 'Additional Contribution List 2027: Every German Health Fund',
    description: `List of every German statutory health fund’s additional rate for 2026/2027, from ${EN.pk(st.min)} to ${EN.pk(st.max)}: filter by state and fund type, see your own cost in euros.`,
    h1: 'Additional contribution of every health fund: the full list',
    intro: `${alle.length} funds are open to anyone in at least one state, from ${EN.pk(st.min)} to ${EN.pk(st.max)}; ${unter} are below the official average of ${EN.pz(w.zb_durchschnitt)}.`,
    resume: `The GKV-Spitzenverband, the umbrella body of Germany’s statutory health funds, must keep the additional contribution rates (Zusatzbeitrag) of all funds published online (section 242(5) of Book V of the Social Code). We read that list every day. As of ${displayDate(STAND, 'en-GB')}: ${mitSatz.length} funds charge an additional rate, ${bund.length} of them open nationwide, ${regional.length} only in particular states and ${betrieb.length} only to the staff of their sponsoring company. Among the ${alle.length} funds open to the public, rates run from ${EN.pk(st.min)} to ${EN.pk(st.max)}; the unweighted mean is ${EN.pz(st.mittel)} and the median ${EN.pz(st.median)}, against an official average additional rate of ${EN.pz(w.zb_durchschnitt)} for 2026. The table below shows each fund with what an employee on your gross pay would pay there. One point for the turn of the year: the official list shows a new rate only from the day it applies, so a rise in January appears on 1 January.`,
    faqs: [
      { q: 'Why are some company funds missing from the ranking?', a: `Because ${betrieb.length} company funds (Betriebskrankenkassen) have not opened their statutes: they take only staff of their sponsoring company, often relatives too. You can show them in the list with the filter. If you work there, such a fund may be cheap; for everyone else it is not an option.` },
      { q: 'What does “open in” mean for a health fund?', a: 'A fund can open its statutes to particular states. You may join if you live or work in one of them; either your home or your workplace is enough. An AOK is always tied to its state or region, while substitute funds (Ersatzkassen) are open nationwide.' },
      { q: 'Which state offers the widest choice of health funds?', a: `${meisteKassen.name.en}, with ${meisteKassen.n} funds open; the fewest are in ${wenigsteKassen.name.en}, with ${wenigsteKassen.n}. The difference comes from regional funds: substitute funds are open everywhere, while AOKs and many company and guild funds are open only in particular states. The cheapest and most expensive funds are furthest apart in ${groessteSpanne.name.en}: ${EN.eur(groessteSpanne.spanneJahr)} a year on ${EN.eur(BEISPIEL.lohn)} gross.` },
      { q: 'How often do additional rates change?', a: 'Most funds set their rate once a year, in December for 1 January. If money runs short a fund may also raise it during the year, which each time triggers a special right to leave. Cuts are rarer. Every change that appears in the official list is recorded here with its date.' },
    ],
    body: (h) => `
<h2>Cheapest health fund in each state</h2>
<p>Which funds you may join depends on the state where you live or work; either one is enough. Commuters, say from Lower Saxony into Bremen or from Brandenburg into Berlin, can choose from both lists. The table gives each state’s cheapest open fund, its own AOK and the gap between the cheapest and the most expensive fund; the “state” filter above shows a state’s full ranking.</p>
${landTabelle(h, 'en')}
<p>Two quirks change the contribution by state. In Saxony employees pay ${h.num(w.pv_sachsen_an_mehr, 1)} percentage points more care contribution than elsewhere, because the state kept its public holiday in 1995; what counts is where you work (${h.a('pflegeversicherung-beitrag', 'work out the care contribution')}). And an AOK is tied to its region: AOK Rheinland/Hamburg covers Hamburg and the Rhineland, AOK Nordost Berlin, Brandenburg and Mecklenburg-Western Pomerania, AOK PLUS Saxony and Thuringia, AOK NordWest Westphalia-Lippe and Schleswig-Holstein. The rate is the same throughout; only the choice alongside it changes.</p>
<h2>Types of fund at a glance</h2>
${h.table(['Type', 'Funds with a rate', 'lowest', 'highest'], proArt.map((x) => [ARTNAME.en[x.a], String(x.n), h.pk(x.min), h.pk(x.max)]), 'Every fund with an additional rate, including closed company funds', ['l', 'r', 'r', 'r'])}
<p>The social insurance for agriculture, forestry and horticulture (SVLFG) charges no additional rate and only covers people working in farming; it is left out of the counts. For everyone else the additional rate is the only part of the contribution that differs between funds. The general rate (${h.pz(w.kv_allgemein)}), the contribution ceiling and the care contribution are the same everywhere.</p>
<h2>Changes since recording began</h2>
${ereignisTabelle(h, 'en')}
<h2>How to read the table</h2>
<p>The “you pay” column uses the gross pay in the field above, as an employee with one child, health and care insurance together; for a pension, self-employment or studies use the ${h.a('home', 'contribution calculator')}. The order comes from the rate alone, not from benefits or service. If you want to switch, the ${h.a('krankenkasse-wechseln', 'switching calculator')} gives the deadlines.</p>`,
  },
});
