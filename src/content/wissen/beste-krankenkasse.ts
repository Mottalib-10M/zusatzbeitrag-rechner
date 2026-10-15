import { defineGuide } from '../../lib/guide-types';
import { angestellt, selbststaendig, rentner } from '../../lib/engine/beitrag';
import { kasse, offen, statistik } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** Was sich an Kassen vergleichen lässt: der Preis, aus der Liste des GKV-Spitzenverbands und dem Motor. */
const w = J(2026);
const LOHN = 3800;
const an = (z: number, b = LOHN) => angestellt({ brutto: b, zb: z, jahr: 2026, eltern: 'k1' }).selbst;
const alle = offen();
const bund = alle.filter((k) => k.art === 'bundesweit');
const st = statistik(alle);
const billigBund = bund[0], teuerBund = bund[bund.length - 1];
const reihe = [billigBund, kasse('techniker-krankenkasse'), kasse('dak-gesundheit'), kasse('barmer'), teuerBund];
const jahr = (z: number, b = LOHN) => Math.round((an(z, b) - an(billigBund.zb!, b)) * 12);
const spanne = jahr(teuerBund.zb!), spanneBbg = jahr(teuerBund.zb!, w.bbgKv);
const selbstJahr = Math.round((selbststaendig({ einkommen: 3000, zb: teuerBund.zb!, jahr: 2026, krankengeld: false, eltern: 'k1' }).selbst - selbststaendig({ einkommen: 3000, zb: billigBund.zb!, jahr: 2026, krankengeld: false, eltern: 'k1' }).selbst) * 12);
const renteJahr = Math.round((rentner({ rente: 1600, zb: teuerBund.zb!, jahr: 2026, eltern: 'k1' }).selbst - rentner({ rente: 1600, zb: billigBund.zb!, jahr: 2026, eltern: 'k1' }).selbst) * 12);
const unterSchnitt = alle.filter((k) => k.zb! < w.zb_durchschnitt).length;

