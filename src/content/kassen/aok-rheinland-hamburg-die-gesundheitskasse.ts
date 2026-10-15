import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { kasse, KASSEN, rangliste } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** AOK Rheinland/Hamburg: Rheinland (NRW) und Hamburg. Pendler aus dem Umland haben zwei Ortskrankenkassen zur Wahl. */
const ID = 'aok-rheinland-hamburg-die-gesundheitskasse';
const p = profil(ID);
const w = J(2026);
const me = kostenZeile(p.k);
const nw = kostenZeile(kasse('aok-nordwest-die-gesundheitskasse'));
const ni = kostenZeile(kasse('aok-die-gesundheitskasse-fur-niedersachsen'));
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < p.zb).length + 1;
const gleich = aoks.filter((k) => k.zb === p.zb && k.id !== ID);
const rHH = p.raengeLand.find((r) => r.l === 'HH')!, rNW = p.raengeLand.find((r) => r.l === 'NW')!;
const j = (x: { lohn: number }) => Math.round((x.lohn - me.lohn) * 12);
const vglDe = (x: { k: { zb: number | null } }) => (x.k.zb! < p.zb ? 'günstiger' : x.k.zb! > p.zb ? 'teurer' : 'gleich teuer');
const vglEn = (x: { k: { zb: number | null } }) => (x.k.zb! < p.zb ? 'cheaper' : x.k.zb! > p.zb ? 'dearer' : 'the same');
const hhTop = rangliste('HH').slice(0, 3);
const pendler = [me, nw, ni].sort((a, b) => a.k.zb! - b.k.zb!);
const ordEn = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 19,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID, land: 'HH' },
  related: ['guenstigste-krankenkasse-hamburg', 'guenstigste-krankenkasse-nordrhein-westfalen', 'aok-nordwest-die-gesundheitskasse', 'zusatzbeitrag-liste'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_175', 'sgb5_223'],
  de: {
    slug: 'aok-rheinland-hamburg-zusatzbeitrag',
    nav: 'AOK Rheinland/Hamburg',
    card: `${DE.pk(p.zb)} Zusatzbeitrag im Rheinland und in Hamburg; für Pendler aus dem Umland lohnt der Blick auf die Nachbar-AOK.`,
    title: 'AOK Rheinland/Hamburg Zusatzbeitrag 2027: Beitrag in Euro',
    description: `AOK Rheinland/Hamburg, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Monatsbeitrag in Köln, Düsseldorf und Hamburg, Vergleich mit AOK NordWest und den Hamburger Alternativen.`,
    h1: 'AOK Rheinland/Hamburg: Zusatzbeitrag zwischen Rhein und Elbe',
    intro: `Die AOK Rheinland/Hamburg verlangt ${DE.pk(p.zb)}; in Hamburg stehen ${rHH.rang - 1} wählbare Kassen günstiger da, im Rheinland ${rNW.rang - 1}.`,
    resume: `Die AOK Rheinland/Hamburg ist die Ortskrankenkasse des Rheinlands, also des westlichen Teils von Nordrhein-Westfalen mit Köln, Düsseldorf, Aachen und dem Niederrhein, und der Freien und Hansestadt Hamburg. Die Liste des GKV-Spitzenverbands führt sie mit ${DE.pk(p.zb)} Zusatzbeitrag und geöffnet für Hamburg und Nordrhein-Westfalen; den westfälischen Landesteil betreut die AOK NordWest, die ${vglDe(nw)} ist. Ein Mitglied mit ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlt ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung, eine Rentnerin mit ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente ${DE.eur(p.rente)}. Unter den ${aoks.length} AOKs hat sie den ${aokPlatz}. niedrigsten Satz${gleich.length ? `, denselben wie ${gleich.map((k) => k.kurz).join(' und ')}` : ''}. In Hamburg reiht sie sich auf Platz ${rHH.rang} von ${rHH.n} wählbaren Kassen ein. Gegenüber ${p.billigste.kurz}, der günstigsten frei wählbaren Kasse, zahlen Mitglieder bei diesem Lohn ${DE.eur(p.proJahrVsBilligste)} im Jahr mehr, gegenüber dem amtlichen Durchschnittssatz ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} ${p.unterDurchschnitt ? 'weniger' : 'mehr'}.`,
    faqs: [
      { q: 'Ich wohne in Pinneberg und arbeite in Hamburg. Welche AOK passt?', a: `Sie können zwischen der AOK Rheinland/Hamburg (Arbeitsort Hamburg) und der AOK NordWest (Wohnort Schleswig-Holstein) wählen. Die AOK NordWest verlangt ${DE.pk(nw.k.zb!)} und ist ${vglDe(nw)}; bei ${DE.eur(BEISPIEL.lohn)} brutto beträgt der Unterschied ${DE.eur(Math.abs(j(nw)))} im Jahr. Wer im niedersächsischen Umland wohnt, hat stattdessen die AOK Niedersachsen zur Wahl.` },
      { q: 'Welche Kassen sind in Hamburg am günstigsten?', a: `Den niedrigsten Zusatzbeitrag unter den ${rHH.n} in Hamburg wählbaren Kassen haben ${hhTop.map((k) => `${k.kurz} (${DE.pk(k.zb!)})`).join(', ')}. Die AOK Rheinland/Hamburg liegt auf Rang ${rHH.rang}. Bei ${DE.eur(BEISPIEL.lohn)} brutto spart die günstigste ${DE.eur(p.proJahrVsBilligste)} im Jahr, an der Bemessungsgrenze ${DE.eur(p.proJahrVsBilligsteBbg)}.` },
      { q: 'Wie hoch ist der Höchstbeitrag bei der AOK Rheinland/Hamburg?', a: `Ab einem Bruttolohn von ${DE.eur(w.bbgKv, 2)} im Monat zahlen Beschäftigte ${DE.eur(p.lohnBbg)}, Pflege mit einem Kind eingeschlossen; darüber steigt nichts mehr. 2027 soll die Grenze nach dem Kabinettsbeschluss auf ${DE.eur(J(2027).bbgKv)} steigen, was den Höchstbeitrag bei gleichem Satz erhöht. Den Arbeitgeberanteil zahlt der Arbeitgeber zusätzlich.` },
      { q: 'Muss ich nach einem Umzug von Köln nach Münster die AOK wechseln?', a: `Nein. Ihre Mitgliedschaft bei der AOK Rheinland/Hamburg bleibt bestehen, auch wenn Münster im Gebiet der AOK NordWest liegt. Sie dürfen aber wechseln, nach zwölf Monaten Mitgliedschaft oder wegen einer Erhöhung sofort, und zwar zur AOK NordWest oder zu jeder anderen in Nordrhein-Westfalen geöffneten Kasse.` },
    ],
    body: (h) => `
<h2>Rheinland und Hamburg: ein Satz für zwei Großstadtregionen</h2>
<p>Zwischen Kölner Bucht und Elbmündung liegen mehrere Hundert Kilometer, aber für die Mitglieder dieser Ortskrankenkasse gilt derselbe Zusatzbeitrag. Für Nordrhein-Westfalen ist die Lage besonders: Das Land hat zwei AOKs, getrennt nach Rheinland und Westfalen-Lippe. Die amtliche Liste unterscheidet das nicht und führt beide als in ganz Nordrhein-Westfalen geöffnet; welche Ortskrankenkasse Sie aufnimmt, richtet sich nach ihrem Bezirk. In Hamburg ist die AOK Rheinland/Hamburg die einzige Ortskrankenkasse der Stadt.</p>
${h.table(['Ortskrankenkasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber AOK Rheinland/Hamburg im Jahr'], pendler.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `Für Pendler im Umland Hamburgs und in NRW, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind`, ['l', 'r', 'r', 'r'])}
<h2>Beiträge der AOK Rheinland/Hamburg</h2>
${h.table(['Versicherte', 'Bemessung', 'Ihr Anteil im Monat'], [
  ['Angestellte', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Angestellte', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Angestellte, Höchstbeitrag', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Rentnerinnen und Rentner', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständige', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studierende', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, ein Kind; Selbstständige ohne Krankengeld, Studierende unter 23', ['l', 'r', 'r'])}
<p>Hamburg ist ein Stadtstaat mit vielen Pendlern aus Schleswig-Holstein und Niedersachsen. Für sie zählt neben dem Wohnort auch der Arbeitsort: Die Rangliste im Rechner oben wechselt mit dem Land, das Sie einstellen. Alle in der Stadt wählbaren Kassen stehen auf der Seite ${h.a('guenstigste-krankenkasse-hamburg', 'günstigste Krankenkasse in Hamburg')}, für das Rheinland unter ${h.a('guenstigste-krankenkasse-nordrhein-westfalen', 'Nordrhein-Westfalen')}.</p>
<h2>Wechsel und Sonderkündigung</h2>
<p>Wer die AOK Rheinland/Hamburg verlassen möchte, stellt den Antrag bei der neuen Kasse. Die Mitgliedschaft endet zum Ende des übernächsten Monats; bis dahin gilt der bisherige Satz. Hebt die Kasse ihren Zusatzbeitrag an, ist ein Wechsel bis zum Ende des Monats der Erhöhung möglich, auch ohne zwölf Monate Mitgliedschaft. Den Termin rechnet der ${h.a('krankenkasse-wechseln', 'Fristenrechner')}.</p>
<p>Für Selbstständige im Rheinland oder in Hamburg ist der Zusatzbeitrag der größte bewegliche Posten: Sie tragen ihn allein, bei ${h.eur(BEISPIEL.gewinn)} Gewinn zahlen sie heute ${h.eur(p.selbst)} im Monat. Rentner zahlen nur die Hälfte des Satzes, weil die Rentenversicherung die andere Hälfte übernimmt, und spüren eine Änderung erst zwei Monate später auf der Rentenabrechnung. Studierende rechnen auf den festen BAföG-Bedarf von ${h.eur(w.bafoeg_bedarf)}; für sie liegen zwischen den Kassen nur wenige Euro im Jahr.</p>`,
  },
  en: {
    slug: 'aok-rheinland-hamburg-additional-contribution',
    nav: 'AOK Rheinland/Hamburg',
    card: `${EN.pk(p.zb)} additional rate in the Rhineland and Hamburg; commuters from the suburbs should compare the neighbouring AOK.`,
    title: 'AOK Rheinland/Hamburg Additional Contribution 2027 in Euros',
    description: `AOK Rheinland/Hamburg additional rate in 2026: ${EN.pk(p.zb)}. Monthly cost in Cologne, Düsseldorf and Hamburg, compared with AOK NordWest and other options in Hamburg.`,
    h1: 'AOK Rheinland/Hamburg: additional rate between Rhine and Elbe',
    intro: `AOK Rheinland/Hamburg charges ${EN.pk(p.zb)}; ${rHH.rang - 1} funds open in Hamburg are cheaper, ${rNW.rang - 1} in the Rhineland.`,
    resume: `AOK Rheinland/Hamburg is the regional health fund (Allgemeine Ortskrankenkasse) of the Rhineland, the western part of North Rhine-Westphalia with Cologne, Düsseldorf, Aachen and the Lower Rhine, and of the city-state of Hamburg. The GKV-Spitzenverband list shows it with an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)}, open in Hamburg and North Rhine-Westphalia; the Westphalian part of the state is served by AOK NordWest, which is ${vglEn(nw)}. A member on ${EN.eur(BEISPIEL.lohn)} gross with one child pays ${EN.eur(p.lohn)} a month for health and care insurance, a pensioner on a ${EN.eur(BEISPIEL.rente)} state pension ${EN.eur(p.rente)}. It has the ${ordEn(aokPlatz)} lowest rate among the ${aoks.length} AOKs${gleich.length ? `, the same as ${gleich.map((k) => k.kurz).join(' and ')}` : ''}. In Hamburg it ranks ${rHH.rang} of ${rHH.n} funds open to the public. Compared with ${p.billigste.kurz}, the cheapest fund open to everyone, members pay ${EN.eur(p.proJahrVsBilligste)} a year more at that pay, and ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} ${p.unterDurchschnitt ? 'less' : 'more'} than at the official average rate.`,
    faqs: [
      { q: 'I live in Pinneberg and work in Hamburg. Which AOK fits?', a: `You can choose between AOK Rheinland/Hamburg (workplace in Hamburg) and AOK NordWest (home in Schleswig-Holstein). AOK NordWest charges ${EN.pk(nw.k.zb!)} and is ${vglEn(nw)}; on ${EN.eur(BEISPIEL.lohn)} gross the difference is ${EN.eur(Math.abs(j(nw)))} a year. If you live in the Lower Saxony suburbs, AOK Niedersachsen is the alternative instead.` },
      { q: 'Which funds are cheapest in Hamburg?', a: `Among the ${rHH.n} funds open in Hamburg, the lowest additional rates belong to ${hhTop.map((k) => `${k.kurz} (${EN.pk(k.zb!)})`).join(', ')}. AOK Rheinland/Hamburg ranks ${rHH.rang}. On ${EN.eur(BEISPIEL.lohn)} gross the cheapest saves ${EN.eur(p.proJahrVsBilligste)} a year, at the contribution ceiling ${EN.eur(p.proJahrVsBilligsteBbg)}.` },
      { q: 'What is the maximum contribution at AOK Rheinland/Hamburg?', a: `From ${EN.eur(w.bbgKv, 2)} gross a month employees pay ${EN.eur(p.lohnBbg)}, care with one child included; above that nothing rises. Under the cabinet decision the ceiling goes up to ${EN.eur(J(2027).bbgKv)} in 2027, which raises the maximum at the same rate. The employer pays its share on top.` },
      { q: 'Do I have to leave the AOK after moving from Cologne to Münster?', a: `No. Your membership of AOK Rheinland/Hamburg continues even though Münster lies in AOK NordWest territory. You may switch, though, after twelve months of membership or straight away after a rate rise, to AOK NordWest or any other fund open in North Rhine-Westphalia.` },
    ],
    body: (h) => `
<h2>Rhineland and Hamburg: one rate for two metropolitan regions</h2>
<p>Several hundred kilometres separate the Cologne basin from the mouth of the Elbe, yet members of this regional fund pay the same additional rate. North Rhine-Westphalia is a special case: the state has two AOKs, split between the Rhineland and Westphalia-Lippe. The official list does not reflect this and shows both as open across the whole state; which regional fund takes you depends on its district. In Hamburg, AOK Rheinland/Hamburg is the city’s only regional fund.</p>
${h.table(['Regional fund', 'Additional rate', 'You pay a month', 'vs AOK Rheinland/Hamburg a year'], pendler.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `For commuters around Hamburg and in NRW, ${h.eur(BEISPIEL.lohn)} gross, one child`, ['l', 'r', 'r', 'r'])}
<h2>AOK Rheinland/Hamburg contributions</h2>
${h.table(['Insured', 'Base', 'Your share a month'], [
  ['Employees', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employees', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employees, maximum', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Pensioners', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Students', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, one child; self-employed without sick pay, students under 23', ['l', 'r', 'r'])}
<p>Hamburg is a city-state with many commuters from Schleswig-Holstein and Lower Saxony. For them the workplace counts as well as the home: the ranking in the calculator above changes with the state you set. Every fund open in the city is on the page ${h.a('guenstigste-krankenkasse-hamburg', 'cheapest health insurance in Hamburg')}, and for the Rhineland under ${h.a('guenstigste-krankenkasse-nordrhein-westfalen', 'North Rhine-Westphalia')}.</p>
<h2>Switching and special termination</h2>
<p>To leave AOK Rheinland/Hamburg, apply to the new fund. Membership ends at the end of the month after next, and the old rate applies until then. If the fund raises its additional rate, you can switch until the end of the month of the rise, even without twelve months of membership. The ${h.a('krankenkasse-wechseln', 'deadline calculator')} works out the date.</p>
<p>For the self-employed in the Rhineland or Hamburg the additional rate is the biggest moving part: they carry it alone and pay ${h.eur(p.selbst)} a month today on ${h.eur(BEISPIEL.gewinn)} of profit. Pensioners pay only half the rate, since the pension insurance takes the other half, and see a change two months later on the pension statement. Students pay on the fixed BAföG need rate of ${h.eur(w.bafoeg_bedarf)}; for them the funds are only a few euros a year apart.</p>`,
  },
});
