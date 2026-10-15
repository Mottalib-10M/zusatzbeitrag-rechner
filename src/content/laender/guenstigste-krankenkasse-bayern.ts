import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { kasse, KASSEN } from '../../lib/engine/kassen';

/** Bayern: Rangliste der wählbaren Kassen aus der Liste des GKV-Spitzenverbands, Beträge aus dem Motor. */
const p = landProfil('BY');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const nurBy = p.nurHier.filter((k) => k.id !== aok.id);
const bkkFirmus = p.r.find((k) => k.id === 'bkk-firmus');
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const nordost = kasse('aok-nordost-die-gesundheitskasse');
const tk = kasse('techniker-krankenkasse'), barmer = kasse('barmer'), dak = kasse('dak-gesundheit');
const vsTkDe = aok.zb! === tk.zb! ? 'gleichauf mit der Techniker Krankenkasse' : aok.zb! < tk.zb! ? 'noch vor der Techniker Krankenkasse' : `hinter der Techniker Krankenkasse (${DE.pk(tk.zb!)})`;
const vsTkEn = aok.zb! === tk.zb! ? 'level with Techniker Krankenkasse' : aok.zb! < tk.zb! ? 'ahead of Techniker Krankenkasse' : `behind Techniker Krankenkasse (${EN.pk(tk.zb!)})`;
const billigerAlsDe = [barmer, dak].filter((k) => k.zb! > aok.zb!).map((k) => k.kurz).join(' und ');
const billigerAlsEn = [barmer, dak].filter((k) => k.zb! > aok.zb!).map((k) => k.kurz).join(' and ');

