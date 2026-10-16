import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { KASSEN, rangliste, LAND_NAME } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';
import { angestellt } from '../../lib/engine/beitrag';

/** AOK Nordost: Berlin, Brandenburg, Mecklenburg-Vorpommern. Je Land: Rang, günstigste Alternative, Ersparnis. */
const ID = 'aok-nordost-die-gesundheitskasse';
const p = profil(ID);
const w = J(2026);
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < p.zb).length + 1;
const teuersteAok = aokPlatz === aoks.length && !aoks.some((k) => k.zb === p.zb && k.id !== ID);
const me = kostenZeile(p.k);
const proLand = p.raengeLand.map((r) => { const b = kostenZeile(rangliste(r.l)[0]); return { ...r, best: b.k, spar: Math.round((me.lohn - b.lohn) * 12) }; });
const billigsteAok = kostenZeile([...aoks].sort((a, b) => a.zb! - b.zb!)[0]);
const abstandAok = Math.round((me.lohn - billigsteAok.lohn) * 12);
const w27 = J(2027);
const max26 = angestellt({ brutto: w.bbgKv, zb: p.zb, jahr: 2026, eltern: 'k1' }).selbst;
const max27 = angestellt({ brutto: w27.bbgKv, zb: p.zb, jahr: 2027, eltern: 'k1' }).selbst;
const ordEn = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;
const listeDe = proLand.map((x) => `${LAND_NAME[x.l].de} Rang ${x.rang} von ${x.n}`).join(', ');
const listeEn = proLand.map((x) => `${LAND_NAME[x.l].en} rank ${x.rang} of ${x.n}`).join(', ');

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 18,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID, land: 'BE' },
  related: ['zusatzbeitrag-liste', 'krankenkasse-wechseln', 'aok-plus-die-gesundheitskasse-fur-sachsen-und-thuringen'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_175', 'sgb5_242a'],
  de: {
    slug: 'aok-nordost-zusatzbeitrag',
    nav: 'AOK Nordost',
    card: `${DE.pk(p.zb)} Zusatzbeitrag in Berlin, Brandenburg und Mecklenburg-Vorpommern; was ein Wechsel in jedem der drei Länder spart.`,
    title: 'AOK Nordost Zusatzbeitrag 2027: Berlin, Brandenburg, MV',
    description: `AOK Nordost, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Monatsbeitrag in Berlin, Brandenburg und Mecklenburg-Vorpommern, die günstigere Alternative in jedem Land, Fristen.`,
    h1: 'AOK Nordost: Zusatzbeitrag in Berlin, Brandenburg und MV',
    intro: `Die AOK Nordost verlangt ${DE.pk(p.zb)}${teuersteAok ? ', den höchsten Satz aller AOKs' : ''}; bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie ${DE.eur(p.lohn)} im Monat.`,
    resume: `Die AOK Nordost ist die Ortskrankenkasse für Berlin, Brandenburg und Mecklenburg-Vorpommern und laut Liste des GKV-Spitzenverbands in genau diesen drei Ländern geöffnet. Ihr Zusatzbeitrag beträgt ${DE.pk(p.zb)}; ${teuersteAok ? `kein anderes der ${aoks.length} AOKs verlangt mehr` : `unter den ${aoks.length} AOKs steht sie auf Platz ${aokPlatz}`}. Für ein Mitglied mit ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind bedeutet das ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung, ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} im Jahr ${p.unterDurchschnitt ? 'weniger' : 'mehr'} als zum amtlichen Durchschnittssatz von ${DE.pz(w.zb_durchschnitt)}. In der Rangliste der wählbaren Kassen liegt sie so: ${listeDe}. Der mögliche Gewinn eines Wechsels unterscheidet sich je nach Land, weil nicht jede günstige Betriebskrankenkasse in allen drei Ländern geöffnet ist; in Berlin ist die Auswahl am größten. ${billigsteAok.k.id !== ID && !billigsteAok.k.laender.includes('BE') ? `Die Ortskrankenkasse mit dem niedrigsten Satz, ${billigsteAok.k.kurz}, wäre bei diesem Lohn ${DE.eur(abstandAok)} im Jahr billiger, ist für Berliner aber nicht wählbar.` : ''}`,
    faqs: [
      { q: 'Wie viel spare ich in Berlin, wenn ich die AOK Nordost verlasse?', a: (() => { const b = proLand.find((x) => x.l === 'BE')!; return `Die günstigste in Berlin wählbare Kasse ist ${b.best.kurz} mit ${DE.pk(b.best.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie dort ${DE.eur(b.spar)} im Jahr weniger als bei der AOK Nordost, mit höherem Gehalt bis zur Bemessungsgrenze entsprechend mehr. ${b.n} Kassen stehen Berlinern offen.`; })() },
      { q: 'Und in Brandenburg oder Mecklenburg-Vorpommern?', a: (() => { const bb = proLand.find((x) => x.l === 'BB')!, mv = proLand.find((x) => x.l === 'MV')!; return `In Brandenburg führt ${bb.best.kurz} (${DE.pk(bb.best.zb!)}) die Rangliste an, in Mecklenburg-Vorpommern ${mv.best.kurz} (${DE.pk(mv.best.zb!)}). Gegenüber der AOK Nordost sind das bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(bb.spar)} beziehungsweise ${DE.eur(mv.spar)} im Jahr. Dort sind weniger Kassen geöffnet als in Berlin, die Auswahl bleibt aber groß genug für einen Vergleich.`; })() },
      { q: 'Was bedeutet der Satz der AOK Nordost für Rentner?', a: `Rentner zahlen nur die Hälfte des Zusatzbeitrags, die andere Hälfte trägt die Rentenversicherung. Bei ${DE.eur(BEISPIEL.rente)} Rente werden ${DE.eur(p.rente)} im Monat einbehalten, Pflege eingeschlossen. Ein Wechsel bringt Rentnern deshalb weniger als Beschäftigten mit hohem Lohn; er ist aber genauso einfach, die neue Kasse informiert die Rentenversicherung.` },
      { q: 'Kann ich nach einem Umzug nach Sachsen bei der AOK Nordost bleiben?', a: `Ja. Die Mitgliedschaft endet nicht, weil Sie das Gebiet verlassen; Sie können bleiben, bis Sie selbst wechseln. Neu eintreten könnten Sie ohne Wohnsitz oder Arbeitsplatz in Berlin, Brandenburg oder Mecklenburg-Vorpommern dagegen nicht. In Sachsen wäre dann auch die dortige Pflegeregel zu beachten, wenn Sie dort arbeiten.` },
    ],
    body: (h) => `
<h2>Drei Länder, drei verschiedene Ranglisten</h2>
<p>Die AOK Nordost erhebt in Berlin, in Brandenburg und in Mecklenburg-Vorpommern denselben Satz, doch die Konkurrenz ist nicht überall dieselbe. Regionale Betriebskrankenkassen öffnen sich oft nur für einzelne Länder; Berlin profitiert davon stärker als die Flächenländer im Nordosten. Die Tabelle zeigt für jedes der drei Länder den Platz der AOK, die dort günstigste wählbare Kasse und den Unterschied bei ${h.eur(BEISPIEL.lohn)} brutto mit einem Kind.</p>
${h.table(['Land', 'Rang der AOK Nordost', 'günstigste wählbare Kasse', 'Satz', 'weniger im Jahr'], proLand.map((x) => [LAND_NAME[x.l].de, `${x.rang} von ${x.n}`, kLink(h, x.best), h.pk(x.best.zb!), h.eur(x.spar)]), 'Liste des GKV-Spitzenverbands, Beträge aus dem Rechner', ['l', 'r', 'l', 'r', 'r'])}
<h2>Der Beitrag bei der AOK Nordost</h2>
${h.table(['Lage', 'Grundlage', 'Ihr Anteil im Monat'], [
  ['Beschäftigt', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Beschäftigt', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Beschäftigt, ab der Grenze', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studium', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, ein Kind; selbstständig ohne Krankengeld', ['l', 'r', 'r'])}
<p>Am stärksten trifft der Satz Selbstständige und Gutverdienende: Wer an der Beitragsbemessungsgrenze verdient, zahlt bei der günstigsten bundesweit wählbaren Kasse ${h.eur(p.proJahrVsBilligsteBbg)} im Jahr weniger. Studierende zahlen auf den festen BAföG-Bedarf und merken den Unterschied kaum.</p>
<h2>Was 2027 auf Gutverdienende zukommt</h2>
<p>Unabhängig davon, ob die AOK Nordost ihren Satz ändert, steigt 2027 die Beitragsbemessungsgrenze der Krankenversicherung auf ${h.eur(w27.bbgKv)} im Monat (Kabinettsbeschluss, Bundesrat ausstehend). Wer so viel oder mehr verdient, zahlt bei unverändertem Satz dann ${h.eur(max27)} statt ${h.eur(max26)} im Monat, also ${h.eur(Math.round((max27 - max26) * 12))} im Jahr mehr. In der Pflege bleibt die Grenze nach geltendem Recht niedriger. Der neue Satz der Kasse für 2027 erscheint in der amtlichen Liste erst am Tag, an dem er gilt; bis dahin rechnet der Rechner mit dem heutigen.</p>
<h2>Wechseln im Nordosten</h2>
<p>Die Rangliste für Berlin, Brandenburg und Mecklenburg-Vorpommern, mit jeder dort wählbaren Kasse, finden Sie in der ${h.a('zusatzbeitrag-liste', 'Kassenliste nach Bundesland')}. Den Termin des Wechsels rechnet der ${h.a('krankenkasse-wechseln', 'Fristenrechner')}; erhöht die AOK Nordost zum Jahreswechsel ihren Satz, gilt das Sonderkündigungsrecht unabhängig von der Mitgliedsdauer.</p>`,
  },
  en: {
    slug: 'aok-nordost-additional-contribution',
    nav: 'AOK Nordost',
    card: `${EN.pk(p.zb)} additional rate in Berlin, Brandenburg and Mecklenburg-Western Pomerania; what switching saves in each of the three.`,
    title: 'AOK Nordost Additional Contribution 2027: Berlin and the NE',
    description: `AOK Nordost additional rate in 2026: ${EN.pk(p.zb)}. Monthly cost in Berlin, Brandenburg and Mecklenburg-Western Pomerania, the cheaper option in each state, deadlines.`,
    h1: 'AOK Nordost: additional rate in Berlin, Brandenburg and MV',
    intro: `AOK Nordost charges ${EN.pk(p.zb)}${teuersteAok ? ', the highest rate of any AOK' : ''}; on ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohn)} a month.`,
    resume: `AOK Nordost is the regional health fund for Berlin, Brandenburg and Mecklenburg-Western Pomerania, and the GKV-Spitzenverband list shows it open in exactly those three states. Its additional contribution (Zusatzbeitrag) is ${EN.pk(p.zb)}; ${teuersteAok ? `none of the other ${aoks.length - 1} AOKs charges more` : `it ranks ${ordEn(aokPlatz)} of the ${aoks.length} AOKs`}. For a member on ${EN.eur(BEISPIEL.lohn)} gross with one child that means ${EN.eur(p.lohn)} a month for health and care insurance, ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} a year ${p.unterDurchschnitt ? 'less' : 'more'} than at the official average rate of ${EN.pz(w.zb_durchschnitt)}. In the rankings of funds open to the public it stands as follows: ${listeEn}. The possible gain from switching differs by state, because not every cheap company fund is open in all three; Berlin has the widest choice. ${billigsteAok.k.id !== ID && !billigsteAok.k.laender.includes('BE') ? `The AOK with the lowest rate, ${billigsteAok.k.kurz}, would be ${EN.eur(abstandAok)} a year cheaper at that pay, but Berliners cannot join it.` : ''}`,
    faqs: [
      { q: 'How much do I save in Berlin by leaving AOK Nordost?', a: (() => { const b = proLand.find((x) => x.l === 'BE')!; return `The cheapest fund open in Berlin is ${b.best.kurz} at ${EN.pk(b.best.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(b.spar)} a year less there than at AOK Nordost, and correspondingly more with higher pay up to the ceiling. ${b.n} funds are open to Berlin residents.`; })() },
      { q: 'And in Brandenburg or Mecklenburg-Western Pomerania?', a: (() => { const bb = proLand.find((x) => x.l === 'BB')!, mv = proLand.find((x) => x.l === 'MV')!; return `In Brandenburg ${bb.best.kurz} (${EN.pk(bb.best.zb!)}) tops the ranking, in Mecklenburg-Western Pomerania ${mv.best.kurz} (${EN.pk(mv.best.zb!)}). Compared with AOK Nordost that is ${EN.eur(bb.spar)} and ${EN.eur(mv.spar)} a year on ${EN.eur(BEISPIEL.lohn)} gross. Fewer funds are open there than in Berlin, though still enough for a real comparison.`; })() },
      { q: 'What does the AOK Nordost rate mean for pensioners?', a: `Pensioners pay only half of the additional rate; the pension insurance pays the other half. On a ${EN.eur(BEISPIEL.rente)} pension, ${EN.eur(p.rente)} a month is withheld, care included. Switching therefore brings pensioners less than high-earning employees, but it is just as simple: the new fund informs the pension insurance.` },
      { q: 'Can I stay with AOK Nordost after moving to Saxony?', a: `Yes. Membership does not end because you leave the area; you can stay until you switch yourself. You could not newly join without a home or job in Berlin, Brandenburg or Mecklenburg-Western Pomerania, though. If you then work in Saxony, the Saxon care insurance rule applies to you as well.` },
    ],
    body: (h) => `
<h2>Three states, three different rankings</h2>
<p>AOK Nordost charges the same rate in Berlin, Brandenburg and Mecklenburg-Western Pomerania, but the competition is not the same everywhere. Regional company funds often open to individual states only; Berlin benefits from this more than the rural north-east. The table shows, for each of the three states, the AOK’s position, the cheapest fund open there and the difference on ${h.eur(BEISPIEL.lohn)} gross with one child.</p>
${h.table(['State', 'AOK Nordost rank', 'cheapest open fund', 'Rate', 'less a year'], proLand.map((x) => [LAND_NAME[x.l].en, `${x.rang} of ${x.n}`, kLink(h, x.best), h.pk(x.best.zb!), h.eur(x.spar)]), 'GKV-Spitzenverband list, amounts from the calculator', ['l', 'r', 'l', 'r', 'r'])}
<h2>What AOK Nordost costs</h2>
${h.table(['Situation', 'Base', 'Your share a month'], [
  ['Employed', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employed', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employed, from the ceiling', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Retired', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, one child; self-employed without sick pay', ['l', 'r', 'r'])}
<p>The rate hits the self-employed and high earners hardest: anyone at the contribution ceiling pays ${h.eur(p.proJahrVsBilligsteBbg)} a year less at the cheapest nationwide fund. Students pay on the fixed BAföG need rate and barely notice the difference.</p>
<h2>What 2027 brings for higher earners</h2>
<p>Whether or not AOK Nordost changes its rate, the health insurance contribution ceiling rises to ${h.eur(w27.bbgKv)} a month in 2027 (cabinet decision, Bundesrat pending). Anyone earning that much or more will then pay ${h.eur(max27)} instead of ${h.eur(max26)} a month at an unchanged rate, ${h.eur(Math.round((max27 - max26) * 12))} more a year. For care insurance the ceiling stays lower under current law. The fund’s new 2027 rate appears in the official list only on the day it applies; until then the calculator uses today’s.</p>
<h2>Switching in the north-east</h2>
<p>The ranking for Berlin, Brandenburg and Mecklenburg-Western Pomerania is in the ${h.a('zusatzbeitrag-liste', 'fund list by state')}. The ${h.a('krankenkasse-wechseln', 'deadline calculator')} gives the switch date; if AOK Nordost raises its rate at the turn of the year, the special termination right applies however long you have been a member.</p>`,
  },
});
