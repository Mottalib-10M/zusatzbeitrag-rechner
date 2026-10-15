import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN, kasse } from '../../lib/engine/kassen';
import { selbststaendig } from '../../lib/engine/beitrag';

/** Niedersachsen: Rangliste aus der Liste des GKV-Spitzenverbands; AOK Niedersachsen, Landwirtschaft (SVLFG), Grenzlagen. */
const p = landProfil('NI');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const tk = kasse('techniker-krankenkasse');
const svlfg = KASSEN.find((k) => k.art === 'branche');
const selbstAok = selbststaendig({ einkommen: BEISPIEL.gewinn, zb: aok.zb!, jahr: 2026, krankengeld: false, eltern: 'k1' }).selbst;
const selbstBillig = selbststaendig({ einkommen: BEISPIEL.gewinn, zb: p.billig.zb!, jahr: 2026, krankengeld: false, eltern: 'k1' }).selbst;
const selbstDiff = Math.round((selbstAok - selbstBillig) * 12);
const nachbarn = (['HB', 'HH', 'NW', 'SH'] as const).map((l) => landProfil(l));
const aokVsTkDe = aok.zb! < tk.zb! ? 'günstiger als die TK' : aok.zb! > tk.zb! ? 'teurer als die TK' : 'gleichauf mit der TK';
const aokVsTkEn = aok.zb! < tk.zb! ? 'cheaper than TK' : aok.zb! > tk.zb! ? 'dearer than TK' : 'level with TK';