export default defineGuide({
  id: 'guenstigste-krankenkasse-bayern',
  group: 'laender',
  order: 20,
  land: 'BY',
  tool: 'beitrag',
  toolPreset: { land: 'BY', kasse: 'aok-bayern-die-gesundheitskasse' },
  related: ['aok-bayern-die-gesundheitskasse', 'guenstigste-krankenkasse-baden-wuerttemberg', 'guenstigste-krankenkasse-hessen', 'zusatzbeitrag-liste', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_242', 'sgb11_55'],
  de: {
    slug: 'guenstigste-krankenkasse-bayern',
    nav: 'Bayern',
    card: `${p.n} Kassen wählbar, ab ${DE.pk(p.billig.zb!)}; die AOK Bayern liegt mit ${DE.pk(aok.zb!)} auf Rang ${p.aokRang}.`,
    title: 'Günstigste Krankenkasse Bayern 2027: alle Kassen in Euro',
    description: `Günstigste Krankenkasse in Bayern 2026/2027: alle wählbaren Kassen von ${DE.pk(p.billig.zb!)} bis ${DE.pk(p.teuer.zb!)} Zusatzbeitrag, Ihr Beitrag in Euro, die AOK Bayern im Vergleich.`,
    h1: 'Günstigste Krankenkasse in Bayern: alle wählbaren Kassen',
    intro: `In Bayern können Sie zwischen ${p.n} Kassen wählen; die AOK Bayern liegt mit ${DE.pk(aok.zb!)} auf Rang ${p.aokRang}.`,
    resume: `Wer in Bayern wohnt oder arbeitet, kann laut Liste des GKV-Spitzenverbands zwischen ${p.n} gesetzlichen Krankenkassen wählen: ${p.bund.length} bundesweit geöffnete und ${p.regional.length}, die ihre Satzung für Bayern und einige andere Länder geöffnet haben. Die Zusatzbeiträge reichen von ${DE.pk(p.billig.zb!)} bei ${p.billig.kurz} bis ${DE.pk(p.teuer.zb!)} bei ${p.teuer.kurz}. Bei ${DE.eur(BEISPIEL.lohn)} brutto im Monat und einem Kind sind das ${DE.eur(p.lohnBillig)} gegenüber ${DE.eur(p.lohnTeuer)} für Kranken- und Pflegeversicherung, also ${DE.eur(p.spanneJahr)} im Jahr Unterschied für Sie, an der Beitragsbemessungsgrenze ${DE.eur(p.spanneJahrBbg)}. Die Ortskrankenkasse ist ${aokPlatz <= 3 ? 'eine der günstigsten AOKs' : 'unter den AOKs im Mittelfeld'}: Unter den ${aoks.length} AOKs hat die AOK Bayern den ${aokPlatz}. niedrigsten Satz. Sie verlangt ${DE.pk(aok.zb!)} und steht auf Rang ${p.aokRang}, ${vsTkDe}. Bayern zahlt den normalen Pflegebeitrag; die sächsische Sonderregel gilt hier nicht.`,
    faqs: [
      { q: 'Welche ist die günstigste Krankenkasse in Bayern?', a: `Nach dem Zusatzbeitrag ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, gefolgt von ${top.slice(1, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie bei ${p.billig.kurz} ${DE.eur(p.lohnBillig)} im Monat. Ob eine Kasse zu Ihnen passt, hängt auch von Service und Zusatzleistungen ab, die der Satz nicht abbildet.` },
      { q: 'Ist die AOK Bayern teurer als die Ersatzkassen?', a: `Nein, beim Preis nicht. Die AOK Bayern verlangt ${DE.pk(aok.zb!)} und liegt damit auf Rang ${p.aokRang} von ${p.n}, ${vsTkDe}${billigerAlsDe ? ` und günstiger als ${billigerAlsDe}` : ''}. Gegenüber der günstigsten wählbaren Kasse zahlen Sie bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(p.aokVsBillig)} im Jahr mehr.` },
      { q: 'Kann ich in Bayern eine Kasse aus einem anderen Land wählen?', a: `Nur wenn sie für Bayern geöffnet ist. Maßgeblich ist Ihr Wohn- oder Ihr Arbeitsort: Wer in Ulm wohnt und in Neu-Ulm arbeitet, kann die AOK Baden-Württemberg oder die AOK Bayern wählen. Eine AOK Hessen steht Ihnen dagegen nur offen, wenn Sie in Hessen wohnen oder arbeiten.` },
      { q: 'Welche Kassen gibt es nur in Bayern?', a: `Neben der AOK Bayern sind ${nurBy.length ? nurBy.map((k) => k.kurz).join(' und ') : 'keine weiteren Kassen'} laut Liste ausschließlich für Bayern geöffnet. Dazu kommen Betriebskrankenkassen großer Arbeitgeber, die nur deren Beschäftigten offenstehen und deshalb nicht in der Rangliste erscheinen; in der vollständigen Liste lassen sie sich einblenden.` },
    ],
    body: (h) => `
<h2>Die fünf günstigsten Kassen für Bayern</h2>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Die AOK Bayern im Vergleich</h2>
<p>Jede AOK ist an ihr Land gebunden und rechnet mit den Versicherten und Ausgaben dieses Landes. In Bayern liegt der Satz der Ortskrankenkasse mit ${h.pk(aok.zb!)} ${aok.zb! < w.zb_durchschnitt ? 'unter' : 'über'} dem amtlichen Durchschnitt von ${h.pz(w.zb_durchschnitt)}, während etwa die AOK Nordost in Berlin, Brandenburg und Mecklenburg-Vorpommern ${h.pk(nordost.zb!)} verlangt. Für AOK-Mitglieder in Bayern beträgt der Abstand zur günstigsten wählbaren Kasse beträgt bei ${h.eur(BEISPIEL.lohn)} brutto ${h.eur(p.aokVsBillig)} im Jahr. Bei einem Ersatzkassenmitglied mit einem Satz über drei Prozent sieht das anders aus; der Rechner oben zeigt den Betrag für Ihr Einkommen.</p>
${bkkFirmus ? `<p>${bkkFirmus.kurz} ist keine bayerische Kasse, hat ihre Satzung aber für Bayern geöffnet und steht deshalb an der Spitze der Rangliste. Ob Sie eine regional geöffnete Kasse wählen können, entscheidet allein die Liste des GKV-Spitzenverbands: Die Kasse darf Sie nicht ablehnen, wenn Sie in einem Land wohnen oder arbeiten, für das sie geöffnet ist (§ 175 Abs. 1 SGB V).</p>` : ''}
<h2>Pflegebeitrag in Bayern</h2>
<p>Die Sonderregel, nach der Beschäftigte einen höheren Anteil der Pflegeversicherung tragen, gilt nur in Sachsen, dem einzigen Land, das 1995 zur Einführung der Pflegeversicherung keinen Feiertag gestrichen hat (§ 58 Abs. 3 SGB XI). In Bayern teilen sich Beschäftigte und Arbeitgeber die ${h.pz(w.pv_satz)} hälftig; Kinderlose ab 23 zahlen ${h.pz(w.pv_kinderlos)} zusätzlich, Eltern ab dem zweiten Kind unter 25 je ${h.pz(w.pv_abschlag_kind)} weniger.</p>
<h2>So wechseln Sie in Bayern</h2>
<p>Der Wechsel läuft überall gleich: Antrag bei der neuen Kasse, die alte wird benachrichtigt, neue Mitgliedschaft ab dem übernächsten Monatsersten (${h.a('krankenkasse-wechseln', 'Fristen rechnen')}). Wer an der Landesgrenze wohnt oder arbeitet, etwa im Allgäu oder am Untermain, sollte beide Länder im Rechner ausprobieren: ${h.a('guenstigste-krankenkasse-baden-wuerttemberg', 'Baden-Württemberg')} und ${h.a('guenstigste-krankenkasse-hessen', 'Hessen')} haben eigene AOKs und andere regionale Betriebskrankenkassen.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-bavaria',
    nav: 'Bavaria',
    card: `${p.n} funds open, from ${EN.pk(p.billig.zb!)}; AOK Bayern ranks ${p.aokRang} at ${EN.pk(aok.zb!)}.`,
    title: 'Cheapest Health Insurance Bavaria 2027: Every Fund in Euros',
    description: `Cheapest statutory health fund in Bavaria for 2026/2027: every fund open to you from ${EN.pk(p.billig.zb!)} to ${EN.pk(p.teuer.zb!)} additional rate, your cost in euros, the AOK compared.`,
    h1: 'Cheapest health insurance in Bavaria: every fund you can join',
    intro: `In Bavaria you can choose from ${p.n} funds; AOK Bayern, at ${EN.pk(aok.zb!)}, ranks ${p.aokRang}.`,
    resume: `If you live or work in Bavaria (Bayern), the GKV-Spitzenverband list gives you ${p.n} statutory health funds to choose from: ${p.bund.length} open nationwide and ${p.regional.length} that have opened their statutes to Bavaria and some other states. Additional rates run from ${EN.pk(p.billig.zb!)} at ${p.billig.kurz} to ${EN.pk(p.teuer.zb!)} at ${p.teuer.kurz}. On ${EN.eur(BEISPIEL.lohn)} gross a month with one child, that means ${EN.eur(p.lohnBillig)} against ${EN.eur(p.lohnTeuer)} for health and care insurance, a gap of ${EN.eur(p.spanneJahr)} a year in your share and ${EN.eur(p.spanneJahrBbg)} at the contribution ceiling. The regional AOK ${aokPlatz <= 3 ? 'is one of the cheapest AOKs' : 'sits mid-table among the AOKs'}: of the ${aoks.length} AOKs, AOK Bayern has the ${['', 'lowest', 'second-lowest', 'third-lowest'][aokPlatz] ?? `${aokPlatz}th-lowest`} rate. It charges ${EN.pk(aok.zb!)} and ranks ${p.aokRang}, ${vsTkEn}. Bavaria pays the standard care contribution split; the special Saxon rule does not apply.`,
    faqs: [
      { q: 'Which is the cheapest health fund in Bavaria?', a: `By additional rate, ${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, followed by ${top.slice(1, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohnBillig)} a month at ${p.billig.kurz}. Whether a fund suits you also depends on service and extra benefits, which the rate does not show.` },
      { q: 'Is AOK Bayern more expensive than the substitute funds?', a: `Not on price. AOK Bayern charges ${EN.pk(aok.zb!)}, ranking ${p.aokRang} of ${p.n}, ${vsTkEn}${billigerAlsEn ? ` and cheaper than ${billigerAlsEn}` : ''}. Rates say nothing about service or extra benefits, which you should check in the fund’s statutes. Compared with the cheapest fund open in Bavaria you pay ${EN.eur(p.aokVsBillig)} a year more on ${EN.eur(BEISPIEL.lohn)} gross.` },
      { q: 'Can I join a fund from another state while living in Bavaria?', a: `Only if it is open to Bavaria. Your home or your workplace counts: someone living in Ulm and working in Neu-Ulm can choose AOK Baden-Württemberg or AOK Bayern. AOK Hessen, by contrast, is only open to you if you live or work in Hesse.` },
      { q: 'Which funds are open only in Bavaria?', a: `Besides AOK Bayern, ${nurBy.length ? nurBy.map((k) => k.kurz).join(' and ') : 'no other funds'} are listed as open to Bavaria only. There are also company funds of large Bavarian employers that are open only to their staff and so do not appear in the ranking.` },
    ],
    body: (h) => `
<h2>The five cheapest funds for Bavaria</h2>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>How AOK Bayern compares</h2>
<p>Each AOK is tied to its state and works with that state’s members and costs. In Bavaria the regional fund’s rate of ${h.pk(aok.zb!)} sits ${aok.zb! < w.zb_durchschnitt ? 'below' : 'above'} the official average of ${h.pz(w.zb_durchschnitt)}, while AOK Nordost, for instance, charges ${h.pk(nordost.zb!)} in Berlin, Brandenburg and Mecklenburg-Western Pomerania. For AOK members in Bavaria the gap to the cheapest fund open to you is ${h.eur(p.aokVsBillig)} a year on ${h.eur(BEISPIEL.lohn)} gross. A substitute fund member paying over three percent is in a different position; the calculator above shows the amount for your income.</p>
${bkkFirmus ? `<p>${bkkFirmus.kurz} is not a Bavarian fund, but it has opened its statutes to Bavaria and so tops the ranking. Whether you can join a regionally open fund depends only on the GKV-Spitzenverband list: the fund may not turn you down if you live or work in a state it is open to (section 175(1) SGB V).</p>` : ''}
<h2>Care contributions in Bavaria</h2>
<p>The rule that makes employees carry a larger share of long-term care insurance applies only in Saxony, the one state that kept all its public holidays when care insurance began in 1995 (section 58(3) SGB XI). In Bavaria employees and employers split the ${h.pz(w.pv_satz)} equally; childless members aged 23 and over pay ${h.pz(w.pv_kinderlos)} more, and parents pay ${h.pz(w.pv_abschlag_kind)} less for each child under 25 from the second child on.</p>
<h2>Switching in Bavaria</h2>
<p>Switching works the same everywhere: apply to the new fund, which informs the old one, and membership starts on the first day of the month after next (${h.a('krankenkasse-wechseln', 'work out the dates')}). If you live or work near a state border, try both states in the calculator: ${h.a('guenstigste-krankenkasse-baden-wuerttemberg', 'Baden-Württemberg')} and ${h.a('guenstigste-krankenkasse-hessen', 'Hesse')} have their own AOKs and different regional company funds.</p>`,
  },
});
