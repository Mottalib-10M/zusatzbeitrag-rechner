import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN, kasse } from '../../lib/engine/kassen';
import { angestellt } from '../../lib/engine/beitrag';

/** Hamburg: Rangliste aus der Liste des GKV-Spitzenverbands; AOK Rheinland/Hamburg, Einpendler aus dem Umland. */
const p = landProfil('HH');
const sh = landProfil('SH');
const ni = landProfil('NI');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const hek = kasse('hek-hanseatische-krankenkasse');
const hekRang = p.r.filter((k) => k.zb! < hek.zb!).length + 1;
const nurHhVsSh = p.r.filter((k) => !sh.r.some((x) => x.id === k.id));
const hoch = angestellt({ brutto: 7000, zb: aok.zb!, jahr: 2026, eltern: 'kinderlos' }).selbst;
const hochBillig = angestellt({ brutto: 7000, zb: p.billig.zb!, jahr: 2026, eltern: 'kinderlos' }).selbst;
const hochDiff = Math.round((hoch - hochBillig) * 12);

export default defineGuide({
  id: 'guenstigste-krankenkasse-hamburg',
  group: 'laender',
  order: 55,
  land: 'HH',
  tool: 'beitrag',
  toolPreset: { land: 'HH', kasse: 'aok-rheinland-hamburg-die-gesundheitskasse' },
  related: ['aok-rheinland-hamburg-die-gesundheitskasse', 'hek-hanseatische-krankenkasse', 'guenstigste-krankenkasse-schleswig-holstein', 'guenstigste-krankenkasse-niedersachsen', 'zusatzbeitrag-liste'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_223', 'sgb5_242'],
  de: {
    slug: 'guenstigste-krankenkasse-hamburg',
    nav: 'Hamburg',
    card: `${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; die AOK Rheinland/Hamburg mit ${DE.pk(aok.zb!)} auf Platz ${p.aokRang}.`,
    title: 'Günstigste Krankenkasse Hamburg 2027: Beiträge aller Kassen',
    description: `Hamburg 2026/2027: jede wählbare Krankenkasse mit Zusatzbeitrag von ${DE.pk(p.billig.zb!)} bis ${DE.pk(p.teuer.zb!)} in Euro, AOK Rheinland/Hamburg, HEK und Einpendler aus dem Umland.`,
    h1: 'Günstigste Krankenkasse in Hamburg: alle Kassen in Euro',
    intro: `In Hamburg sind ${p.n} Kassen wählbar, ab ${DE.pk(p.billig.zb!)} bei ${p.billig.kurz}; die Ortskrankenkasse teilt sich die Stadt mit dem Rheinland.`,
    resume: `Wer in Hamburg wohnt oder arbeitet, kann laut GKV-Spitzenverband zwischen ${p.n} Krankenkassen wählen, ${p.bund.length} bundesweiten und ${p.regional.length} regional geöffneten. Die Spanne reicht von ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)} bis ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)} Zusatzbeitrag. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind sind das ${DE.eur(p.spanneJahr)} im Jahr; wer an der Beitragsbemessungsgrenze verdient, und das sind in Hamburg nicht wenige, spart bis zu ${DE.eur(p.spanneJahrBbg)}. Die Ortskrankenkasse der Stadt ist die AOK Rheinland/Hamburg, die zugleich den Rheinland-Teil Nordrhein-Westfalens versichert; ihr Satz von ${DE.pk(aok.zb!)} bringt sie auf Platz ${p.aokRang}. Weil der Arbeitsort für die Kassenwahl zählt, nutzen auch die vielen Einpendler aus Schleswig-Holstein und Niedersachsen die Hamburger Liste. Den Pflegebeitrag teilen Beschäftigte und Arbeitgeber hier hälftig. Wer neu in der Stadt ist, sieht in der Rangliste oben auf einen Blick, was jede Kasse für sein Gehalt kostet.`,
    faqs: [
      { q: 'Welche Krankenkasse ist in Hamburg am günstigsten?', a: `${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, danach ${top.slice(1, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Mit ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie bei ${p.billig.kurz} ${DE.eur(p.lohnBillig)} im Monat für Kranken- und Pflegeversicherung zusammen. Wie gut eine Kasse berät oder erstattet, zeigt der Satz nicht.` },
      { q: 'Warum heißt die Hamburger AOK „Rheinland/Hamburg“?', a: `Sie ist aus der Fusion der AOK Rheinland mit der AOK Hamburg entstanden und versichert seitdem beide Gebiete zum selben Zusatzbeitrag von ${DE.pk(aok.zb!)}. Unter den ${aoks.length} AOKs ist ihr Satz der ${aokPlatz}. niedrigste. In Hamburg ist sie die einzige AOK, in Nordrhein-Westfalen konkurriert sie mit der AOK NordWest.` },
      { q: 'Wo steht die HEK in der Hamburger Rangliste?', a: `Die HEK, Hanseatische Krankenkasse, verlangt ${DE.pk(hek.zb!)} und steht damit in Hamburg auf Platz ${hekRang} von ${p.n}. Sie ist bundesweit geöffnet, also nicht auf Hamburger beschränkt. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie dort ${DE.eur(kostenZeile(hek).lohn)} im Monat, Kranken- und Pflegeversicherung zusammen.` },
      { q: 'Ich verdiene 7.000 € brutto in Hamburg. Was bringt ein Wechsel?', a: `Über ${DE.eur(w.bbgKv, 2)} im Monat zählt nur die Beitragsbemessungsgrenze, der Unterschied zwischen zwei Kassen ist dort am größten. Kinderlos zahlen Sie bei der AOK Rheinland/Hamburg ${DE.eur(hoch)} und bei ${p.billig.kurz} ${DE.eur(hochBillig)} im Monat, ${DE.eur(hochDiff)} im Jahr weniger. Liegt Ihr Jahresgehalt über ${DE.eur(w.jaeg_jahr)}, bleiben Sie freiwillig gesetzlich versichert.` },
      { q: 'Ich wohne in Pinneberg und arbeite in Hamburg. Welche Liste gilt?', a: `Beide: die Liste Schleswig-Holsteins wegen des Wohnorts und die Hamburger wegen des Arbeitsplatzes. ${nurHhVsSh.length ? `Nur über Hamburg erreichbar sind etwa ${nurHhVsSh.slice(0, 3).map((k) => k.kurz).join(', ')}.` : 'Derzeit sind beide Listen gleich.'} Die Mitgliedschaft bleibt bestehen, auch wenn Sie später in Ihrem Wohnland arbeiten. Wählen Sie im Rechner oben beide Länder nacheinander, um die Ranglisten zu vergleichen.` },
    ],
    body: (h) => `
<h2>Die Stadt als Arbeitsmarkt der Region</h2>
<p>Für die Kassenwahl ist Hamburg größer als seine Stadtgrenzen. Wer im Umland wohnt und in der Stadt arbeitet, hat Zugriff auf die Hamburger Liste, und umgekehrt können Hamburger, die in ${h.a('guenstigste-krankenkasse-schleswig-holstein', 'Schleswig-Holstein')} oder ${h.a('guenstigste-krankenkasse-niedersachsen', 'Niedersachsen')} arbeiten, deren Kassen wählen. Ein Vergleich der Spitzen:</p>
${h.table(['Land', 'Günstigste Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat'], [
  ['Hamburg', kLink(h, p.billig), h.pk(p.billig.zb!), h.eur(p.lohnBillig)],
  ['Schleswig-Holstein', kLink(h, sh.billig), h.pk(sh.billig.zb!), h.eur(sh.lohnBillig)],
  ['Niedersachsen', kLink(h, ni.billig), h.pk(ni.billig.zb!), h.eur(ni.lohnBillig)],
], `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'l', 'r', 'r'])}
<h2>Die fünf günstigsten Kassen in Hamburg</h2>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Hohe Gehälter, große Unterschiede</h2>
<p>Der Zusatzbeitrag wächst mit dem Lohn bis zur Beitragsbemessungsgrenze von ${h.eur(w.bbgKv, 2)} im Monat. Darüber bleibt der Beitrag gleich, aber der Abstand zwischen zwei Kassen ist dort am größten. Wer mehr als ${h.eur(w.jaeg_jahr)} im Jahr verdient, ist nicht mehr pflichtversichert und kann privat gehen; bleibt er gesetzlich, zahlt der Arbeitgeber denselben Zuschuss wie zuvor. Für 2027 steigt die Grenze nach dem Kabinettsbeschluss auf ${h.eur(J(2027).bbgKv)} im Monat; den Unterschied zeigt der Rechner oben, wenn Sie 2027 wählen.</p>
<h2>Wechsel in Hamburg</h2>
<p>Neue Kasse wählen, die alte wird benachrichtigt, der Arbeitgeber bekommt die neue Kasse von Ihnen mitgeteilt. Wirksam wird der Wechsel zum übernächsten Monatsersten, nach zwölf Monaten Bindung oder sofort nach einer Erhöhung (${h.a('krankenkasse-wechseln', 'Termin rechnen')}). Wer neu aus dem Ausland nach Hamburg kommt und erstmals gesetzlich versichert wird, wählt ohne Bindungsfrist. Studierende an Hamburger Hochschulen zahlen auf den festen BAföG-Bedarf von ${h.eur(w.bafoeg_bedarf)}, Rentner den halben Satz auf ihre Rente; beide Fälle rechnet der Rechner oben, wenn Sie Ihre Lage umstellen.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-hamburg',
    nav: 'Hamburg',
    card: `${p.n} funds from ${EN.pk(p.billig.zb!)}; AOK Rheinland/Hamburg at ${EN.pk(aok.zb!)} ranks ${p.aokRang}.`,
    title: 'Cheapest Health Insurance Hamburg 2027: Every Fund Costed',
    description: `Hamburg 2026/2027: every health fund you can join, additional rates from ${EN.pk(p.billig.zb!)} to ${EN.pk(p.teuer.zb!)} in euros, AOK Rheinland/Hamburg, HEK and commuters from outside.`,
    h1: 'Cheapest health insurance in Hamburg: every fund in euros',
    intro: `In Hamburg ${p.n} funds are open, from ${EN.pk(p.billig.zb!)} at ${p.billig.kurz}; the regional AOK shares the city with the Rhineland.`,
    resume: `If you live or work in Hamburg, the GKV-Spitzenverband list offers ${p.n} statutory health funds, ${p.bund.length} nationwide and ${p.regional.length} regionally open. Additional rates run from ${p.billig.kurz} at ${EN.pk(p.billig.zb!)} to ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child that is ${EN.eur(p.spanneJahr)} a year; anyone earning at the contribution ceiling, not rare in Hamburg, saves up to ${EN.eur(p.spanneJahrBbg)}. The city’s regional fund is AOK Rheinland/Hamburg, which also covers the Rhineland part of North Rhine-Westphalia; its rate of ${EN.pk(aok.zb!)} places it ${p.aokRang}. Because your workplace counts when choosing a fund, the many commuters from Schleswig-Holstein and Lower Saxony can use the Hamburg list too. Employees and employers split care insurance in half here. For newcomers from abroad, the ranking in the calculator above is the quickest way to see what each fund really costs.`,
    faqs: [
      { q: 'Which health fund is cheapest in Hamburg?', a: `${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, then ${top.slice(1, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohnBillig)} a month at ${p.billig.kurz} for health and care insurance together. How well a fund advises or reimburses is not shown by its rate.` },
      { q: 'Why is Hamburg’s AOK called “Rheinland/Hamburg”?', a: `It was formed when AOK Rheinland merged with AOK Hamburg, and it has covered both areas at the same additional rate since then, now ${EN.pk(aok.zb!)}. Among the ${aoks.length} AOK funds its rate is number ${aokPlatz} from the bottom. In Hamburg it is the only AOK; in North Rhine-Westphalia it competes with AOK NordWest.` },
      { q: 'Where does HEK rank in Hamburg?', a: `HEK, the Hanseatische Krankenkasse, charges ${EN.pk(hek.zb!)}, placing it ${hekRang} of ${p.n} in Hamburg. It is open nationwide, not limited to Hamburg residents. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(kostenZeile(hek).lohn)} a month there, health and care insurance together, whatever state you live in.` },
      { q: 'I earn €7,000 gross in Hamburg. What would switching save?', a: `Above ${EN.eur(w.bbgKv, 2)} a month only the contribution ceiling counts, and that is where the gap between funds is widest. Without children you pay ${EN.eur(hoch)} a month at AOK Rheinland/Hamburg and ${EN.eur(hochBillig)} at ${p.billig.kurz}, ${EN.eur(hochDiff)} a year less. Earning over ${EN.eur(w.jaeg_jahr)} a year, you stay in statutory insurance as a voluntary member.` },
      { q: 'I live in Pinneberg and work in Hamburg. Which list applies?', a: `Both: Schleswig-Holstein’s list because of your home and Hamburg’s because of your job. ${nurHhVsSh.length ? `Reachable only through Hamburg are, for example, ${nurHhVsSh.slice(0, 3).map((k) => k.kurz).join(', ')}.` : 'At the moment both lists are the same.'} Membership continues even if you later work in your home state. Select each state in turn in the calculator above to compare the two rankings.` },
    ],
    body: (h) => `
<h2>The city as the region’s job market</h2>
<p>For choosing a fund, Hamburg is bigger than its city limits. People who live outside and work in the city can use the Hamburg list, and Hamburg residents working in ${h.a('guenstigste-krankenkasse-schleswig-holstein', 'Schleswig-Holstein')} or ${h.a('guenstigste-krankenkasse-niedersachsen', 'Lower Saxony')} can choose those states’ funds. The leaders compared:</p>
${h.table(['State', 'Cheapest fund', 'Additional rate', 'You pay a month'], [
  ['Hamburg', kLink(h, p.billig), h.pk(p.billig.zb!), h.eur(p.lohnBillig)],
  ['Schleswig-Holstein', kLink(h, sh.billig), h.pk(sh.billig.zb!), h.eur(sh.lohnBillig)],
  ['Lower Saxony', kLink(h, ni.billig), h.pk(ni.billig.zb!), h.eur(ni.lohnBillig)],
], `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'l', 'r', 'r'])}
<h2>The five cheapest funds in Hamburg</h2>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>High salaries, bigger gaps</h2>
<p>The additional rate grows with pay up to the contribution ceiling of ${h.eur(w.bbgKv, 2)} a month. Above it the contribution stays flat, but the gap between two funds is at its widest. If you earn more than ${h.eur(w.jaeg_jahr)} a year you are no longer compulsorily insured and may go private; if you stay statutory, your employer pays the same subsidy as before. For 2027 the ceiling rises to ${h.eur(J(2027).bbgKv)} a month under the cabinet decision; pick 2027 in the calculator above to see the effect.</p>
<h2>Switching in Hamburg</h2>
<p>Choose the new fund, the old one is notified, and you give your employer the new fund’s details. The switch takes effect on the first day of the month after next, after twelve months’ lock-in or straight after a rate rise (${h.a('krankenkasse-wechseln', 'work out the date')}). If you arrive from abroad and join statutory insurance for the first time, there is no lock-in to wait out.</p>`,
  },
});