export default defineGuide({
  id: 'guenstigste-krankenkasse-niedersachsen',
  group: 'laender',
  order: 58,
  land: 'NI',
  tool: 'beitrag',
  toolPreset: { land: 'NI', kasse: 'aok-die-gesundheitskasse-fur-niedersachsen' },
  related: ['aok-die-gesundheitskasse-fur-niedersachsen', 'guenstigste-krankenkasse-bremen', 'guenstigste-krankenkasse-nordrhein-westfalen', 'krankenkassenbeitrag-selbststaendige', 'zusatzbeitrag-liste'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_240', 'sgb5_242'],
  de: {
    slug: 'guenstigste-krankenkasse-niedersachsen',
    nav: 'Niedersachsen',
    card: `${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; die AOK Niedersachsen mit ${DE.pk(aok.zb!)} auf Platz ${p.aokRang}.`,
    title: 'Günstigste Krankenkasse Niedersachsen 2027: Kassen in Euro',
    description: `Niedersachsen 2026/2027: alle wählbaren Krankenkassen von ${DE.pk(p.billig.zb!)} bis ${DE.pk(p.teuer.zb!)} Zusatzbeitrag, Beitrag in Euro, AOK Niedersachsen, Selbstständige und Landwirte.`,
    h1: 'Günstigste Krankenkasse in Niedersachsen: Rangliste in Euro',
    intro: `In Niedersachsen haben Sie die Wahl zwischen ${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; die AOK Niedersachsen liegt mit ${DE.pk(aok.zb!)} auf Platz ${p.aokRang}.`,
    resume: `Niedersachsen gehört zu den Ländern mit großer Kassenauswahl: Die Liste des GKV-Spitzenverbands nennt ${p.n} wählbare Krankenkassen, ${p.bund.length} bundesweit und ${p.regional.length} regional geöffnet. Am günstigsten ist ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)} Zusatzbeitrag, am teuersten ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlen Sie dazwischen ${DE.eur(p.spanneJahr)} im Jahr mehr oder weniger, an der Beitragsbemessungsgrenze ${DE.eur(p.spanneJahrBbg)}. Die AOK Niedersachsen ist nur in diesem Land geöffnet und verlangt ${DE.pk(aok.zb!)}, ${aokVsTkDe}; unter den ${aoks.length} AOKs hat sie den ${aokPlatz}. niedrigsten Satz. Selbstständige spüren den Unterschied doppelt, weil sie den Zusatzbeitrag allein tragen. Für Landwirte gilt eine eigene Kasse ohne Zusatzbeitrag. Wer in Bremen, Hamburg oder Nordrhein-Westfalen arbeitet, darf zusätzlich deren Kassen wählen, die Mitgliedschaft bleibt auch nach einem Jobwechsel bestehen.`,
    faqs: [
      { q: 'Welche Kassen sind in Niedersachsen am billigsten?', a: `${top.slice(0, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Bei ${p.billig.kurz} zahlen Sie mit ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(p.lohnBillig)} im Monat für Kranken- und Pflegeversicherung zusammen. Die Rangliste ordnet allein nach dem Zusatzbeitrag; Service und Satzungsleistungen sind nicht eingerechnet.` },
      { q: 'Lohnt sich für Selbstständige in Niedersachsen ein Wechsel?', a: `Meist mehr als für Angestellte, weil kein Arbeitgeber die Hälfte trägt. Mit ${DE.eur(BEISPIEL.gewinn)} Gewinn im Monat und ohne Krankengeld zahlen Sie bei der AOK Niedersachsen ${DE.eur(selbstAok)}, bei ${p.billig.kurz} ${DE.eur(selbstBillig)}, also ${DE.eur(selbstDiff)} im Jahr weniger. Mindestens wird ein Einkommen von ${DE.eur(w.mindestFreiwillig, 2)} angesetzt.` },
      { q: 'Welche Krankenkasse gilt für Landwirte in Niedersachsen?', a: `Selbstständige Landwirte und mitarbeitende Familienangehörige sind in der landwirtschaftlichen Krankenkasse versichert, der ${svlfg ? svlfg.kurz : 'SVLFG'}. Sie ist branchenbezogen, nicht frei wählbar und erhebt laut Liste des GKV-Spitzenverbands keinen Zusatzbeitrag; die Beiträge richten sich nach eigenen Regeln. Für angestellte Erntehelfer gilt dagegen die normale Kassenwahl.` },
      { q: 'Kann ich aus Osnabrück eine Kasse aus Nordrhein-Westfalen wählen?', a: `Nur wenn Sie in Nordrhein-Westfalen arbeiten oder die Kasse für Niedersachsen geöffnet ist. Wohn- und Arbeitsort zählen, nicht die Nähe zur Grenze. Wer in Münster oder Bielefeld beschäftigt ist, darf aus der nordrhein-westfälischen Liste wählen, die mit ${landProfil('NW').n} Kassen die längste aller Länder ist.` },
      { q: 'Gibt es Krankenkassen, die nur in Niedersachsen geöffnet sind?', a: `Laut Liste des GKV-Spitzenverbands ${p.nurHier.length ? `ja: ${p.nurHier.map((k) => k.kurz).join(', ')}` : 'derzeit keine'}. Hinzu kommen Betriebskrankenkassen, die nur den Beschäftigten ihres Trägerunternehmens offenstehen und deshalb in der Rangliste fehlen. Sind Sie dort beschäftigt, können Sie sie in der vollständigen Liste einblenden und mit den offenen Kassen vergleichen.` },
    ],
    body: (h) => `
<h2>Selbstständig, freiwillig versichert, voller Zusatzbeitrag</h2>
<p>Angestellte teilen den Zusatzbeitrag mit dem Arbeitgeber, Selbstständige nicht. Deshalb ist der Abstand zwischen zwei Kassen für einen Handwerksmeister in Hildesheim oder eine Grafikerin in Hannover etwa doppelt so groß wie für einen Angestellten mit gleichem Einkommen. Bemessen wird der Gewinn laut letztem Steuerbescheid, mindestens ${h.eur(w.mindestFreiwillig, 2)} im Monat, höchstens die Beitragsbemessungsgrenze. Ohne Anspruch auf Krankengeld gilt der ermäßigte Satz von ${h.pz(w.kv_ermaessigt)}. Mehr dazu im Rechner für ${h.a('krankenkassenbeitrag-selbststaendige', 'Selbstständige')}.</p>
${h.table(['Selbstständig, Gewinn im Monat', 'AOK Niedersachsen', kLink(h, p.billig)], [
  [h.eur(BEISPIEL.gewinn), h.eur(selbstAok), h.eur(selbstBillig)],
  ['Unterschied im Jahr', '', h.eur(selbstDiff)],
], 'ohne Krankengeld, ein Kind, 2026', ['l', 'r', 'r'])}
<h2>Die Spitze der niedersächsischen Rangliste</h2>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `Angestellt, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Vier Nachbarn, vier Listen</h2>
<p>Niedersachsen umschließt Bremen und grenzt an Hamburg, Schleswig-Holstein und Nordrhein-Westfalen. Wer dort arbeitet, hat zusätzlich deren Kassen zur Wahl. Die jeweils günstigste: ${nachbarn.map((n) => `${n.name.de} ${kLink(h, n.billig)} mit ${h.pk(n.billig.zb!)}`).join(', ')}. Mehr auf den Seiten zu ${h.a('guenstigste-krankenkasse-bremen', 'Bremen')} und ${h.a('guenstigste-krankenkasse-nordrhein-westfalen', 'Nordrhein-Westfalen')}.</p>
<p>Gewechselt wird mit einem Antrag bei der neuen Kasse; die Mitgliedschaft beginnt am übernächsten Monatsersten, nach zwölf Monaten Bindung oder sofort nach einer Erhöhung (${h.a('krankenkasse-wechseln', 'Termin rechnen')}). Der Pflegebeitrag wird in Niedersachsen hälftig geteilt.</p>
<h2>Kinderlos in Niedersachsen</h2>
<p>Ab dem 23. Geburtstag zahlen Mitglieder ohne Kinder ${h.pz(w.pv_kinderlos)} Pflegezuschlag, und zwar allein, ohne Anteil des Arbeitgebers. Das gilt in allen Ländern gleich und bei jeder Kasse, ein Wechsel ändert daran nichts. Eltern weisen ihre Kinder einmal nach, gegenüber dem Arbeitgeber oder, als Selbstständige, gegenüber der Pflegekasse. Ab dem zweiten Kind unter 25 sinkt der Anteil je Kind um ${h.pz(w.pv_abschlag_kind)}, bis zum fünften. Im Rechner oben stellen Sie dafür die Zeile „Kinder“ um.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-lower-saxony',
    nav: 'Lower Saxony',
    card: `${p.n} funds from ${EN.pk(p.billig.zb!)}; AOK Niedersachsen ranks ${p.aokRang} at ${EN.pk(aok.zb!)}.`,
    title: 'Cheapest Health Insurance Lower Saxony 2027: Funds in Euros',
    description: `Lower Saxony 2026/2027: every health fund you can join from ${EN.pk(p.billig.zb!)} to ${EN.pk(p.teuer.zb!)} additional rate, cost in euros, AOK Niedersachsen, the self-employed, farmers.`,
    h1: 'Cheapest health insurance in Lower Saxony: ranking in euros',
    intro: `In Lower Saxony you can choose between ${p.n} funds from ${EN.pk(p.billig.zb!)}; AOK Niedersachsen ranks ${p.aokRang} at ${EN.pk(aok.zb!)}.`,
    resume: `Lower Saxony (Niedersachsen) is one of the states with a wide choice: the GKV-Spitzenverband list names ${p.n} funds you can join, ${p.bund.length} nationwide and ${p.regional.length} regionally open. The cheapest is ${p.billig.kurz} with an additional rate of ${EN.pk(p.billig.zb!)}, the most expensive ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child that is a gap of ${EN.eur(p.spanneJahr)} a year, ${EN.eur(p.spanneJahrBbg)} at the contribution ceiling. AOK Niedersachsen is open only in this state and charges ${EN.pk(aok.zb!)}, ${aokVsTkEn}; among the ${aoks.length} AOK funds its rate is number ${aokPlatz} from the bottom. Self-employed people feel the difference twice, because they carry the additional rate alone. Farmers have a fund of their own with no additional rate. If you work in Bremen, Hamburg or North Rhine-Westphalia, you may also choose their funds.`,
    faqs: [
      { q: 'Which funds are cheapest in Lower Saxony?', a: `${top.slice(0, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. At ${p.billig.kurz} you pay ${EN.eur(p.lohnBillig)} a month for health and care insurance together on ${EN.eur(BEISPIEL.lohn)} gross. The ranking uses the additional rate only; service and extra benefits are not included.` },
      { q: 'Is switching worth it for the self-employed in Lower Saxony?', a: `Usually more than for employees, because no employer pays half. With ${EN.eur(BEISPIEL.gewinn)} profit a month and no sick pay you pay ${EN.eur(selbstAok)} at AOK Niedersachsen and ${EN.eur(selbstBillig)} at ${p.billig.kurz}, ${EN.eur(selbstDiff)} a year less. Income of at least ${EN.eur(w.mindestFreiwillig, 2)} is always assessed.` },
      { q: 'Which health fund covers farmers in Lower Saxony?', a: `Self-employed farmers and family members working on the farm are insured with the agricultural health fund, ${svlfg ? svlfg.kurz : 'SVLFG'}. It is sector-based, cannot be chosen freely and, according to the GKV-Spitzenverband list, charges no additional rate; contributions follow their own rules. Employed seasonal workers choose a fund as usual.` },
      { q: 'Can I join a North Rhine-Westphalia fund while living in Osnabrück?', a: `Only if you work in North Rhine-Westphalia or the fund is open to Lower Saxony. Home and workplace count, not how close you live to the border. If you are employed in Münster or Bielefeld, you may choose from the North Rhine-Westphalia list, which with ${landProfil('NW').n} funds is the longest of any state.` },
      { q: 'Are any health funds open only in Lower Saxony?', a: `According to the GKV-Spitzenverband list, ${p.nurHier.length ? `yes: ${p.nurHier.map((k) => k.kurz).join(', ')}` : 'none at present'}. There are also company funds open only to staff of their sponsoring company, which is why they are missing from the ranking. If you work there, you can show them in the full list and compare them with the open funds.` },
    ],
    body: (h) => `
<h2>Self-employed, voluntary member, full additional rate</h2>
<p>Employees share the additional rate with their employer; the self-employed do not. So the gap between two funds is roughly twice as large for a master craftsman in Hildesheim or a designer in Hanover as for an employee on the same income. Contributions are based on profit from the latest tax assessment, at least ${h.eur(w.mindestFreiwillig, 2)} a month and at most the contribution ceiling. Without a sick-pay entitlement the reduced rate of ${h.pz(w.kv_ermaessigt)} applies. More in the calculator for the ${h.a('krankenkassenbeitrag-selbststaendige', 'self-employed')}.</p>
${h.table(['Self-employed, profit a month', 'AOK Niedersachsen', kLink(h, p.billig)], [
  [h.eur(BEISPIEL.gewinn), h.eur(selbstAok), h.eur(selbstBillig)],
  ['Difference a year', '', h.eur(selbstDiff)],
], 'no sick pay, one child, 2026', ['l', 'r', 'r'])}
<h2>Top of the Lower Saxony ranking</h2>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `Employee, ${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Four neighbours, four lists</h2>
<p>Lower Saxony surrounds Bremen and borders Hamburg, Schleswig-Holstein and North Rhine-Westphalia. If you work there, their funds are open to you too. The cheapest in each: ${nachbarn.map((n) => `${n.name.en} ${kLink(h, n.billig)} at ${h.pk(n.billig.zb!)}`).join(', ')}. More on the pages for ${h.a('guenstigste-krankenkasse-bremen', 'Bremen')} and ${h.a('guenstigste-krankenkasse-nordrhein-westfalen', 'North Rhine-Westphalia')}.</p>
<p>You switch by applying to the new fund; membership starts on the first day of the month after next, after twelve months’ lock-in or straight after a rate rise (${h.a('krankenkasse-wechseln', 'work out the date')}). Care insurance is split half and half in Lower Saxony.</p>`,
  },
});