export default defineGuide({
  id: 'beste-krankenkasse',
  group: 'wissen',
  order: 90,
  mini: 'jahrevergleich',
  related: ['zusatzbeitrag-liste', 'krankenkasse-wechseln', 'durchschnittlicher-zusatzbeitrag', 'techniker-krankenkasse', 'bkk-firmus'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_53', 'sgb5_175'],
  de: {
    slug: 'beste-krankenkasse',
    nav: 'Die beste Krankenkasse finden',
    card: `Gleiche Pflichtleistungen, unterschiedliche Preise: bei ${DE.eur(LOHN)} brutto bis ${DE.eur(spanne)} im Jahr zwischen bundesweit wählbaren Kassen.`,
    title: 'Beste Krankenkasse 2027: Preis vergleichen, Rest prüfen',
    description: 'Beste Krankenkasse 2026 und 2027: was sich in Euro vergleichen lässt, was nicht, und wie Sie mit Zusatzbeitrag, Satzungsleistungen und Bonus Ihre Kasse wählen.',
    h1: 'Die beste Krankenkasse: was sich wirklich vergleichen lässt',
    intro: `Bei ${DE.eur(LOHN)} brutto liegen zwischen der günstigsten und der teuersten bundesweit wählbaren Kasse ${DE.eur(spanne)} im Jahr, bei gleichen gesetzlichen Leistungen.`,
    resume: `Eine beste Krankenkasse für alle gibt es nicht, aber es gibt eine Größe, die sich exakt vergleichen lässt: den Preis. Alle gesetzlichen Kassen erbringen dieselben Pflichtleistungen nach dem SGB V, vom Arztbesuch über das Krankenhaus bis zum Krankengeld, und alle verlangen denselben allgemeinen Beitragssatz von ${DE.pz(w.kv_allgemein)}. Unterschiedlich ist nur der Zusatzbeitrag, heute zwischen ${DE.pk(st.min)} und ${DE.pk(st.max)} bei den frei wählbaren Kassen. Bei ${DE.eur(LOHN)} brutto macht das zwischen ${billigBund.kurz} und ${teuerBund.kurz}, beide bundesweit geöffnet, ${DE.eur(spanne)} im Jahr für Sie aus, an der Beitragsbemessungsgrenze ${DE.eur(spanneBbg)}. Was darüber hinaus geht, also Satzungsleistungen, Bonusprogramme, Wahltarife und Service, unterscheidet sich ebenfalls, lässt sich aber nicht seriös in einer Zahl fassen. Die vernünftige Reihenfolge ist deshalb: erst den Preis für das eigene Einkommen rechnen, dann bei den zwei oder drei günstigsten prüfen, ob sie bieten, was man selbst braucht.`,
    faqs: [
      { q: 'Sind die Leistungen bei einer billigen Kasse schlechter?', a: 'Bei den Pflichtleistungen nicht. Was das SGB V vorschreibt, muss jede Kasse leisten, und darüber entscheidet weitgehend der Gemeinsame Bundesausschuss für alle gleich. Unterschiede gibt es bei freiwilligen Satzungsleistungen, bei Bonusprogrammen und beim Service, etwa wie schnell Anträge bearbeitet werden. Ein niedriger Zusatzbeitrag sagt darüber nichts aus, ein hoher auch nicht.' },
      { q: 'Wie viele Kassen liegen unter dem durchschnittlichen Zusatzbeitrag?', a: `Von ${alle.length} frei wählbaren Kassen verlangen heute ${unterSchnitt} weniger als den amtlichen Durchschnitt von ${DE.pz(w.zb_durchschnitt)}. Der Durchschnitt ist eine Rechengröße des Gesundheitsministeriums, nicht das Mittel der Kassensätze; der tatsächliche Mittelwert der Liste liegt bei ${DE.pk(st.mittel)}. Welche davon in Ihrem Land wählbar sind, zeigt der Beitragsrechner.` },
      { q: 'Lohnt sich ein Bonusprogramm mehr als ein niedriger Beitrag?', a: `Das hängt davon ab, ob Sie die Bedingungen erfüllen. Bonusprogramme nach § 65a SGB V belohnen Vorsorge oder Sport mit Geld oder Prämien, die Höhe legt jede Kasse fest. Ein günstiger Zusatzbeitrag spart dagegen ohne Bedingung: bei ${DE.eur(LOHN)} brutto ${DE.eur(Math.round(LOHN * 0.005 * 12))} im Jahr für jeden halben Punkt Unterschied. Rechnen Sie den Bonus, den Sie realistisch erreichen, gegen diesen Betrag.` },
      { q: 'Was ist, wenn meine Wunschkasse später teurer wird?', a: 'Dann haben Sie ein Sonderkündigungsrecht und können sofort weiterziehen, ohne die zwölf Monate Bindung abzuwarten. Viele Kassen ändern ihren Satz zum 1. Januar, manche auch im Laufe des Jahres. Wer jedes Jahr im Dezember kurz rechnet, verliert wenig; die Liste auf dieser Seite wird täglich aktualisiert.' },
      { q: 'Spielt die Größe einer Kasse eine Rolle?', a: 'Für die Leistungen nicht. Große Kassen haben mehr Geschäftsstellen, kleine Betriebskrankenkassen oft kürzere Wege am Telefon. Eine kleine Kasse kann mit einer anderen fusionieren; Ihre Versicherung läuft dann ohne Lücke bei der neuen Kasse weiter, und Sie dürfen wechseln, wenn der Satz danach steigt.' },
      { q: 'Was taugen Testsieger-Siegel und Rankings von Zeitschriften?', a: 'Sie gewichten Leistungen, Service und Preis nach eigenen Regeln, die nicht immer offenliegen, und sie stammen oft aus einem anderen Jahr als die heutigen Sätze. Für Ihre Entscheidung zählt, welche Extras Sie selbst nutzen werden und was Sie die Kasse im Jahr kostet. Den Preis zeigt diese Seite auf Grundlage der amtlichen Liste, ohne Gewichtung.' },
    ],
    body: (h) => `
<h2>Was überall gleich ist</h2>
<p>Die gesetzliche Krankenversicherung ist kein Tarifmarkt wie die private. Welche Behandlungen bezahlt werden, steht im SGB V und in den Richtlinien des Gemeinsamen Bundesausschusses, und das gilt für alle ${h.num(alle.length)} frei wählbaren Kassen in gleicher Weise: Arzt und Zahnarzt, Krankenhaus, Arznei- und Hilfsmittel nach den Festbeträgen, Krankengeld ab der siebten Woche der Arbeitsunfähigkeit, Vorsorgeuntersuchungen, Mutterschaftsleistungen. Auch der allgemeine Beitragssatz von ${h.pz(w.kv_allgemein)}, die Zuzahlungen in der Apotheke und die Belastungsgrenze sind für alle identisch. Kinder und Ehepartner ohne eigenes Einkommen sind bei jeder Kasse beitragsfrei mitversichert.</p>
<h2>Was sich in Euro unterscheidet</h2>
<p>Der Zusatzbeitrag ist der einzige Preisunterschied, und er ist öffentlich: Der GKV-Spitzenverband muss die Sätze aller Kassen tagesaktuell veröffentlichen (§ 242 Abs. 5 SGB V). Weil er auf das Einkommen bis zur Bemessungsgrenze wirkt, wächst der Unterschied mit dem Lohn.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'mehr im Jahr', 'mehr in fünf Jahren'], reihe.map((k) => [k.kurz, h.pk(k.zb!), h.eur(an(k.zb!)), h.eur(jahr(k.zb!)), h.eur(jahr(k.zb!) * 5)]), `${h.eur(LOHN)} brutto, ein Kind, gegenüber ${billigBund.kurz}, der günstigsten bundesweit geöffneten Kasse; heutige Sätze`, ['l', 'r', 'r', 'r', 'r'])}
<p>Regional geöffnete Kassen können noch günstiger sein, stehen aber nicht jedem offen; welche in Ihrem Land wählbar sind, zeigt der ${h.a('home', 'Beitragsrechner mit Rangliste')}. Die ${h.a('zusatzbeitrag-liste', 'vollständige Liste')} lässt sich nach Land und Kassenart filtern.</p>
<h2>Was sich nicht seriös in Euro fassen lässt</h2>
<p><strong>Satzungsleistungen.</strong> Jede Kasse darf in ihrer Satzung zusätzliche Leistungen vorsehen, etwa Leistungen nicht zugelassener Leistungserbringer wie Osteopathie, zusätzliche Vorsorge oder einen höheren Zuschuss zur künstlichen Befruchtung (§ 11 Abs. 6 SGB V), dazu Reiseimpfungen (§ 20i Abs. 2 SGB V). Sie sind meist gedeckelt und an Bedingungen geknüpft. Für die meisten Versicherten spielen sie in einem Jahr keine Rolle, für manche eine große.</p>
<p><strong>Bonusprogramme.</strong> Nach § 65a SGB V belohnen Kassen gesundheitsbewusstes Verhalten, mit Geld, Sachprämien oder Zuschüssen. Höhe und Bedingungen sind sehr verschieden und ändern sich oft.</p>
<p><strong>Wahltarife.</strong> Selbstbehalt, Prämie bei Nichtinanspruchnahme oder Kostenerstattung (§ 53 SGB V) können sich für bestimmte Gruppen lohnen, binden aber ein bis drei Jahre an die Kasse; die Prämien sind gesetzlich begrenzt.</p>
<p><strong>Service.</strong> Erreichbarkeit, Geschäftsstellen, die App, die Dauer einer Genehmigung. Das ist für viele das Wichtigste und am schwersten zu messen; Erfahrungen aus dem Bekanntenkreis sind hier oft aussagekräftiger als jede Rangliste.</p>
<p>Diese Seite bewertet keine dieser Leistungen und vergibt keine Noten. Wir nennen nur den Preis, weil er der einzige Wert ist, den eine amtliche Quelle für alle Kassen gleich und tagesaktuell ausweist.</p>
<h2>Wen der Preis besonders trifft</h2>
<p>Wie viel ein Wechsel bringt, hängt weniger von der Kasse ab als von der eigenen Lage. Angestellte teilen den Zusatzbeitrag mit dem Arbeitgeber und spüren nur die Hälfte. Selbstständige und andere freiwillige Mitglieder ohne Arbeitgeber zahlen ihn voll: Mit ${h.eur(3000)} Gewinn im Monat liegen zwischen ${billigBund.kurz} und ${teuerBund.kurz} ${h.eur(selbstJahr)} im Jahr. Rentner teilen ihn mit der Rentenversicherung; mit ${h.eur(1600)} Rente sind es ${h.eur(renteJahr)}. Am stärksten wirkt der Unterschied bei hohen Einkommen bis zur Bemessungsgrenze und bei allen, die ihn allein tragen. Wer wenig verdient oder familienversichert ist, gewinnt durch einen Wechsel wenig oder nichts; für diese Gruppe sind Service und Satzungsleistungen oft das bessere Kriterium.</p>
<h2>In vier Schritten zur passenden Kasse</h2>
<ol>
<li>Rechnen Sie Ihren Beitrag bei Ihrer heutigen Kasse und die Ersparnis bei den günstigsten Kassen Ihres Landes.</li>
<li>Nehmen Sie die zwei oder drei günstigsten und prüfen Sie auf deren Seiten die Satzungsleistungen, die Sie im kommenden Jahr wirklich brauchen, etwa für eine Schwangerschaft, Zahnreinigung oder Reiseimpfungen.</li>
<li>Rechnen Sie ein Bonusprogramm nur mit dem Betrag ein, den Sie realistisch erreichen.</li>
<li>Prüfen Sie die Fristen: Wer zwölf Monate Mitglied ist oder dessen Kasse erhöht, kann wechseln, die neue Kasse gilt ab dem übernächsten Monatsersten (${h.a('krankenkasse-wechseln', 'Fristen rechnen')}).</li>
</ol>
<p>Ein Wechsel kostet nichts, laufende Behandlungen gehen weiter, und die neue Kasse meldet ihn selbst an die alte. Wer jedes Jahr nach den Dezember-Beschlüssen kurz nachrechnet, ist im Ergebnis fast immer bei einer der günstigeren Kassen, ohne dafür Aufwand zu treiben.</p>`,
  },
  en: {
    slug: 'best-health-insurance',
    nav: 'Finding the best fund',
    card: `Same statutory benefits, different prices: on ${EN.eur(LOHN)} gross up to ${EN.eur(spanne)} a year between funds open nationwide.`,
    title: 'Best Health Insurance Germany 2027: Compare Price First',
    description: 'Best German statutory health fund for 2026 and 2027: what compares in euros, what does not, how to choose with the additional rate, extras and bonus schemes.',
    h1: 'The best health fund: what you can really compare',
    intro: `On ${EN.eur(LOHN)} gross the cheapest and the most expensive fund open nationwide are ${EN.eur(spanne)} a year apart, for the same statutory benefits.`,
    resume: `There is no single best statutory health fund (Krankenkasse) in Germany, but there is one thing that can be compared exactly: price. Every statutory fund provides the same compulsory benefits under Book V of the Social Code (SGB V), from doctor visits and hospital care to sick pay, and every fund charges the same general rate of ${EN.pz(w.kv_allgemein)}. Only the additional rate (Zusatzbeitrag) differs, today between ${EN.pk(st.min)} and ${EN.pk(st.max)} among funds open to the public. On ${EN.eur(LOHN)} gross the gap between ${billigBund.kurz} and ${teuerBund.kurz}, both open nationwide, is ${EN.eur(spanne)} a year in your share, and ${EN.eur(spanneBbg)} at the contribution ceiling. Everything beyond that, extra benefits in the fund’s statutes, bonus schemes, optional tariffs and service, also differs but cannot honestly be reduced to one number. The sensible order is therefore: work out the price for your own income first, then check whether the two or three cheapest funds offer what you actually need.`,
    faqs: [
      { q: 'Are benefits worse at a cheap fund?', a: 'Not the compulsory ones. Whatever SGB V requires, every fund must provide, and the Federal Joint Committee decides most of it for all funds alike. Differences lie in voluntary extras, bonus schemes and service, such as how quickly applications are handled. A low additional rate tells you nothing about those, and neither does a high one.' },
      { q: 'How many funds charge less than the average additional rate?', a: `Of ${alle.length} funds open to the public, ${unterSchnitt} currently charge less than the official average of ${EN.pz(w.zb_durchschnitt)}. That average is a figure set by the Health Ministry, not the mean of the funds’ rates; the actual mean of the list is ${EN.pk(st.mittel)}. The calculator shows which of them you can join in your state.` },
      { q: 'Is a bonus scheme worth more than a low contribution?', a: `It depends on whether you meet the conditions. Bonus schemes under section 65a SGB V reward check-ups or sport with money or rewards, and each fund sets the amounts. A cheap additional rate saves money with no strings: ${EN.eur(Math.round(LOHN * 0.005 * 12))} a year on ${EN.eur(LOHN)} gross for every half point of difference. Weigh the bonus you will realistically earn against that.` },
      { q: 'What if my chosen fund raises its rate later?', a: 'Then you have a special termination right and can move on straight away, without waiting out the twelve-month lock-in. Many funds change their rate on 1 January, some during the year. Checking briefly every December costs little; the list on this site is updated daily.' },
      { q: 'Does the size of a fund matter?', a: 'Not for benefits. Large funds have more branch offices, small company funds often shorter phone queues. A small fund may merge with another; your cover then continues without a gap at the new fund, and you may switch if its rate goes up afterwards.' },
      { q: 'What are magazine test seals and rankings worth?', a: 'They weight benefits, service and price by their own rules, which are not always public, and they often date from a different year than today’s rates. What counts for your decision is which extras you will actually use and what the fund costs you a year. This site shows the price, from the official list and with no weighting.' },
    ],
    body: (h) => `
<h2>What is the same everywhere</h2>
<p>Statutory health insurance is not a tariff market like private cover. Which treatment is paid for is set by SGB V and the guidelines of the Federal Joint Committee, and that applies equally to all ${h.num(alle.length)} funds open to the public: doctors and dentists, hospital care, medicines and aids at the fixed amounts, sick pay from the seventh week of incapacity, check-ups, maternity benefits. The general rate of ${h.pz(w.kv_allgemein)}, pharmacy co-payments and the annual co-payment cap are identical too. Children and a spouse without income are covered free at every fund.</p>
<h2>What differs in euros</h2>
<p>The additional rate is the only price difference, and it is public: the GKV-Spitzenverband must publish every fund’s rate day by day (section 242(5) SGB V). Because it applies to income up to the ceiling, the gap grows with pay.</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'more a year', 'more over five years'], reihe.map((k) => [k.kurz, h.pk(k.zb!), h.eur(an(k.zb!)), h.eur(jahr(k.zb!)), h.eur(jahr(k.zb!) * 5)]), `${h.eur(LOHN)} gross, one child, compared with ${billigBund.kurz}, the cheapest fund open nationwide; today’s rates`, ['l', 'r', 'r', 'r', 'r'])}
<p>Regionally open funds can be cheaper still but are not open to everyone; the ${h.a('home', 'calculator with its ranking')} shows which you can join in your state. The ${h.a('zusatzbeitrag-liste', 'full list')} can be filtered by state and type of fund.</p>
<h2>What cannot honestly be priced</h2>
<p><strong>Extra benefits.</strong> Each fund may add benefits in its statutes, such as treatment by non-licensed providers like osteopathy, extra check-ups or a higher contribution to fertility treatment (section 11(6) SGB V), plus travel vaccinations (section 20i(2) SGB V). They are usually capped and come with conditions. For most members they make no difference in a given year; for some they matter a lot.</p>
<p><strong>Bonus schemes.</strong> Under section 65a SGB V funds reward healthy behaviour with money, rewards or subsidies. Amounts and conditions vary widely and change often.</p>
<p><strong>Optional tariffs.</strong> A deductible, a bonus for not claiming, or reimbursement (section 53 SGB V) can pay off for some groups but tie you to the fund for one to three years; the payouts are capped by law.</p>
<p><strong>Service.</strong> Reachability, branch offices, the app, how long an approval takes. For many people this matters most and is hardest to measure; experiences of friends and colleagues often tell you more than any ranking.</p>
<p>This site rates none of these and gives no scores. We show only the price, because it is the one figure an official source publishes for every fund, in the same way and every day.</p>
<h2>Who feels the price most</h2>
<p>What a switch brings depends less on the fund than on your own situation. Employees share the additional rate with their employer and feel only half of it. The self-employed and other voluntary members without an employer pay it in full: on ${h.eur(3000)} profit a month, ${billigBund.kurz} and ${teuerBund.kurz} are ${h.eur(selbstJahr)} a year apart. Pensioners share it with the pension fund; on a ${h.eur(1600)} pension the gap is ${h.eur(renteJahr)}. The difference bites hardest on high incomes up to the ceiling and for anyone paying it alone. If you earn little or are covered through family, a switch gains you little or nothing; for this group service and extra benefits are often the better test.</p>
<h2>Choosing a fund in four steps</h2>
<ol>
<li>Work out your contribution at your current fund and the saving at the cheapest funds in your state.</li>
<li>Take the two or three cheapest and check on their websites the extra benefits you will really need next year, for a pregnancy, dental cleaning or travel vaccinations, say.</li>
<li>Count a bonus scheme only at the amount you will realistically earn.</li>
<li>Check the deadlines: after twelve months’ membership, or when your fund raises its rate, you can switch, and the new fund starts on the first day of the month after next (${h.a('krankenkasse-wechseln', 'work out the dates')}).</li>
</ol>
<p>Switching costs nothing, ongoing treatment continues, and the new fund notifies the old one itself. Anyone who checks briefly every year after the December decisions almost always ends up at one of the cheaper funds without much effort.</p>`,
  },
});
