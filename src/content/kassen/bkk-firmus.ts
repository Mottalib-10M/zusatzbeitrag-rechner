import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { LAENDER, LAND_NAME, kasse, rangliste } from '../../lib/engine/kassen';
import { rentner, selbststaendig } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** BKK firmus: regional geöffnete Betriebskrankenkasse; Länder, Rang und Abstände aus der Kassenliste. */
const ID = 'bkk-firmus';
const p = profil(ID);
const w = J(2026);
const offenIn = p.laender;
const nichtIn = LAENDER.filter((l) => !offenIn.includes(l));
const namen = (ls: readonly string[], l: 'de' | 'en') => ls.map((x) => LAND_NAME[x as keyof typeof LAND_NAME][l]).join(', ');
const istBilligste = p.rangBund === 1;
const tk = kostenZeile(kasse('techniker-krankenkasse'));
const me = kostenZeile(p.k);
const vsTk = Math.round((tk.lohn - me.lohn) * 12);
// Wer in einem Land ohne BKK firmus wohnt: günstigste dort wählbare Kasse.
const ersatz = nichtIn.map((l) => ({ l, k: rangliste(l)[0] }));
const selbstVsTk = Math.round((selbststaendig({ einkommen: BEISPIEL.gewinn, zb: kasse('techniker-krankenkasse').zb!, jahr: 2026, krankengeld: false, eltern: 'k1' }).selbst - p.selbst) * 12);
const renteVsTk = Math.round((rentner({ rente: BEISPIEL.rente, zb: kasse('techniker-krankenkasse').zb!, jahr: 2026, eltern: 'k1' }).selbst - p.rente) * 12);

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 27,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID, land: offenIn[0] },
  related: ['zusatzbeitrag-liste', 'beste-krankenkasse', 'krankenkasse-wechseln', 'techniker-krankenkasse'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_242'],
  de: {
    slug: 'bkk-firmus-zusatzbeitrag',
    nav: 'BKK firmus',
    card: `${DE.pk(p.zb)} Zusatzbeitrag, ${istBilligste ? 'der niedrigste aller frei wählbaren Kassen' : `Rang ${p.rangBund}`}; geöffnet in ${offenIn.length} Ländern.`,
    title: 'BKK firmus Zusatzbeitrag 2027: wer sie wählen kann',
    description: `BKK firmus Zusatzbeitrag 2026: ${DE.pk(p.zb)}. In welchen Bundesländern die Betriebskrankenkasse wählbar ist, Beitrag in Euro, Ersparnis und Ausblick auf 2027.`,
    h1: 'BKK firmus: niedriger Satz, aber nicht überall wählbar',
    intro: `Die BKK firmus verlangt ${DE.pk(p.zb)} und ist in ${offenIn.length} von 16 Ländern geöffnet; in ${namen(nichtIn, 'de')} können Sie sie nicht wählen.`,
    resume: `Die BKK firmus ist eine Betriebskrankenkasse, die ihre Satzung für ${offenIn.length} Bundesländer geöffnet hat: ${namen(offenIn, 'de')}. Wer in einem dieser Länder wohnt oder arbeitet, kann Mitglied werden, unabhängig vom Arbeitgeber. Laut Liste des GKV-Spitzenverbands erhebt sie einen Zusatzbeitrag von ${DE.pk(p.zb)}${istBilligste ? ', den niedrigsten aller Kassen, die irgendwo jedem offenstehen' : `, Rang ${p.rangBund} unter ${p.nBund} frei wählbaren Kassen`}; das sind ${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte ${p.unterDurchschnitt ? 'unter' : 'über'} dem amtlichen Durchschnitt von ${DE.pz(w.zb_durchschnitt)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlen Beschäftigte ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung, ${DE.eur(vsTk)} im Jahr weniger als bei der Techniker Krankenkasse. Selbstständige mit ${DE.eur(BEISPIEL.gewinn)} Gewinn sparen gegenüber der TK sogar ${DE.eur(selbstVsTk)}, weil sie den Zusatzbeitrag allein tragen. Über Service, Geschäftsstellen und Zusatzleistungen sagt der Satz nichts.`,
    faqs: [
      { q: 'In welchen Bundesländern kann ich die BKK firmus wählen?', a: `Laut Liste des GKV-Spitzenverbands in ${namen(offenIn, 'de')}. Es genügt, in einem dieser Länder zu wohnen oder zu arbeiten. Wer etwa in ${LAND_NAME[nichtIn[0]].de} wohnt, aber in einem der genannten Länder arbeitet, kann sie über den Arbeitsort wählen; die Kasse darf ihn nicht ablehnen.` },
      { q: 'Muss ich bei einer Firma arbeiten, um in die BKK firmus zu kommen?', a: 'Nein. Der Name stammt aus ihrer Geschichte als Betriebskrankenkasse, ihre Satzung ist aber für die genannten Länder geöffnet. Anders ist es bei geschlossenen Betriebskrankenkassen, etwa der BMW BKK oder der BKK Mahle, die nur Beschäftigte ihres Trägers aufnehmen und deshalb in keiner Rangliste dieser Seite auftauchen.' },
      { q: 'Wie viel spare ich als Rentner bei der BKK firmus?', a: `Bei ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente zahlen Sie dort ${DE.eur(p.rente)} im Monat für Kranken- und Pflegeversicherung, ${DE.eur(renteVsTk)} im Jahr weniger als bei der TK. Die Ersparnis ist kleiner als bei Selbstständigen, weil die Rentenversicherung die Hälfte des Zusatzbeitrags trägt. Den neuen Satz zieht die Rentenversicherung zwei Monate nach dem Wechsel ab.` },
      { q: 'Bleibt die BKK firmus 2027 so günstig?', a: `Das weiß heute niemand. Den Satz für 2027 beschließt der Verwaltungsrat der Kasse, meist im Dezember, und die amtliche Liste zeigt ihn ab dem Tag, an dem er gilt. Der Schätzerkreis rechnet für 2027 mit einem Durchschnitt von ${DE.pz(J(2027).zb_durchschnitt)}; erhöht die Kasse, gilt für ihre Mitglieder das Sonderkündigungsrecht.` },
    ],
    body: (h) => `
<h2>Geöffnet in ${offenIn.length} Ländern, geschlossen in ${nichtIn.length}</h2>
<p>Eine Betriebskrankenkasse kann ihre Satzung für einzelne Länder öffnen; dann muss sie dort jeden aufnehmen, der wohnt oder arbeitet (§ 175 Abs. 1 SGB V). Die BKK firmus hat das für ${namen(offenIn, 'de')} getan. Wer ausschließlich in ${namen(nichtIn, 'de')} lebt und arbeitet, kommt nicht hinein. Für diese Länder zeigt die Tabelle die günstigste Kasse, die stattdessen wählbar ist:</p>
${h.table(['Land ohne BKK firmus', 'günstigste wählbare Kasse', 'Zusatzbeitrag'], ersatz.map((x) => [LAND_NAME[x.l].de, kLink(h, x.k), h.pk(x.k.zb!)]), 'Liste des GKV-Spitzenverbands', ['l', 'l', 'r'])}
<h2>Wohnort oder Arbeitsort: was zählt</h2>
<p>Für die Wahl genügt einer der beiden Orte. Wer also in einem Land ohne Öffnung wohnt, aber jenseits der Grenze in einem geöffneten Land beschäftigt ist, kann über den Arbeitsort Mitglied werden; bei Selbstständigen und Rentnern zählt in der Regel der Wohnort. Ziehen Sie später um, bleibt die Mitgliedschaft bestehen, auch wenn die Kasse am neuen Wohnort nicht geöffnet ist. Eine neue Mitgliedschaft würde dort dagegen nicht mehr angenommen. Wählen Sie im Rechner oben beide Länder aus, um die Ranglisten zu vergleichen.</p>
<h2>Ihr Beitrag bei der BKK firmus</h2>
${h.table(['Lage', 'Grundlage', 'Ihr Anteil im Monat'], [
  ['Beschäftigt', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Beschäftigt', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Beschäftigt an der Grenze', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig, ohne Krankengeld', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studium', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, ein Kind; Studium unter 23', ['l', 'r', 'r'])}
<h2>Wann sich der Wechsel zur günstigsten Kasse rechnet</h2>
<p>Der Abstand zur teuersten frei wählbaren Kasse, ${p.teuerste.kurz} mit ${h.pk(p.teuerste.zb!)}, beträgt ${h.num(p.teuerste.zb! - p.zb, 2)} Punkte. Bei ${h.eur(BEISPIEL.lohn)} brutto sind das für Beschäftigte rund ${h.eur(Math.round((kostenZeile(p.teuerste).lohn - me.lohn) * 12))} im Jahr, an der Beitragsbemessungsgrenze mehr. Wer von einer Kasse mit mittlerem Satz kommt, spart weniger; der Rechner oben zeigt den Betrag für Ihre eigene Kasse. Die Fristen sind die üblichen: zwölf Monate Bindung, Wechsel zum übernächsten Monat, bei einer Erhöhung der alten Kasse sofort (${h.a('krankenkasse-wechseln', 'Wechsel rechnen')}).</p>
<p>Ein niedriger Satz ist kein Gütesiegel und keine Garantie für das nächste Jahr. Ob Ihnen Erreichbarkeit, Geschäftsstellen und Zusatzleistungen einer Kasse genügen, prüfen Sie vor dem Wechsel bei der Kasse selbst. Die ${h.a('zusatzbeitrag-liste', 'vollständige Liste')} zeigt alle Kassen nach Land gefiltert.</p>`,
  },
  en: {
    slug: 'bkk-firmus-additional-contribution',
    nav: 'BKK firmus',
    card: `${EN.pk(p.zb)} additional rate, ${istBilligste ? 'the lowest of all open funds' : `rank ${p.rangBund}`}; open in ${offenIn.length} states.`,
    title: 'BKK firmus Additional Contribution 2027: Who Can Join It',
    description: `BKK firmus additional rate in 2026: ${EN.pk(p.zb)}. Which German states this company fund is open in, your cost in euros, how much you save, and the outlook for 2027.`,
    h1: 'BKK firmus: a low rate, but not open everywhere',
    intro: `BKK firmus charges ${EN.pk(p.zb)} and is open in ${offenIn.length} of 16 states; in ${namen(nichtIn, 'en')} you cannot join it.`,
    resume: `BKK firmus is a company health fund (Betriebskrankenkasse) that has opened its statutes to ${offenIn.length} German states: ${namen(offenIn, 'en')}. Anyone who lives or works in one of them can join, whoever the employer is. According to the GKV-Spitzenverband list it charges an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)}${istBilligste ? ', the lowest of all funds open to the public anywhere' : `, rank ${p.rangBund} among ${p.nBund} open funds`}; that is ${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points ${p.unterDurchschnitt ? 'below' : 'above'} the official average of ${EN.pz(w.zb_durchschnitt)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child, employees pay ${EN.eur(p.lohn)} a month for health and care insurance, ${EN.eur(vsTk)} a year less than at Techniker Krankenkasse. Self-employed members with ${EN.eur(BEISPIEL.gewinn)} profit save ${EN.eur(selbstVsTk)} against TK, because they pay the whole additional rate themselves. The rate says nothing about service, branches or extra benefits.`,
    faqs: [
      { q: 'In which states can I join BKK firmus?', a: `According to the GKV-Spitzenverband list, in ${namen(offenIn, 'en')}. Living or working in one of them is enough. Someone who lives in ${LAND_NAME[nichtIn[0]].en} but works in one of those states can join through the workplace; the fund may not turn them down.` },
      { q: 'Do I need to work for a particular company to join BKK firmus?', a: 'No. The name comes from its history as a company fund, but its statutes are open in the states listed. Closed company funds are different, such as BMW BKK or BKK Mahle, which accept only their sponsor’s staff and therefore appear in no ranking on this site.' },
      { q: 'How much does a pensioner save at BKK firmus?', a: `On a ${EN.eur(BEISPIEL.rente)} state pension you pay ${EN.eur(p.rente)} a month there for health and care insurance, ${EN.eur(renteVsTk)} a year less than at TK. The saving is smaller than for the self-employed because the pension insurance pays half the additional rate. The pension fund deducts the new rate two months after the switch.` },
      { q: 'Will BKK firmus stay this cheap in 2027?', a: `Nobody knows yet. The fund’s board sets the 2027 rate, usually in December, and the official list shows it from the day it applies. The estimating group expects an average of ${EN.pz(J(2027).zb_durchschnitt)} for 2027; if the fund raises its rate, its members get the special termination right.` },
    ],
    body: (h) => `
<h2>Open in ${offenIn.length} states, closed in ${nichtIn.length}</h2>
<p>A company fund can open its statutes to individual states; it must then accept anyone who lives or works there (section 175(1) SGB V). BKK firmus has done so for ${namen(offenIn, 'en')}. If you live and work only in ${namen(nichtIn, 'en')}, you cannot join. For those states the table shows the cheapest fund you can choose instead:</p>
${h.table(['State without BKK firmus', 'cheapest fund open', 'Additional rate'], ersatz.map((x) => [LAND_NAME[x.l].en, kLink(h, x.k), h.pk(x.k.zb!)]), 'GKV-Spitzenverband list', ['l', 'l', 'r'])}
<h2>Home or workplace: what counts</h2>
<p>Either place is enough. If you live in a state where the fund is not open but work across the border in one where it is, you can join through your workplace; for the self-employed and pensioners it is usually the home address that counts. If you move later, your membership continues even if the fund is not open at your new address, although a new membership would no longer be accepted there. Pick both states in the calculator above to compare the rankings.</p>
<h2>What you pay at BKK firmus</h2>
${h.table(['Situation', 'Base', 'Your share a month'], [
  ['Employee', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employee', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employee at the ceiling', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Pensioner', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed, no sick pay', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, one child; student under 23', ['l', 'r', 'r'])}
<h2>When moving to the cheapest fund pays off</h2>
<p>The gap to the most expensive open fund, ${p.teuerste.kurz} at ${h.pk(p.teuerste.zb!)}, is ${h.num(p.teuerste.zb! - p.zb, 2)} points. On ${h.eur(BEISPIEL.lohn)} gross that is about ${h.eur(Math.round((kostenZeile(p.teuerste).lohn - me.lohn) * 12))} a year for an employee, more at the contribution ceiling. Coming from a fund with a middling rate, you save less; the calculator above shows the amount for your own fund. Deadlines are the usual ones: twelve months’ lock-in, switch to the month after next, immediately if your old fund raises its rate (${h.a('krankenkasse-wechseln', 'work out the dates')}).</p>
<p>A low rate is neither a seal of quality nor a promise for next year. Whether a fund’s service, branches and extra benefits suit you is something to check with the fund itself before switching. The ${h.a('zusatzbeitrag-liste', 'full list')} shows every fund filtered by state.</p>`,
  },
});
