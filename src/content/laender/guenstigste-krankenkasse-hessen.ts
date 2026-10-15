import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN, kasse } from '../../lib/engine/kassen';

/** Hessen: Rangliste aus der Liste des GKV-Spitzenverbands; AOK Hessen, regionale Kassen, Pendeln im Rhein-Main-Gebiet. */
const p = landProfil('HE');
const rp = landProfil('RP');
const by = landProfil('BY');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const ikkSw = kasse('ikk-sudwest');
const wm = kasse('bkk-werra-meissner');
const regionalTeuer = [...p.regional].sort((a, b) => b.zb! - a.zb!).slice(0, 3);
const mainzDiff = Math.round((kostenZeile(aok).lohn - kostenZeile(rp.aok!).lohn) * 12);
const aokRpBilligerDe = rp.aok!.zb! < aok.zb!;

export default defineGuide({
  id: 'guenstigste-krankenkasse-hessen',
  group: 'laender',
  order: 56,
  land: 'HE',
  tool: 'beitrag',
  toolPreset: { land: 'HE', kasse: 'aok-die-gesundheitskasse-in-hessen' },
  related: ['aok-die-gesundheitskasse-in-hessen', 'guenstigste-krankenkasse-rheinland-pfalz', 'guenstigste-krankenkasse-bayern', 'guenstigste-krankenkasse-nordrhein-westfalen', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_242', 'sgb5_223'],
  de: {
    slug: 'guenstigste-krankenkasse-hessen',
    nav: 'Hessen',
    card: `${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; die AOK Hessen mit ${DE.pk(aok.zb!)} auf Platz ${p.aokRang}.`,
    title: 'Günstigste Krankenkasse Hessen 2027: alle Kassen in Euro',
    description: `Hessen 2026/2027: jede für Sie wählbare Krankenkasse von ${DE.pk(p.billig.zb!)} bis ${DE.pk(p.teuer.zb!)} Zusatzbeitrag, in Euro gerechnet, die AOK Hessen und Pendeln im Rhein-Main-Gebiet.`,
    h1: 'Günstigste Krankenkasse in Hessen: Rangliste und AOK',
    intro: `Hessen bietet ${p.n} wählbare Kassen ab ${DE.pk(p.billig.zb!)}; die AOK Hessen steht mit ${DE.pk(aok.zb!)} auf Platz ${p.aokRang}.`,
    resume: `Für Hessen nennt die Liste des GKV-Spitzenverbands ${p.n} wählbare Krankenkassen: ${p.bund.length} bundesweite und ${p.regional.length} regional geöffnete. Am günstigsten ist ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)} Zusatzbeitrag, am teuersten ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}; bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind sind das ${DE.eur(p.spanneJahr)} im Jahr Unterschied, an der Beitragsbemessungsgrenze ${DE.eur(p.spanneJahrBbg)}. Die AOK Hessen ist nur in diesem Land geöffnet und verlangt ${DE.pk(aok.zb!)}, ${aok.zb! < w.zb_durchschnitt ? 'weniger' : 'mehr'} als der amtliche Durchschnitt von ${DE.pz(w.zb_durchschnitt)}; unter den ${aoks.length} AOKs hat sie den ${aokPlatz}. niedrigsten Satz. Unter den regionalen Kassen sind auch teure: ${wm.kurz} verlangt ${DE.pk(wm.zb!)}. Im Rhein-Main-Gebiet arbeiten viele über die Landesgrenze hinweg; wer in Mainz oder Aschaffenburg beschäftigt ist, darf auch die Kassen von Rheinland-Pfalz oder Bayern wählen und bleibt Mitglied, wenn der Job endet.`,
    faqs: [
      { q: 'Welche Krankenkasse ist in Hessen am günstigsten?', a: `${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, gefolgt von ${top.slice(1, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie dort ${DE.eur(p.lohnBillig)} im Monat, Kranken- und Pflegeversicherung zusammen. Die Reihenfolge sagt nichts über Service oder Zusatzleistungen.` },
      { q: 'Ich wohne in Wiesbaden und arbeite in Mainz. Welche AOK darf ich wählen?', a: `Beide: die AOK Hessen wegen des Wohnorts und die AOK Rheinland-Pfalz/Saarland wegen des Arbeitsorts. Die rheinland-pfälzische verlangt ${DE.pk(rp.aok!.zb!)}, die hessische ${DE.pk(aok.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie bei der ${aokRpBilligerDe ? 'rheinland-pfälzischen' : 'hessischen'} AOK ${DE.eur(Math.abs(mainzDiff))} im Jahr weniger. Stellen Sie im Rechner oben beide Länder nacheinander ein, um die vollständigen Ranglisten zu vergleichen.` },
      { q: 'Welche regionalen Kassen in Hessen sind besonders teuer?', a: `Die teuersten regional für Hessen geöffneten Kassen sind ${regionalTeuer.map((k) => `${k.kurz} (${DE.pk(k.zb!)})`).join(', ')}. Regional heißt also nicht automatisch günstig. Die ${ikkSw.kurz}, geöffnet für Hessen, Rheinland-Pfalz und das Saarland, verlangt ${DE.pk(ikkSw.zb!)}. Der Rechner oben ordnet alle nach Ihrem Beitrag in Euro.` },
      { q: 'Lohnt sich ein Wechsel von der AOK Hessen?', a: `Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind spart die günstigste wählbare Kasse ${DE.eur(p.aokVsBillig)} im Jahr gegenüber der AOK Hessen. Wer mehr verdient, spart mehr, bis zur Beitragsbemessungsgrenze von ${DE.eur(w.bbgKv, 2)} im Monat. Ob Geschäftsstellen vor Ort und Zusatzleistungen das aufwiegen, entscheiden Sie selbst.` },
      { q: 'Was zahlt ein Rentner in Kassel bei der AOK Hessen?', a: `Mit ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente und einem Kind ${DE.eur(kostenZeile(aok).rente)} im Monat für Kranken- und Pflegeversicherung, bei ${p.billig.kurz} ${DE.eur(kostenZeile(p.billig).rente)}. Die Rentenversicherung zahlt die Hälfte der Krankenversicherung, die Pflege tragen Rentner selbst. Erhöht die Kasse, wirkt das bei der Rente erst ab dem zweiten Folgemonat.` },
    ],
    body: (h) => `
<h2>Pendeln im Rhein-Main-Gebiet</h2>
<p>Frankfurt, Wiesbaden, Mainz, Darmstadt und Aschaffenburg bilden einen Arbeitsmarkt über drei Länder. Für die Kassenwahl zählt beides, Wohnort und Arbeitsort. Wer in Hessen wohnt und in ${h.a('guenstigste-krankenkasse-rheinland-pfalz', 'Rheinland-Pfalz')} oder ${h.a('guenstigste-krankenkasse-bayern', 'Bayern')} arbeitet, hat drei AOKs und drei Listen zur Auswahl:</p>
${h.table(['Land', 'AOK', 'AOK-Satz', 'günstigste Kasse', 'Satz'], [
  ['Hessen', kLink(h, aok), h.pk(aok.zb!), kLink(h, p.billig), h.pk(p.billig.zb!)],
  ['Rheinland-Pfalz', kLink(h, rp.aok!), h.pk(rp.aok!.zb!), kLink(h, rp.billig), h.pk(rp.billig.zb!)],
  ['Bayern', kLink(h, by.aok!), h.pk(by.aok!.zb!), kLink(h, by.billig), h.pk(by.billig.zb!)],
], 'Liste des GKV-Spitzenverbands, 2026', ['l', 'l', 'r', 'l', 'r'])}
<p>Wichtig: Die Mitgliedschaft hängt nicht am Arbeitsplatz. Wer über den Arbeitsort in Mainz eine rheinland-pfälzische Kasse gewählt hat, bleibt Mitglied, wenn er später in Frankfurt arbeitet.</p>
<h2>Die fünf günstigsten Kassen für Hessen</h2>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Wechseln in Hessen</h2>
<p>Antrag bei der neuen Kasse, die alte wird automatisch informiert, neue Mitgliedschaft ab dem übernächsten Monatsersten. Voraussetzung sind zwölf Monate Bindung, außer Ihre Kasse erhöht den Zusatzbeitrag (${h.a('krankenkasse-wechseln', 'Fristen rechnen')}). Den Pflegebeitrag von ${h.pz(w.pv_satz)} teilen sich in Hessen Beschäftigte und Arbeitgeber hälftig. Im Norden grenzt Hessen an ${h.a('guenstigste-krankenkasse-nordrhein-westfalen', 'Nordrhein-Westfalen')} und Niedersachsen, im Osten an Thüringen.</p>
<h2>Studium in Frankfurt, Gießen oder Marburg</h2>
<p>Studierende zahlen Kranken- und Pflegeversicherung allein, berechnet auf den gesetzlich festen BAföG-Bedarf von ${h.eur(w.bafoeg_bedarf)}: sieben Zehntel des allgemeinen Satzes, also ${h.pz(w.kvStudent)}, dazu den vollen Zusatzbeitrag der gewählten Kasse. Bis zum 25. Geburtstag kommt oft die beitragsfreie Familienversicherung über die Eltern in Frage, solange das eigene Einkommen unter ${h.eur(w.famGrenze)} im Monat bleibt. Danach lohnt der Blick in die Rangliste oben mit der Einstellung „Student“.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-hesse',
    nav: 'Hesse',
    card: `${p.n} funds from ${EN.pk(p.billig.zb!)}; AOK Hessen ranks ${p.aokRang} at ${EN.pk(aok.zb!)}.`,
    title: 'Cheapest Health Insurance Hesse 2027: Every Fund in Euros',
    description: `Hesse 2026/2027: every health fund you can join from ${EN.pk(p.billig.zb!)} to ${EN.pk(p.teuer.zb!)} additional rate, worked out in euros, AOK Hessen and commuting in the Rhine-Main area.`,
    h1: 'Cheapest health insurance in Hesse: ranking and the AOK',
    intro: `Hesse offers ${p.n} funds from ${EN.pk(p.billig.zb!)}; AOK Hessen ranks ${p.aokRang} at ${EN.pk(aok.zb!)}.`,
    resume: `For Hesse (Hessen) the GKV-Spitzenverband list names ${p.n} funds you can join: ${p.bund.length} nationwide and ${p.regional.length} regionally open. The cheapest is ${p.billig.kurz} with an additional rate of ${EN.pk(p.billig.zb!)}, the most expensive ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}; on ${EN.eur(BEISPIEL.lohn)} gross with one child that is ${EN.eur(p.spanneJahr)} a year, ${EN.eur(p.spanneJahrBbg)} at the contribution ceiling. AOK Hessen is open only in this state and charges ${EN.pk(aok.zb!)}, ${aok.zb! < w.zb_durchschnitt ? 'less' : 'more'} than the official average of ${EN.pz(w.zb_durchschnitt)}; among the ${aoks.length} AOK funds its rate is number ${aokPlatz} from the bottom. Some regional funds are expensive: ${wm.kurz} charges ${EN.pk(wm.zb!)}. In the Rhine-Main area many people work across the state border; if you are employed in Mainz or Aschaffenburg, you may also choose the funds of Rhineland-Palatinate or Bavaria.`,
    faqs: [
      { q: 'Which health fund is cheapest in Hesse?', a: `${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, followed by ${top.slice(1, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohnBillig)} a month there, health and care insurance together. The order says nothing about service or extra benefits.` },
      { q: 'I live in Wiesbaden and work in Mainz. Which AOK may I join?', a: `Either: AOK Hessen through your home and AOK Rheinland-Pfalz/Saarland through your workplace. The Rhineland-Palatinate fund charges ${EN.pk(rp.aok!.zb!)}, the Hessian one ${EN.pk(aok.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(Math.abs(mainzDiff))} a year less at the ${aokRpBilligerDe ? 'Rhineland-Palatinate' : 'Hessian'} AOK. Enter each state in the calculator above to compare the full rankings.` },
      { q: 'Which regional funds in Hesse are especially expensive?', a: `The dearest funds open regionally to Hesse are ${regionalTeuer.map((k) => `${k.kurz} (${EN.pk(k.zb!)})`).join(', ')}. So regional does not automatically mean cheap. ${ikkSw.kurz}, open to Hesse, Rhineland-Palatinate and Saarland, charges ${EN.pk(ikkSw.zb!)}. The calculator above sorts all of them by your contribution in euros.` },
      { q: 'Is leaving AOK Hessen worth it?', a: `On ${EN.eur(BEISPIEL.lohn)} gross with one child the cheapest fund open to you saves ${EN.eur(p.aokVsBillig)} a year compared with AOK Hessen. Higher earners save more, up to the contribution ceiling of ${EN.eur(w.bbgKv, 2)} a month. Whether local offices and extra benefits outweigh that is your decision.` },
      { q: 'What does a pensioner in Kassel pay at AOK Hessen?', a: `With a ${EN.eur(BEISPIEL.rente)} state pension and one child, ${EN.eur(kostenZeile(aok).rente)} a month for health and care insurance, against ${EN.eur(kostenZeile(p.billig).rente)} at ${p.billig.kurz}. The pension insurance pays half the health contribution; pensioners pay care insurance themselves. A rate rise reaches the pension from the second month after it.` },
    ],
    body: (h) => `
<h2>Commuting in the Rhine-Main area</h2>
<p>Frankfurt, Wiesbaden, Mainz, Darmstadt and Aschaffenburg form one job market spanning three states. When choosing a fund, both home and workplace count. If you live in Hesse and work in ${h.a('guenstigste-krankenkasse-rheinland-pfalz', 'Rhineland-Palatinate')} or ${h.a('guenstigste-krankenkasse-bayern', 'Bavaria')}, you have three AOKs and three lists to choose from:</p>
${h.table(['State', 'AOK', 'AOK rate', 'cheapest fund', 'rate'], [
  ['Hesse', kLink(h, aok), h.pk(aok.zb!), kLink(h, p.billig), h.pk(p.billig.zb!)],
  ['Rhineland-Palatinate', kLink(h, rp.aok!), h.pk(rp.aok!.zb!), kLink(h, rp.billig), h.pk(rp.billig.zb!)],
  ['Bavaria', kLink(h, by.aok!), h.pk(by.aok!.zb!), kLink(h, by.billig), h.pk(by.billig.zb!)],
], 'GKV-Spitzenverband list, 2026', ['l', 'l', 'r', 'l', 'r'])}
<p>Note that membership does not depend on keeping the job. If you joined a Rhineland-Palatinate fund through a workplace in Mainz, you remain a member when you later work in Frankfurt.</p>
<h2>The five cheapest funds for Hesse</h2>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Switching in Hesse</h2>
<p>Apply to the new fund, the old one is informed automatically, and membership starts on the first day of the month after next. You need twelve months’ membership first, unless your fund raises its additional rate (${h.a('krankenkasse-wechseln', 'work out the dates')}). Employees and employers in Hesse split the ${h.pz(w.pv_satz)} care contribution in half. To the north Hesse borders ${h.a('guenstigste-krankenkasse-nordrhein-westfalen', 'North Rhine-Westphalia')} and Lower Saxony, to the east Thuringia.</p>
<h2>Studying in Frankfurt, Giessen or Marburg</h2>
<p>Students pay health and care insurance alone, on the statutory BAföG need rate of ${h.eur(w.bafoeg_bedarf)}: seven tenths of the general rate, ${h.pz(w.kvStudent)}, plus the chosen fund’s full additional rate. Until their 25th birthday many can use free family cover through their parents, as long as their own income stays under ${h.eur(w.famGrenze)} a month. After that, check the ranking above with “student” selected.</p>`,
  },
});
