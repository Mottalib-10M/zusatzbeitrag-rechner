import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { KASSEN, LAND_NAME } from '../../lib/engine/kassen';
import { angestellt } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** Sachsen-Anhalt: eigene AOK nur für dieses Land; Pendler nach Sachsen (Pflege-Sonderregel am Arbeitsort). Zahlen aus Liste und Motor. */
const p = landProfil('ST');
const sn = landProfil('SN');
const w = J(2026);
const aok = p.aok!;
const top = p.r.slice(0, 5).map(kostenZeile);
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const vorAok = p.r.filter((k) => k.zb! < aok.zb!);
const pvSt = angestellt({ brutto: BEISPIEL.lohn, zb: aok.zb!, jahr: 2026, eltern: 'k1' }).pv.mitglied;
const pvSn = angestellt({ brutto: BEISPIEL.lohn, zb: aok.zb!, jahr: 2026, sachsen: true, eltern: 'k1' }).pv.mitglied;
const mehrSachsen = Math.round((pvSn - pvSt) * 12);
const zuSn = sn.r.filter((k) => !p.r.some((x) => x.id === k.id));

export default defineGuide({
  id: 'guenstigste-krankenkasse-sachsen-anhalt',
  group: 'laender',
  order: 62,
  land: 'ST',
  tool: 'beitrag',
  toolPreset: { land: 'ST', kasse: aok.id },
  related: ['guenstigste-krankenkasse-sachsen', 'guenstigste-krankenkasse-thueringen', 'guenstigste-krankenkasse-niedersachsen', 'zusatzbeitrag-liste', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_175', 'sgb11_58'],
  de: {
    slug: 'guenstigste-krankenkasse-sachsen-anhalt',
    nav: 'Sachsen-Anhalt',
    card: `${p.n} Kassen wählbar, ab ${DE.pk(p.billig.zb!)}; die AOK Sachsen-Anhalt liegt mit ${DE.pk(aok.zb!)} auf Rang ${p.aokRang}.`,
    title: 'Günstigste Krankenkasse Sachsen-Anhalt 2027: Kassen in Euro',
    description: `Günstigste Krankenkasse in Sachsen-Anhalt 2026/2027: alle wählbaren Kassen von ${DE.pk(p.billig.zb!)} bis ${DE.pk(p.teuer.zb!)}, Ihr Beitrag in Euro, die AOK und Pendler nach Sachsen.`,
    h1: 'Günstigste Krankenkasse in Sachsen-Anhalt: alle wählbaren Kassen',
    intro: `In Sachsen-Anhalt sind ${p.n} Kassen wählbar; die eigene AOK verlangt ${DE.pk(aok.zb!)} und liegt auf Rang ${p.aokRang}.`,
    resume: `Wer in Sachsen-Anhalt wohnt oder arbeitet, kann laut Liste des GKV-Spitzenverbands zwischen ${p.n} gesetzlichen Krankenkassen wählen: ${p.bund.length} bundesweit geöffneten und ${p.regional.length} mit regionaler Öffnung. Anders als ihre Nachbarn in Sachsen und Thüringen, die sich die AOK PLUS teilen, hat das Land eine eigene Ortskrankenkasse, die AOK Sachsen-Anhalt, mit einem Zusatzbeitrag von ${DE.pk(aok.zb!)}; unter den ${aoks.length} AOKs ist das der ${aokPlatz}. niedrigste Satz. In der Rangliste des Landes steht sie auf Rang ${p.aokRang}, ${vorAok.length ? `hinter ${vorAok.length === 1 ? 'einer Kasse' : `${vorAok.length} Kassen`} mit niedrigerem Satz` : 'ganz vorn'}. Die günstigste wählbare Kasse ist ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, die teuerste ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind liegen zwischen beiden ${DE.eur(p.spanneJahr)} im Jahr. Wer in Sachsen-Anhalt wohnt, aber in Sachsen arbeitet, zahlt einen etwas höheren Pflegeanteil, weil dafür der Arbeitsort zählt.`,
    faqs: [
      { q: 'Welche Krankenkasse ist in Sachsen-Anhalt am günstigsten?', a: `Nach dem Zusatzbeitrag ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, danach ${top.slice(1, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlen Sie bei der günstigsten ${DE.eur(p.lohnBillig)} im Monat für Kranken- und Pflegeversicherung. Ob Service und Satzungsleistungen passen, zeigt nur die Kasse selbst.` },
      { q: 'Ich wohne in Sachsen-Anhalt und arbeite in Leipzig. Was ändert sich?', a: `Für die Pflegeversicherung zählt der Beschäftigungsort: Wer in Sachsen arbeitet, trägt ${DE.num(w.pv_sachsen_an_mehr, 1)} Punkte mehr Pflegebeitrag als Kollegen in Halle, bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(mehrSachsen)} im Jahr (§ 58 Abs. 3 SGB XI). Außerdem stehen Ihnen über den Arbeitsort die sächsischen Kassen offen, darunter die AOK PLUS.` },
      { q: 'Ist die AOK Sachsen-Anhalt teurer als die AOK PLUS?', a: `Die AOK Sachsen-Anhalt verlangt ${DE.pk(aok.zb!)}, die AOK PLUS für Sachsen und Thüringen ${DE.pk(sn.aok!.zb!)}. ${aok.zb! < sn.aok!.zb! ? 'Die Kasse in Sachsen-Anhalt ist also günstiger.' : aok.zb! > sn.aok!.zb! ? 'Die AOK PLUS ist also günstiger, wählbar aber nur mit Wohn- oder Arbeitsort in Sachsen oder Thüringen.' : 'Beide verlangen also denselben Satz.'} Der Unterschied betrifft nur den Zusatzbeitrag; Leistungen nach dem SGB V sind bei beiden AOKs gleich, und für die Wahl zählt allein Ihr Wohn- oder Arbeitsort.` },
      { q: 'Was zahlen Rentner in Sachsen-Anhalt bei der AOK?', a: `Bei ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente und einem Kind ${DE.eur(kostenZeile(aok).rente)} im Monat für Kranken- und Pflegeversicherung. Die Rentenversicherung übernimmt die Hälfte des Krankenkassenbeitrags, die Pflege tragen Rentner allein. Eine Änderung des Zusatzbeitrags wirkt bei der Rente erst zwei Monate später.` },
    ],
    body: (h) => `
<h2>Eine eigene AOK zwischen zwei Nachbarn</h2>
<p>Die AOK Sachsen-Anhalt ist nur für dieses Land zuständig, während Sachsen und Thüringen eine gemeinsame AOK haben. Für Versicherte heißt das: Wer in Magdeburg oder Halle wohnt und arbeitet, hat genau eine Ortskrankenkasse zur Wahl, dazu die bundesweiten und die regional geöffneten Kassen. ${zuSn.length ? `Wer zusätzlich in Sachsen arbeitet, gewinnt ${zuSn.length} weitere Kassen hinzu, darunter ${zuSn.slice(0, 3).map((k) => k.kurz).join(', ')}.` : ''}</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} ${x.k.laender.length === 1 ? 'Land' : 'Länder'}`]), `Die fünf günstigsten in Sachsen-Anhalt, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Pendeln nach Sachsen: der Pflegebeitrag folgt dem Arbeitsort</h2>
<p>Sachsen hat 1995 als einziges Land keinen Feiertag zur Finanzierung der Pflegeversicherung gestrichen; dafür tragen dort Beschäftigte ${h.num(w.pv_sachsen_an_mehr, 1)} Punkte mehr des Pflegebeitrags, Arbeitgeber entsprechend weniger. Maßgeblich ist der Beschäftigungsort, nicht der Wohnort. Ein Pendler aus ${LAND_NAME.ST.de} mit ${h.eur(BEISPIEL.lohn)} brutto zahlt deshalb ${h.eur(pvSn)} statt ${h.eur(pvSt)} Pflegebeitrag im Monat. Mit der Wahl der Krankenkasse hat das nichts zu tun: Es gilt bei jeder Kasse gleich.</p>
<h2>Selbstständige, Rentner, Studierende</h2>
<p>Die Rangliste gilt für alle Gruppen, nur das Gewicht des Zusatzbeitrags unterscheidet sich. Selbstständige tragen ihn ganz und sparen beim Wechsel doppelt so viel wie Beschäftigte. Rentner zahlen die Hälfte, die Rentenversicherung den Rest. Studierende in Halle oder Magdeburg zahlen auf den festen BAföG-Bedarf von ${h.eur(w.bafoeg_bedarf)} und damit auf eine kleine Grundlage; für sie macht der Wechsel nur wenige Euro im Monat aus. Stellen Sie im Rechner oben Ihre Lage ein, um die Beträge für alle Kassen im Land zu sehen.</p>
<h2>Wann sich ein Wechsel lohnt</h2>
<p>Wer bei einer Kasse am oberen Ende der Liste versichert ist, spart mit dem Wechsel zur günstigsten bis zu ${h.eur(p.spanneJahr)} im Jahr, an der Beitragsbemessungsgrenze ${h.eur(p.spanneJahrBbg)}. Für Selbstständige verdoppelt sich der Betrag. AOK-Mitglieder liegen ${h.eur(p.aokVsBillig)} im Jahr über der günstigsten Kasse. Die Fristen: zwölf Monate Bindung, Wechsel zum übernächsten Monat, nach einer Erhöhung sofort (${h.a('krankenkasse-wechseln', 'Wechsel rechnen')}). Alle Kassen mit Filter nach Land: ${h.a('zusatzbeitrag-liste', 'vollständige Liste')}.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-saxony-anhalt',
    nav: 'Saxony-Anhalt',
    card: `${p.n} funds open, from ${EN.pk(p.billig.zb!)}; AOK Sachsen-Anhalt ranks ${p.aokRang} at ${EN.pk(aok.zb!)}.`,
    title: 'Cheapest Health Insurance Saxony-Anhalt 2027: Fund Costs',
    description: `Cheapest statutory health fund in Saxony-Anhalt 2026/2027: every fund open to you from ${EN.pk(p.billig.zb!)} to ${EN.pk(p.teuer.zb!)}, your cost in euros, the AOK, commuting to Saxony.`,
    h1: 'Cheapest health insurance in Saxony-Anhalt: every fund you can join',
    intro: `In Saxony-Anhalt ${p.n} funds are open to you; the state’s own AOK charges ${EN.pk(aok.zb!)} and ranks ${p.aokRang}.`,
    resume: `If you live or work in Saxony-Anhalt (Sachsen-Anhalt), the GKV-Spitzenverband list gives you ${p.n} statutory health funds to choose from: ${p.bund.length} open nationwide and ${p.regional.length} opened regionally. Unlike its neighbours Saxony and Thuringia, which share AOK PLUS, the state has a regional fund of its own, AOK Sachsen-Anhalt, with an additional contribution (Zusatzbeitrag) of ${EN.pk(aok.zb!)}; among the ${aoks.length} AOKs that is the ${['', 'lowest', 'second-lowest', 'third-lowest'][aokPlatz] ?? `${aokPlatz}th-lowest`} rate. In the state’s ranking it is number ${p.aokRang}, ${vorAok.length ? `behind ${vorAok.length === 1 ? 'one fund' : `${vorAok.length} funds`} with a lower rate` : 'at the very top'}. The cheapest open fund is ${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, the dearest ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child they are ${EN.eur(p.spanneJahr)} a year apart. If you live in Saxony-Anhalt but work in Saxony, your care contribution share is slightly higher, because the workplace decides.`,
    faqs: [
      { q: 'Which health fund is cheapest in Saxony-Anhalt?', a: `By additional rate, ${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, then ${top.slice(1, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross with one child you pay ${EN.eur(p.lohnBillig)} a month at the cheapest for health and care insurance. Whether its service and extra benefits suit you, only the fund itself can tell you.` },
      { q: 'I live in Saxony-Anhalt and work in Leipzig. What changes?', a: `For care insurance the workplace counts: working in Saxony, you pay ${EN.num(w.pv_sachsen_an_mehr, 1)} points more care contribution than colleagues in Halle, ${EN.eur(mehrSachsen)} a year on ${EN.eur(BEISPIEL.lohn)} gross (section 58(3) SGB XI). Through your workplace the Saxon funds also become open to you, including AOK PLUS.` },
      { q: 'Is AOK Sachsen-Anhalt dearer than AOK PLUS?', a: `AOK Sachsen-Anhalt charges ${EN.pk(aok.zb!)}, AOK PLUS for Saxony and Thuringia ${EN.pk(sn.aok!.zb!)}. ${aok.zb! < sn.aok!.zb! ? 'So the Saxony-Anhalt fund is cheaper.' : aok.zb! > sn.aok!.zb! ? 'So AOK PLUS is cheaper, but you can only join it if you live or work in Saxony or Thuringia.' : 'So both charge the same rate.'} The difference is only in the additional rate; benefits under Book V of the Social Code are the same at both AOKs, and only your home or workplace decides which you can join.` },
      { q: 'What do pensioners in Saxony-Anhalt pay at the AOK?', a: `On a ${EN.eur(BEISPIEL.rente)} state pension with one child, ${EN.eur(kostenZeile(aok).rente)} a month for health and care insurance. The pension insurance pays half the health contribution; pensioners pay care insurance alone. A change in the additional rate reaches the pension two months later.` },
    ],
    body: (h) => `
<h2>Its own AOK between two neighbours</h2>
<p>AOK Sachsen-Anhalt covers only this state, while Saxony and Thuringia share one AOK. For members that means: if you live and work in Magdeburg or Halle, you have exactly one regional AOK to choose, plus the nationwide and regionally opened funds. ${zuSn.length ? `If you also work in Saxony, you gain ${zuSn.length} more funds, including ${zuSn.slice(0, 3).map((k) => k.kurz).join(', ')}.` : ''}</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} ${x.k.laender.length === 1 ? 'state' : 'states'}`]), `The five cheapest in Saxony-Anhalt, ${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Commuting to Saxony: care contributions follow the workplace</h2>
<p>In 1995 Saxony was the only state not to abolish a public holiday to fund long-term care insurance; in return, employees there pay ${h.num(w.pv_sachsen_an_mehr, 1)} points more of the care contribution and employers that much less. The place of work counts, not the home. A commuter from ${LAND_NAME.ST.en} on ${h.eur(BEISPIEL.lohn)} gross therefore pays ${h.eur(pvSn)} instead of ${h.eur(pvSt)} care contribution a month. This has nothing to do with the choice of fund: it is the same at every fund.</p>
<h2>The self-employed, pensioners, students</h2>
<p>The ranking holds for every group; only the weight of the additional rate differs. The self-employed carry all of it and save twice as much as employees when they switch. Pensioners pay half, the pension insurance the rest. Students in Halle or Magdeburg pay on the fixed BAföG need rate of ${h.eur(w.bafoeg_bedarf)}, a small base, so switching changes only a few euros a month for them. Set your situation in the calculator above to see the amounts at every fund in the state.</p>
<h2>When switching pays</h2>
<p>If you are with a fund near the top of the list, moving to the cheapest saves up to ${h.eur(p.spanneJahr)} a year, ${h.eur(p.spanneJahrBbg)} at the contribution ceiling. For the self-employed the figure doubles. AOK members pay ${h.eur(p.aokVsBillig)} a year more than at the cheapest fund. The deadlines: twelve months’ lock-in, switch to the month after next, immediately after a rate rise (${h.a('krankenkasse-wechseln', 'work out the dates')}). Every fund filtered by state: ${h.a('zusatzbeitrag-liste', 'full list')}.</p>`,
  },
});
