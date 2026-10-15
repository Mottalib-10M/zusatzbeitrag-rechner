import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { rangliste, LAND_NAME } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** Saarland: kleinstes Flächenland, gemeinsame AOK mit Rheinland-Pfalz; Pendler nach Rheinland-Pfalz. Zahlen aus Liste und Motor. */
const p = landProfil('SL');
const rp = landProfil('RP');
const w = J(2026);
const aok = p.aok!;
const top = p.r.slice(0, 5).map(kostenZeile);
const aokVorn = p.aokRang === 1;
const nurInRp = rangliste('RP').filter((k) => !p.r.some((x) => x.id === k.id));
const nurInSl = p.r.filter((k) => !rangliste('RP').some((x) => x.id === k.id));
const aokJahrVsTeuer = Math.round((kostenZeile(p.teuer).lohn - kostenZeile(aok).lohn) * 12);
const regionalNamenDe = p.regional.filter((k) => k.id !== aok.id).slice(0, 6).map((k) => k.kurz).join(', ');

export default defineGuide({
  id: 'guenstigste-krankenkasse-saarland',
  group: 'laender',
  order: 61,
  land: 'SL',
  tool: 'beitrag',
  toolPreset: { land: 'SL', kasse: aok.id },
  related: ['guenstigste-krankenkasse-rheinland-pfalz', 'zusatzbeitrag-liste', 'krankenkasse-wechseln', 'beste-krankenkasse'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_242'],
  de: {
    slug: 'guenstigste-krankenkasse-saarland',
    nav: 'Saarland',
    card: `${p.n} Kassen wählbar; ${aokVorn ? `die AOK ist mit ${DE.pk(aok.zb!)} die günstigste` : `günstigste ab ${DE.pk(p.billig.zb!)}`}.`,
    title: 'Günstigste Krankenkasse Saarland 2027: alle Kassen in Euro',
    description: `Günstigste Krankenkasse im Saarland 2026/2027: alle wählbaren Kassen von ${DE.pk(p.billig.zb!)} bis ${DE.pk(p.teuer.zb!)} Zusatzbeitrag, Ihr eigener Beitrag in Euro, die AOK im Vergleich.`,
    h1: 'Günstigste Krankenkasse im Saarland: alle wählbaren Kassen',
    intro: `Im Saarland stehen Ihnen ${p.n} Kassen offen; ${aokVorn ? `an der Spitze steht die eigene AOK mit ${DE.pk(aok.zb!)}` : `die günstigste ist ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}`}.`,
    resume: `Wer im Saarland wohnt oder arbeitet, kann laut Liste des GKV-Spitzenverbands zwischen ${p.n} gesetzlichen Krankenkassen wählen, ${p.bund.length} davon bundesweit geöffnet und ${p.regional.length} mit regionaler Öffnung. Die Ortskrankenkasse teilt sich das Saarland mit Rheinland-Pfalz: die ${aok.kurz} mit einem Zusatzbeitrag von ${DE.pk(aok.zb!)}. ${aokVorn ? 'Sie ist damit die günstigste Kasse, die Saarländer wählen können, ein Fall, der unter den 16 Ländern selten ist.' : `Sie steht auf Rang ${p.aokRang}; günstiger ist ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}.`} Am anderen Ende steht ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlen Sie zwischen ${DE.eur(p.lohnBillig)} und ${DE.eur(p.lohnTeuer)} im Monat für Kranken- und Pflegeversicherung, ein Unterschied von ${DE.eur(p.spanneJahr)} im Jahr, an der Beitragsbemessungsgrenze ${DE.eur(p.spanneJahrBbg)}. Pflegebeitrag und Arbeitgeberanteil folgen den bundesweiten Regeln; die Sonderteilung des Pflegebeitrags gilt nur in Sachsen, nicht im Saarland.`,
    faqs: [
      { q: 'Welche ist die günstigste Krankenkasse im Saarland?', a: `Nach dem Zusatzbeitrag ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, gefolgt von ${top.slice(1, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie bei der günstigsten ${DE.eur(p.lohnBillig)} im Monat für Kranken- und Pflegeversicherung, Ihr Arbeitgeber noch einmal etwa so viel.` },
      { q: 'Kann ich als Saarländer eine Kasse aus Rheinland-Pfalz wählen?', a: `Die AOK ist ohnehin dieselbe. Andere Kassen, die nur für Rheinland-Pfalz geöffnet sind, können Sie wählen, wenn Sie dort arbeiten. Laut Liste sind das ${nurInRp.length ? nurInRp.map((k) => k.kurz).join(', ') : 'derzeit keine'}; umgekehrt ${nurInSl.length ? `stehen ${nurInSl.map((k) => k.kurz).join(', ')} nur im Saarland offen` : 'gibt es keine Kasse, die nur im Saarland offen ist'}.` },
      { q: 'Lohnt sich ein Wechsel, wenn ich schon bei der AOK bin?', a: `${aokVorn ? 'Beim Preis nicht: Keine im Saarland wählbare Kasse ist günstiger.' : `Kaum: Der Abstand zur günstigsten wählbaren Kasse beträgt bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(p.aokVsBillig)} im Jahr.`} Ein Wechsel kann sich trotzdem lohnen, wenn eine andere Kasse eine Leistung anbietet, die Sie regelmäßig brauchen; das steht in der Satzung, nicht im Zusatzbeitrag. Die Fristen sind dieselben wie überall.` },
      { q: 'Was zahlen Rentner im Saarland bei der AOK?', a: `Bei ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente und einem Kind etwa ${DE.eur(kostenZeile(aok).rente)} im Monat für Kranken- und Pflegeversicherung, weil die Rentenversicherung die Hälfte des Krankenkassenbeitrags trägt. Die Pflege zahlen Rentner allein. Ein neuer Zusatzbeitrag wird erst ab dem zweiten Monat nach der Änderung von der Rente abgezogen.` },
    ],
    body: (h) => `
<h2>Ein kleines Land mit eigener Rangliste</h2>
<p>Das Saarland teilt sich die Ortskrankenkasse mit Rheinland-Pfalz, aber nicht die ganze Liste: Welche Betriebs- und Innungskrankenkassen geöffnet sind, entscheidet jede Kasse Land für Land. Deshalb sind im Saarland ${p.n} Kassen wählbar, in Rheinland-Pfalz ${rp.n}. Zu den regional geöffneten Kassen, die Saarländer wählen können, gehören ${regionalNamenDe || 'nur wenige'}. Für Pendler zählt zusätzlich das Land des Arbeitsorts, auch wenn Sie dort nicht wohnen: Wer in Kaiserslautern oder Trier arbeitet, kann die Kassen beider Länder wählen.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} ${x.k.laender.length === 1 ? 'Land' : 'Länder'}`]), `Die fünf günstigsten, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Die AOK als Maßstab</h2>
<p>Mit ${h.pk(aok.zb!)} liegt die ${aok.kurz} ${aok.zb! < w.zb_durchschnitt ? 'unter' : 'über'} dem amtlichen Durchschnitt von ${h.pz(w.zb_durchschnitt)}. Wer bei der teuersten wählbaren Kasse versichert ist, ${p.teuer.kurz}, zahlt bei ${h.eur(BEISPIEL.lohn)} brutto ${h.eur(aokJahrVsTeuer)} im Jahr mehr als bei der AOK. Für Selbstständige verdoppelt sich dieser Betrag, weil sie den Zusatzbeitrag allein tragen; für Rentner bleibt er gleich groß wie für Beschäftigte, weil die Rentenversicherung die Hälfte übernimmt.</p>
<h2>Selbstständige und Studierende</h2>
<p>Wer im Saarland selbstständig ist, trägt den Zusatzbeitrag allein und spürt die Rangliste deshalb doppelt: Bei ${h.eur(BEISPIEL.gewinn)} Gewinn liegen zwischen der günstigsten und der teuersten wählbaren Kasse rund ${h.eur(Math.round((p.teuer.zb! - p.billig.zb!) * BEISPIEL.gewinn / 100 * 12))} im Jahr. Studierende in Saarbrücken zahlen den festen Studentenbeitrag auf den BAföG-Bedarf; auch dort entscheidet allein der Zusatzbeitrag, welche Kasse günstiger ist. Der Rechner oben schaltet zwischen diesen Lagen um und zeigt für jede den Betrag bei allen im Saarland wählbaren Kassen.</p>
<h2>Grenzgänger aus Frankreich</h2>
<p>Wer in Frankreich wohnt und im Saarland beschäftigt ist, ist in der Regel in Deutschland gesetzlich versichert und kann eine der hier geöffneten Kassen wählen; maßgeblich ist der Arbeitsort. Für Familienangehörige in Frankreich und Behandlungen dort gelten europäische Sonderregeln, über die die gewählte Kasse informiert. Der Beitrag selbst rechnet sich genauso wie für alle Beschäftigten (${h.a('krankenkasse-wechseln', 'Wechsel rechnen')}, ${h.a('zusatzbeitrag-liste', 'alle Kassen')}).</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-saarland',
    nav: 'Saarland',
    card: `${p.n} funds open; ${aokVorn ? `the AOK is cheapest at ${EN.pk(aok.zb!)}` : `cheapest from ${EN.pk(p.billig.zb!)}`}.`,
    title: 'Cheapest Health Insurance Saarland 2027: Every Fund in Euros',
    description: `Cheapest statutory health fund in Saarland for 2026/2027: every fund open to you from ${EN.pk(p.billig.zb!)} to ${EN.pk(p.teuer.zb!)} additional rate, cost in euros, the AOK compared.`,
    h1: 'Cheapest health insurance in Saarland: every fund you can join',
    intro: `In Saarland ${p.n} funds are open to you; ${aokVorn ? `the regional AOK leads at ${EN.pk(aok.zb!)}` : `the cheapest is ${p.billig.kurz} at ${EN.pk(p.billig.zb!)}`}.`,
    resume: `If you live or work in Saarland, the GKV-Spitzenverband list gives you ${p.n} statutory health funds to choose from, ${p.bund.length} open nationwide and ${p.regional.length} opened regionally. Saarland shares its regional fund with Rhineland-Palatinate: ${aok.kurz}, with an additional contribution (Zusatzbeitrag) of ${EN.pk(aok.zb!)}. ${aokVorn ? 'That makes it the cheapest fund people in Saarland can join, which is rare among the 16 states.' : `It ranks ${p.aokRang}; ${p.billig.kurz} is cheaper at ${EN.pk(p.billig.zb!)}.`} At the other end is ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child you pay between ${EN.eur(p.lohnBillig)} and ${EN.eur(p.lohnTeuer)} a month for health and care insurance, a gap of ${EN.eur(p.spanneJahr)} a year and ${EN.eur(p.spanneJahrBbg)} at the contribution ceiling. Care contributions and the employer share follow the national rules; the special split of care contributions applies only in Saxony, not in Saarland.`,
    faqs: [
      { q: 'Which is the cheapest health fund in Saarland?', a: `By additional rate, ${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, followed by ${top.slice(1, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohnBillig)} a month at the cheapest for health and care insurance, and your employer about as much again.` },
      { q: 'Can I join a fund from Rhineland-Palatinate while living in Saarland?', a: `The AOK is the same one anyway. Other funds open only in Rhineland-Palatinate are available to you if you work there. According to the list these are ${nurInRp.length ? nurInRp.map((k) => k.kurz).join(', ') : 'currently none'}; conversely, ${nurInSl.length ? `${nurInSl.map((k) => k.kurz).join(', ')} are open only in Saarland` : 'no fund is open only in Saarland'}.` },
      { q: 'Is switching worth it if I am already with the AOK?', a: `${aokVorn ? 'Not on price: no fund open in Saarland is cheaper.' : `Hardly: on ${EN.eur(BEISPIEL.lohn)} gross the gap to the cheapest open fund is ${EN.eur(p.aokVsBillig)} a year.`} Switching can still make sense if another fund offers a benefit you use regularly; that is in its statutes, not its additional rate. The deadlines are the same as everywhere.` },
      { q: 'What do pensioners in Saarland pay at the AOK?', a: `On a ${EN.eur(BEISPIEL.rente)} state pension with one child, about ${EN.eur(kostenZeile(aok).rente)} a month for health and care insurance, because the pension insurance pays half the health contribution. Pensioners pay care insurance alone. A new additional rate is deducted from the pension only from the second month after the change.` },
    ],
    body: (h) => `
<h2>A small state with its own ranking</h2>
<p>Saarland shares its regional AOK with Rhineland-Palatinate, but not the whole list: each company and guild fund decides state by state where it opens. So ${p.n} funds are open in Saarland and ${rp.n} in Rhineland-Palatinate. The regionally opened funds people in Saarland can join include ${regionalNamenDe || 'only a few'}. For commuters the state of the workplace counts too: someone working in Kaiserslautern or Trier can choose the funds of both states.</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} ${x.k.laender.length === 1 ? 'state' : 'states'}`]), `The five cheapest, ${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>The AOK as the benchmark</h2>
<p>At ${h.pk(aok.zb!)}, ${aok.kurz} sits ${aok.zb! < w.zb_durchschnitt ? 'below' : 'above'} the official average of ${h.pz(w.zb_durchschnitt)}. Someone insured with the dearest fund open here, ${p.teuer.kurz}, pays ${h.eur(aokJahrVsTeuer)} a year more on ${h.eur(BEISPIEL.lohn)} gross than at the AOK. For the self-employed that doubles, because they carry the whole additional rate; for pensioners it is the same as for employees, because the pension insurance pays half.</p>
<h2>The self-employed and students</h2>
<p>Self-employed people in Saarland carry the additional rate alone and so feel the ranking twice over: on ${h.eur(BEISPIEL.gewinn)} profit the cheapest and dearest open funds are about ${h.eur(Math.round((p.teuer.zb! - p.billig.zb!) * BEISPIEL.gewinn / 100 * 12))} a year apart. Students in Saarbrücken pay the fixed student contribution on the BAföG need rate; there too only the additional rate decides which fund is cheaper. The calculator above switches between these situations and shows the amount at every fund open in Saarland for each of them.</p>
<h2>Cross-border workers from France</h2>
<p>If you live in France and work in Saarland, you are usually insured in Germany’s statutory system and can choose one of the funds open here; the workplace is what counts. European coordination rules apply to family members in France and to treatment there, and the chosen fund explains them. The contribution itself is worked out as for any employee (${h.a('krankenkasse-wechseln', 'work out the dates')}, ${h.a('zusatzbeitrag-liste', 'all funds')}).</p>`,
  },
});
