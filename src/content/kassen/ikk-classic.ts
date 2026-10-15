import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { KASSEN } from '../../lib/engine/kassen';
import { selbststaendig } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** IKK classic: Innungskrankenkasse, bundesweit geöffnet; Vergleich mit den übrigen IKKs, Fokus Handwerk und Selbstständige. */
const ID = 'ikk-classic';
const p = profil(ID);
const w = J(2026);
const me = kostenZeile(p.k);
const ikks = KASSEN.filter((k) => k.kassenart === 'IKK' && k.zb !== null).map(kostenZeile).sort((a, b) => a.k.zb! - b.k.zb!);
const ikkRang = ikks.findIndex((x) => x.k.id === ID) + 1;
const guenstigereIkk = ikks.filter((x) => x.k.zb! < p.zb);
const j = (x: { lohn: number }) => Math.round((x.lohn - me.lohn) * 12);
const meisterKg = selbststaendig({ einkommen: BEISPIEL.gewinn, zb: p.zb, jahr: 2026, krankengeld: true, eltern: 'k1' }).selbst;
const meisterHoch = selbststaendig({ einkommen: w.bbgKv, zb: p.zb, jahr: 2026, krankengeld: true, eltern: 'k1' }).selbst;
const meisterHochBillig = selbststaendig({ einkommen: w.bbgKv, zb: p.billigste.zb!, jahr: 2026, krankengeld: true, eltern: 'k1' }).selbst;
const meisterSpar = Math.round((meisterHoch - meisterHochBillig) * 12);
const minSelbst = selbststaendig({ einkommen: 0, zb: p.zb, jahr: 2026, krankengeld: false, eltern: 'k1' }).selbst;

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 21,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID, status: 'selbststaendig' },
  related: ['krankenkassenbeitrag-selbststaendige', 'freiwillig-versichert', 'zusatzbeitrag-liste', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_240', 'sgb5_243', 'sgb5_242'],
  de: {
    slug: 'ikk-classic-zusatzbeitrag',
    nav: 'IKK classic',
    card: `${DE.pk(p.zb)} Zusatzbeitrag; Selbstständige mit ${DE.eur(BEISPIEL.gewinn)} Gewinn und Krankengeld zahlen ${DE.eur(meisterKg)} im Monat.`,
    title: 'IKK classic Zusatzbeitrag 2027: Beitrag für Handwerk & Co.',
    description: `IKK classic, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Monatsbeitrag für Beschäftigte und selbstständige Handwerker, mit und ohne Krankengeld, im Vergleich zu anderen IKKs.`,
    h1: 'IKK classic: Zusatzbeitrag für Beschäftigte und Handwerksmeister',
    intro: `Die IKK classic verlangt ${DE.pk(p.zb)}; ein selbstständiger Handwerker mit ${DE.eur(BEISPIEL.gewinn)} Gewinn zahlt mit Krankengeld ${DE.eur(meisterKg)} im Monat.`,
    resume: `Die IKK classic ist eine Innungskrankenkasse, also eine Kasse, die aus den Krankenkassen der Handwerksinnungen hervorgegangen ist; heute ist sie laut Liste des GKV-Spitzenverbands bundesweit für alle geöffnet. Ihr Zusatzbeitrag liegt bei ${DE.pk(p.zb)}, ${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte ${p.unterDurchschnitt ? 'unter' : 'über'} dem amtlichen Durchschnitt von ${DE.pz(w.zb_durchschnitt)}. Unter den ${ikks.length} Innungskrankenkassen der Liste steht sie auf Platz ${ikkRang} nach Preis, unter allen ${p.nBund} frei wählbaren Kassen auf Rang ${p.rangBund}. Für einen Gesellen mit ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind heißt das ${DE.eur(p.lohn)} im Monat Eigenanteil. Härter trifft der Satz Selbstständige: Sie zahlen Zusatzbeitrag und Pflege allein, bei ${DE.eur(BEISPIEL.gewinn)} Gewinn mit gesetzlichem Krankengeld ${DE.eur(meisterKg)}, ohne Krankengeld ${DE.eur(p.selbst)} im Monat. Wer mit einem Gewinn an der Bemessungsgrenze zur günstigsten frei wählbaren Kasse wechselt, spart ${DE.eur(meisterSpar)} im Jahr. Leistungen und Service für Betriebe misst diese Zahl nicht. Der Rechner oben ist auf Selbstständige voreingestellt und lässt sich auf Beschäftigte, Rentner oder Studierende umstellen.`,
    faqs: [
      { q: 'Muss ich im Handwerk arbeiten, um in die IKK classic zu kommen?', a: `Nein. Innungskrankenkassen waren ursprünglich für die Beschäftigten von Innungsbetrieben gedacht, die IKK classic ist heute aber laut Liste bundesweit für jeden Versicherungspflichtigen und freiwillig Versicherten geöffnet. Ob Sie im Büro, in der Pflege oder auf der Baustelle arbeiten, spielt für die Aufnahme keine Rolle.` },
      { q: 'Was zahlt ein selbstständiger Handwerksmeister bei der IKK classic mindestens?', a: `Auch bei geringem oder keinem Gewinn rechnet die Kasse mit mindestens ${DE.eur(w.mindestFreiwillig, 2)} im Monat (§ 240 Abs. 4 SGB V). Ohne Krankengeld ergibt das ${DE.eur(minSelbst)} für Kranken- und Pflegeversicherung zusammen. Der tatsächliche Beitrag richtet sich nach dem letzten Einkommensteuerbescheid und wird nachträglich angepasst.` },
      { q: 'Welche Innungskrankenkasse ist am günstigsten?', a: `Unter den IKKs der Liste hat ${ikks[0].k.kurz} mit ${DE.pk(ikks[0].k.zb!)} den niedrigsten Satz${ikks[0].k.art === 'regional' ? ', ist aber nur regional geöffnet' : ''}. ${guenstigereIkk.length ? `Günstiger als die IKK classic sind ${guenstigereIkk.map((x) => x.k.kurz).join(' und ')}.` : 'Die IKK classic ist die günstigste.'} Bei ${DE.eur(BEISPIEL.lohn)} brutto beträgt der Abstand zur günstigsten IKK ${DE.eur(Math.abs(j(ikks[0])))} im Jahr; für Selbstständige ist er doppelt so groß.` },
      { q: 'Lohnt sich Krankengeld für Selbstständige bei der IKK classic?', a: `Mit Wahlerklärung zahlen Sie den allgemeinen Satz von ${DE.pz(w.kv_allgemein)} statt ${DE.pz(w.kv_ermaessigt)} und bekommen ab der siebten Krankheitswoche Krankengeld. Bei ${DE.eur(BEISPIEL.gewinn)} Gewinn kostet das ${DE.eur(meisterKg - p.selbst)} im Monat mehr. Ob es sich lohnt, hängt von Ihren Rücklagen und einer privaten Absicherung ab.` },
    ],
    body: (h) => `
<h2>Vom Innungsbetrieb zur offenen Kasse</h2>
<p>Innungskrankenkassen bilden eine eigene Kassenart neben AOK, Betriebs- und Ersatzkassen. Ihr Ursprung liegt bei den Handwerksinnungen, doch die Bindung an einen Betrieb ist für die großen IKKs längst Geschichte: Die IKK classic nimmt jeden auf, gleich in welchem Land er wohnt. Wer als Angestellter in einem Handwerksbetrieb arbeitet, kann deshalb frei zwischen allen geöffneten Kassen wählen, und der Betrieb hat darauf keinen Einfluss. Im Preis unterscheiden sich die Innungskrankenkassen untereinander deutlich, wie die Tabelle für einen Beschäftigten mit ${h.eur(BEISPIEL.lohn)} brutto zeigt.</p>
${h.table(['Innungskrankenkasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber IKK classic im Jahr'], ikks.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), 'Alle IKKs der Liste, ein Kind, 2026', ['l', 'r', 'r', 'r'])}
<h2>Beitrag für Selbstständige und Beschäftigte</h2>
${h.table(['Mitglied', 'Grundlage', 'Eigener Beitrag im Monat'], [
  ['Selbstständig, Mindestbemessung, ohne Krankengeld', h.eur(w.mindestFreiwillig, 2), h.eur(minSelbst)],
  ['Selbstständig, ohne Krankengeld', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Selbstständig, mit Krankengeld', h.eur(BEISPIEL.gewinn), h.eur(meisterKg)],
  ['Selbstständig an der Grenze, mit Krankengeld', h.eur(w.bbgKv, 2), h.eur(meisterHoch)],
  ['Beschäftigt', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
], '2026, Pflege mit einem Kind', ['l', 'r', 'r'])}
<p>Für Selbstständige wirkt jeder Zehntelpunkt Zusatzbeitrag doppelt so stark wie für Angestellte, weil kein Arbeitgeber die Hälfte trägt. An der Bemessungsgrenze von ${h.eur(w.bbgKv, 2)} macht der Unterschied zwischen der IKK classic und ${p.billigste.kurz} mit Krankengeld ${h.eur(meisterSpar)} im Jahr aus. Wie die Beitragsbemessung bei schwankendem Gewinn funktioniert, steht unter ${h.a('krankenkassenbeitrag-selbststaendige', 'Krankenkassenbeitrag für Selbstständige')} und ${h.a('freiwillig-versichert', 'freiwillig versichert')}.</p>
<h2>Wechseln, ohne den Betrieb zu fragen</h2>
<p>Beschäftigte wählen ihre Kasse selbst; der Arbeitgeber muss jede Wahl akzeptieren und führt die Beiträge an die neue Kasse ab. Selbstständige stellen den Antrag direkt und legen den letzten Steuerbescheid vor, damit die neue Kasse den Beitrag festsetzen kann. Die neue Mitgliedschaft beginnt am Ersten des dritten Monats nach dem Antrag, nach mindestens zwölf Monaten Mitgliedschaft oder sofort nach einer Erhöhung (${h.a('krankenkasse-wechseln', 'Fristen')}). Wer einen Krankengeld-Wahltarif abgeschlossen hat, ist an diesen gebunden; das Sonderkündigungsrecht gilt dann nicht.</p>`,
  },
  en: {
    slug: 'ikk-classic-additional-contribution',
    nav: 'IKK classic',
    card: `${EN.pk(p.zb)} additional rate; self-employed members on ${EN.eur(BEISPIEL.gewinn)} profit with sick pay pay ${EN.eur(meisterKg)} a month.`,
    title: 'IKK classic Additional Contribution 2027: Trades and More',
    description: `IKK classic additional rate in 2026: ${EN.pk(p.zb)}. Monthly cost for employees and self-employed tradespeople, with and without sick pay, compared with the other IKKs.`,
    h1: 'IKK classic: additional rate for employees and master craftsmen',
    intro: `IKK classic charges ${EN.pk(p.zb)}; a self-employed tradesperson on ${EN.eur(BEISPIEL.gewinn)} profit pays ${EN.eur(meisterKg)} a month with sick pay.`,
    resume: `IKK classic is a guild health fund (Innungskrankenkasse), one that grew out of the health funds of the craft guilds; today the GKV-Spitzenverband list shows it open nationwide to everyone. Its additional contribution (Zusatzbeitrag) is ${EN.pk(p.zb)}, ${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points ${p.unterDurchschnitt ? 'below' : 'above'} the official average of ${EN.pz(w.zb_durchschnitt)}. Of the ${ikks.length} guild funds in the list it is number ${ikkRang} on price, and it ranks ${p.rangBund} of all ${p.nBund} open funds. For a journeyman on ${EN.eur(BEISPIEL.lohn)} gross with one child that means ${EN.eur(p.lohn)} a month out of pay. The rate hits the self-employed harder: they pay the additional rate and care insurance alone, ${EN.eur(meisterKg)} a month on ${EN.eur(BEISPIEL.gewinn)} profit with statutory sick pay and ${EN.eur(p.selbst)} without it. Someone with profit at the contribution ceiling who moves to the cheapest fund open to all saves ${EN.eur(meisterSpar)} a year. That figure does not measure benefits or service for businesses. The calculator above starts in self-employed mode and switches to employees, pensioners or students.`,
    faqs: [
      { q: 'Do I have to work in a trade to join IKK classic?', a: `No. Guild funds were originally meant for staff of guild businesses, but IKK classic is now listed as open nationwide to everyone in compulsory or voluntary statutory insurance. Whether you work in an office, in care or on a building site makes no difference to being accepted.` },
      { q: 'What is the minimum a self-employed master craftsman pays at IKK classic?', a: `Even with little or no profit, the fund assumes at least ${EN.eur(w.mindestFreiwillig, 2)} a month (section 240(4) SGB V). Without sick pay that gives ${EN.eur(minSelbst)} for health and care insurance together. The actual contribution follows your latest income tax assessment and is adjusted afterwards.` },
      { q: 'Which guild fund is cheapest?', a: `Among the IKKs in the list, ${ikks[0].k.kurz} has the lowest rate at ${EN.pk(ikks[0].k.zb!)}${ikks[0].k.art === 'regional' ? ', but it is open only regionally' : ''}. ${guenstigereIkk.length ? `Cheaper than IKK classic are ${guenstigereIkk.map((x) => x.k.kurz).join(' and ')}.` : 'IKK classic is the cheapest.'} On ${EN.eur(BEISPIEL.lohn)} gross the gap to the cheapest IKK is ${EN.eur(Math.abs(j(ikks[0])))} a year; for the self-employed it is twice that.` },
      { q: 'Is sick pay worth it for the self-employed at IKK classic?', a: `By opting in you pay the general rate of ${EN.pz(w.kv_allgemein)} instead of ${EN.pz(w.kv_ermaessigt)} and receive sick pay from the seventh week of illness. On ${EN.eur(BEISPIEL.gewinn)} profit that costs ${EN.eur(meisterKg - p.selbst)} a month more. Whether it pays depends on your savings and any private cover.` },
    ],
    body: (h) => `
<h2>From guild business to open fund</h2>
<p>Guild funds are a type of fund of their own, alongside the AOKs, company funds and substitute funds. They began with the craft guilds, but for the big IKKs the tie to a business is long gone: IKK classic accepts anyone, in whichever state they live. An employee in a craft business can therefore choose freely among all open funds, and the business has no say. The guild funds differ clearly on price among themselves, as the table shows for an employee on ${h.eur(BEISPIEL.lohn)} gross.</p>
${h.table(['Guild fund', 'Additional rate', 'You pay a month', 'vs IKK classic a year'], ikks.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), 'Every IKK in the list, one child, 2026', ['l', 'r', 'r', 'r'])}
<h2>Contributions for the self-employed and employees</h2>
${h.table(['Member', 'Base', 'Own contribution a month'], [
  ['Self-employed, minimum base, no sick pay', h.eur(w.mindestFreiwillig, 2), h.eur(minSelbst)],
  ['Self-employed, no sick pay', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Self-employed, with sick pay', h.eur(BEISPIEL.gewinn), h.eur(meisterKg)],
  ['Self-employed at the ceiling, with sick pay', h.eur(w.bbgKv, 2), h.eur(meisterHoch)],
  ['Employee', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Pensioner', h.eur(BEISPIEL.rente), h.eur(p.rente)],
], '2026, care insurance with one child', ['l', 'r', 'r'])}
<p>For the self-employed every tenth of a point of additional rate weighs twice as much as for employees, because no employer pays half. At the ceiling of ${h.eur(w.bbgKv, 2)} the difference between IKK classic and ${p.billigste.kurz} with sick pay comes to ${h.eur(meisterSpar)} a year. How contributions are assessed when profits fluctuate is explained under ${h.a('krankenkassenbeitrag-selbststaendige', 'health insurance for the self-employed')} and ${h.a('freiwillig-versichert', 'voluntary membership')}.</p>
<h2>Switching without asking the business</h2>
<p>Employees choose their fund themselves; the employer must accept any choice and pays contributions to the new fund. The self-employed apply directly and enclose their latest tax assessment so the new fund can set the contribution. The new membership starts on the first day of the third month after the application, after at least twelve months of membership or straight after a rate rise (${h.a('krankenkasse-wechseln', 'deadlines')}). Anyone who has taken out an optional sick-pay tariff is bound by it; the special termination right does not apply then.</p>`,
  },
});
