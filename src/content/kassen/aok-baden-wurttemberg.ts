import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, landProfil, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { KASSEN } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** AOK Baden-Württemberg: Kasse eines Landes; Vergleich mit den Kassen, die nur oder vor allem im Südwesten geöffnet sind. */
const ID = 'aok-baden-wurttemberg';
const p = profil(ID);
const w = J(2026);
const bw = landProfil('BW');
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < p.zb).length + 1;
const gleichAok = aoks.filter((k) => k.zb === p.zb && k.id !== ID);
// Kassen, die laut Liste ausschließlich in Baden-Württemberg wählbar sind (ohne die AOK selbst).
const nurBw = bw.nurHier.filter((k) => k.id !== ID);
const regionalBw = bw.regional.filter((k) => k.id !== ID).map(kostenZeile).sort((a, b) => a.k.zb! - b.k.zb!).slice(0, 5);
const rangBw = p.raengeLand.find((r) => r.l === 'BW')!;
const d = (x: { lohn: number }) => Math.round((x.lohn - p.lohn) * 12);
const ordEn = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 14,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID, land: 'BW' },
  related: ['guenstigste-krankenkasse-baden-wuerttemberg', 'aok-bayern-die-gesundheitskasse', 'bkk-firmus', 'zusatzbeitrag-liste'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_175', 'sgb5_249'],
  de: {
    slug: 'aok-baden-wuerttemberg-zusatzbeitrag',
    nav: 'AOK Baden-Württemberg',
    card: `${DE.pk(p.zb)} Zusatzbeitrag; Rang ${rangBw.rang} von ${rangBw.n} Kassen im Land, ${DE.eur(p.lohn)} im Monat bei ${DE.eur(BEISPIEL.lohn)} brutto.`,
    title: 'AOK Baden-Württemberg Zusatzbeitrag 2027: Beitrag in Euro',
    description: `AOK Baden-Württemberg, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Monatsbeitrag für Beschäftigte und Rentner, Vergleich mit den regionalen Betriebskrankenkassen im Südwesten.`,
    h1: 'AOK Baden-Württemberg: Zusatzbeitrag und Monatsbeitrag',
    intro: `Die AOK Baden-Württemberg nimmt ${DE.pk(p.zb)}; im Land stehen ${rangBw.rang - 1} wählbare Kassen günstiger da.`,
    resume: `Im Südwesten ist die AOK Baden-Württemberg die Ortskrankenkasse; die Kassenliste des GKV-Spitzenverbands führt sie mit einem Zusatzbeitrag von ${DE.pk(p.zb)} und einer Öffnung nur für Baden-Württemberg. Wählen kann sie, wer zwischen Mannheim und Bodensee wohnt oder arbeitet. Beschäftigte zahlen die Hälfte von ${DE.pz(w.kv_allgemein + p.zb)} ihres Bruttos für die Krankenversicherung; bei ${DE.eur(BEISPIEL.lohn)} und einem Kind ergibt das mit der Pflege ${DE.eur(p.lohn)} im Monat. Von den ${aoks.length} AOKs haben ${aokPlatz - 1} einen niedrigeren Satz${gleichAok.length ? `, ${gleichAok.map((k) => k.kurz).join(' und ')} denselben` : ''}. Im eigenen Land konkurriert die Kasse mit ${bw.n - 1} anderen wählbaren Kassen, darunter auffällig viele regionale Betriebskrankenkassen, die aus Unternehmen des Landes hervorgegangen sind und heute jedem offenstehen. ${p.billigste.kurz}, die günstigste von ihnen, ist bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(p.proJahrVsBilligste)} im Jahr billiger. Ob sich das lohnt, entscheidet jeder selbst; der Rechner zeigt den Betrag für das eigene Einkommen.`,
    faqs: [
      { q: 'Wie weit liegt die AOK Baden-Württemberg über dem Durchschnittssatz?', a: `Der amtliche durchschnittliche Zusatzbeitrag liegt 2026 bei ${DE.pz(w.zb_durchschnitt)}, die AOK Baden-Württemberg verlangt ${DE.pk(p.zb)}. Das sind ${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte ${p.unterDurchschnitt ? 'weniger' : 'mehr'}, bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} im Jahr für Sie. Der Durchschnittssatz ist eine Rechengröße des Ministeriums, kein Satz, den eine Kasse erheben muss.` },
      { q: 'Kann ich in der Pfalz wohnen und Mitglied der AOK Baden-Württemberg sein?', a: `Ja, wenn Sie in Baden-Württemberg arbeiten, etwa in Mannheim oder Karlsruhe. Die Wahl richtet sich nach Wohn- oder Beschäftigungsort. Ohne Arbeitsplatz im Land, zum Beispiel nach dem Ruhestand, können Sie nicht neu eintreten; eine bestehende Mitgliedschaft läuft aber weiter, bis Sie selbst wechseln.` },
      { q: 'Welche Kassen außer der AOK sind nur im Südwesten wählbar?', a: `Laut Liste sind außer der AOK ${nurBw.length ? nurBw.map((k) => `${k.kurz} (${DE.pk(k.zb!)})`).join(' und ') : 'keine weiteren Kassen'} ausschließlich für Baden-Württemberg geöffnet. Daneben gibt es Betriebskrankenkassen großer Arbeitgeber des Landes, die nur ihren Beschäftigten offenstehen und deshalb in keiner öffentlichen Rangliste erscheinen. Wer dort arbeitet, sollte deren Satz mit prüfen.` },
      { q: 'Was kostet die AOK Baden-Württemberg Selbstständige?', a: `Ohne Krankengeld gilt der ermäßigte Satz von ${DE.pz(w.kv_ermaessigt)} plus ${DE.pk(p.zb)} Zusatzbeitrag, dazu die volle Pflege. Bei ${DE.eur(BEISPIEL.gewinn)} Gewinn im Monat sind das ${DE.eur(p.selbst)}. Bei sehr niedrigem Gewinn rechnet die Kasse mindestens mit ${DE.eur(w.mindestFreiwillig, 2)} im Monat.` },
    ],
    body: (h) => `
<h2>Südwesten mit vielen Alternativen</h2>
<p>Wer in Baden-Württemberg versichert ist, hat ungewöhnlich viele regionale Möglichkeiten: Neben den bundesweiten Ersatz-, Innungs- und Betriebskrankenkassen sind ${bw.regional.length} Kassen nur für dieses und einige weitere Länder geöffnet. Viele tragen den Namen eines Unternehmens oder einer Region im Land, sind aber für alle Versicherungspflichtigen wählbar. Die Ortskrankenkasse steht mit ${h.pk(p.zb)} auf Rang ${rangBw.rang}; die folgende Tabelle stellt sie den günstigsten regional geöffneten Kassen gegenüber.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber AOK im Jahr'], [kostenZeile(p.k), ...regionalBw].sort((a, b) => a.k.zb! - b.k.zb!).map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `Regional geöffnete Kassen in Baden-Württemberg, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind`, ['l', 'r', 'r', 'r'])}
<h2>Was Mitglieder der AOK Baden-Württemberg zahlen</h2>
${h.table(['Mitglied', 'Grundlage', 'Eigener Anteil im Monat'], [
  ['Arbeitnehmer', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Arbeitnehmer', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Arbeitnehmer über der Grenze', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Rentnerin', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, ein Kind; Selbstständig ohne Krankengeld', ['l', 'r', 'r'])}
<p>Die Tabelle zeigt, warum ein Wechsel für Rentner weniger bringt als für Angestellte mit hohem Lohn: Bei der Rente zahlt die Rentenversicherung die Hälfte des Zusatzbeitrags, und die Grundlage ist meist kleiner. Selbstständige dagegen tragen den Satz ganz. Eine Übersicht aller in Baden-Württemberg wählbaren Kassen bietet die Seite ${h.a('guenstigste-krankenkasse-baden-wuerttemberg', 'günstigste Krankenkasse in Baden-Württemberg')}; die bundesweit niedrigsten Sätze stehen in der ${h.a('zusatzbeitrag-liste', 'Gesamtliste')}.</p>
<h2>Mitgliedschaft und Wechsel</h2>
<p>Ein Wechsel aus der AOK Baden-Württemberg heraus geht über den Antrag bei der neuen Kasse und wird zum übernächsten Monatsende wirksam. Wer aus einer anderen Kasse zur AOK kommt, braucht einen Wohnsitz oder Arbeitsplatz im Land, gleich in welchem Landkreis. Beschäftigte melden die neue Kasse dem Arbeitgeber, damit er die Beiträge richtig abführt. Rentner müssen nichts tun: Die neue Kasse informiert die Rentenversicherung, die den Beitrag künftig an sie weiterleitet. Wer familienversicherte Angehörige hat, nimmt sie mit; ihre Versicherung hängt am Mitglied und beginnt bei der neuen Kasse am selben Tag. Und noch ein Hinweis zur Pflege: In Baden-Württemberg gilt die normale hälftige Teilung zwischen Beschäftigten und Arbeitgebern, wie in allen Ländern außer Sachsen.</p>`,
  },
  en: {
    slug: 'aok-baden-wuerttemberg-additional-contribution',
    nav: 'AOK Baden-Württemberg',
    card: `${EN.pk(p.zb)} additional rate; rank ${rangBw.rang} of ${rangBw.n} funds in the state, ${EN.eur(p.lohn)} a month on ${EN.eur(BEISPIEL.lohn)} gross.`,
    title: 'AOK Baden-Württemberg Additional Contribution 2027: Cost',
    description: `AOK Baden-Württemberg additional rate in 2026: ${EN.pk(p.zb)}. Monthly cost for employees and pensioners, compared with the regional company funds of the south-west.`,
    h1: 'AOK Baden-Württemberg: additional rate and monthly cost',
    intro: `AOK Baden-Württemberg charges ${EN.pk(p.zb)}; ${rangBw.rang - 1} funds open in the state are cheaper.`,
    resume: `In the south-west, AOK Baden-Württemberg is the regional health fund (Allgemeine Ortskrankenkasse); the GKV-Spitzenverband list shows an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)} and an opening for Baden-Württemberg only. Anyone living or working between Mannheim and Lake Constance can join. Employees pay half of ${EN.pz(w.kv_allgemein + p.zb)} of gross pay for health insurance; on ${EN.eur(BEISPIEL.lohn)} with one child that comes to ${EN.eur(p.lohn)} a month including care insurance. Of the ${aoks.length} AOKs, ${aokPlatz - 1} have a lower rate${gleichAok.length ? ` and ${gleichAok.map((k) => k.kurz).join(' and ')} the same` : ''}. In its own state it competes with ${bw.n - 1} other funds open to anyone, including an unusual number of regional company funds that grew out of local firms and now accept everybody. The cheapest, ${p.billigste.kurz}, is ${EN.eur(p.proJahrVsBilligste)} a year cheaper at ${EN.eur(BEISPIEL.lohn)} gross. Whether that is worth a switch is your call; the calculator shows the amount for your own income.`,
    faqs: [
      { q: 'How far is AOK Baden-Württemberg from the average rate?', a: `The official average additional rate for 2026 is ${EN.pz(w.zb_durchschnitt)}; AOK Baden-Württemberg charges ${EN.pk(p.zb)}. That is ${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points ${p.unterDurchschnitt ? 'less' : 'more'}, or ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} a year for you on ${EN.eur(BEISPIEL.lohn)} gross. The average is a ministry benchmark, not a rate any fund has to charge.` },
      { q: 'Can I live in the Palatinate and belong to AOK Baden-Württemberg?', a: `Yes, if you work in Baden-Württemberg, for example in Mannheim or Karlsruhe. The choice depends on where you live or where you are employed. Without a job in the state, after retirement for instance, you cannot newly join, but an existing membership continues until you switch yourself.` },
      { q: 'Apart from the AOK, which funds can only be joined in the south-west?', a: `According to the list, besides the AOK ${nurBw.length ? nurBw.map((k) => `${k.kurz} (${EN.pk(k.zb!)})`).join(' and ') : 'no other funds'} are open to Baden-Württemberg only. There are also company funds of large employers in the state that accept only their own staff, so they never appear in a public ranking.` },
      { q: 'What does AOK Baden-Württemberg cost the self-employed?', a: `Without sick pay the reduced rate of ${EN.pz(w.kv_ermaessigt)} applies, plus the ${EN.pk(p.zb)} additional rate and full care insurance. On ${EN.eur(BEISPIEL.gewinn)} monthly profit that is ${EN.eur(p.selbst)}. With very low profits the fund assumes at least ${EN.eur(w.mindestFreiwillig, 2)} a month, the statutory minimum.` },
    ],
    body: (h) => `
<h2>The south-west and its many alternatives</h2>
<p>If you are insured in Baden-Württemberg you have an unusual number of regional options: besides the nationwide substitute, guild and company funds, ${bw.regional.length} funds are open only to this and a few other states. Many carry the name of a firm or district in the state but accept everyone subject to compulsory insurance. The regional AOK ranks ${rangBw.rang} at ${h.pk(p.zb)}; the table sets it against the cheapest regionally open funds.</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'vs AOK a year'], [kostenZeile(p.k), ...regionalBw].sort((a, b) => a.k.zb! - b.k.zb!).map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `Regionally open funds in Baden-Württemberg, ${h.eur(BEISPIEL.lohn)} gross, one child`, ['l', 'r', 'r', 'r'])}
<h2>What AOK Baden-Württemberg members pay</h2>
${h.table(['Member', 'Base', 'Own share a month'], [
  ['Employee', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employee', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employee above the ceiling', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Pensioner', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, one child; self-employed without sick pay', ['l', 'r', 'r'])}
<p>The table shows why switching brings pensioners less than well-paid employees: on a pension the pension insurance pays half of the additional rate, and the base is usually smaller. The self-employed, by contrast, carry the whole rate. Every fund open in Baden-Württemberg is on the page ${h.a('guenstigste-krankenkasse-baden-wuerttemberg', 'cheapest health insurance in Baden-Württemberg')}; the lowest rates nationwide are in the ${h.a('zusatzbeitrag-liste', 'full list')}.</p>
<h2>Membership and switching</h2>
<p>Leaving AOK Baden-Württemberg takes an application to the new fund and is effective at the end of the month after next. Joining the AOK from another fund requires a home or job in the state. Employees tell their employer the new fund so contributions go to the right place. Pensioners need do nothing: the new fund informs the pension insurance, which then passes contributions on to it. Family members covered free of charge come along; their cover depends on the member and starts at the new fund on the same day. And on care insurance: Baden-Württemberg uses the normal equal split between employees and employers, as every state except Saxony does.</p>`,
  },
});
