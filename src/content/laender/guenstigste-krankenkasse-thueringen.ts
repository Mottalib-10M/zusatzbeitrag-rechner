import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN } from '../../lib/engine/kassen';
import { angestellt } from '../../lib/engine/beitrag';

/** Thüringen: Rangliste aus der Liste des GKV-Spitzenverbands; Vergleich mit Sachsen (gleiche AOK, andere Pflegeteilung). */
const p = landProfil('TH');
const sn = landProfil('SN');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const firmusHier = p.r.some((k) => k.id === 'bkk-firmus');
const nurSn = sn.r.filter((k) => !p.r.some((x) => x.id === k.id));
const snBilligerDe = sn.billig.zb! < p.billig.zb!;
const arbeitTh = angestellt({ brutto: BEISPIEL.lohn, zb: aok.zb!, jahr: 2026, sachsen: false, eltern: 'k1' });
const arbeitSn = angestellt({ brutto: BEISPIEL.lohn, zb: aok.zb!, jahr: 2026, sachsen: true, eltern: 'k1' });
const pendelJahr = Math.round((arbeitSn.pv.mitglied - arbeitTh.pv.mitglied) * 12);

export default defineGuide({
  id: 'guenstigste-krankenkasse-thueringen',
  group: 'laender',
  order: 65,
  land: 'TH',
  tool: 'beitrag',
  toolPreset: { land: 'TH', kasse: 'aok-plus-die-gesundheitskasse-fur-sachsen-und-thuringen' },
  related: ['aok-plus-die-gesundheitskasse-fur-sachsen-und-thuringen', 'guenstigste-krankenkasse-sachsen', 'guenstigste-krankenkasse-hessen', 'guenstigste-krankenkasse-bayern', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb11_58', 'sgb5_175', 'sgb5_242'],
  de: {
    slug: 'guenstigste-krankenkasse-thueringen',
    nav: 'Thüringen',
    card: `${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; dieselbe AOK PLUS wie in Sachsen, aber der normale hälftige Pflegebeitrag.`,
    title: 'Günstigste Krankenkasse Thüringen 2027: alle Kassen, Euro',
    description: `Thüringen 2026/2027: Krankenkassen von ${DE.pk(p.billig.zb!)} bis ${DE.pk(p.teuer.zb!)} Zusatzbeitrag in Euro gerechnet, die AOK PLUS im Vergleich und was Pendler nach Sachsen beachten.`,
    h1: 'Günstigste Krankenkasse in Thüringen: Kassen im Vergleich',
    intro: `In Thüringen sind ${p.n} Kassen wählbar, die günstigste ist ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}; die Ortskrankenkasse teilt sich das Land mit Sachsen.`,
    resume: `Thüringen hat keine eigene Ortskrankenkasse: Zuständig ist die AOK PLUS, die zugleich Sachsen versichert und einen Zusatzbeitrag von ${DE.pk(aok.zb!)} erhebt. Die Pflegeversicherung wird in Thüringen trotzdem normal geteilt, je ${DE.pz(w.pv_satz / 2)} für Beschäftigte und Arbeitgeber; die sächsische Sonderregel hängt am Land des Arbeitsplatzes, nicht an der Kasse. Laut Liste des GKV-Spitzenverbands stehen Thüringern ${p.n} Kassen offen, ${p.bund.length} davon bundesweit. Die günstigste ist ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, die teuerste ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind trennen beide ${DE.eur(p.spanneJahr)} im Jahr. ${firmusHier ? 'Auch BKK firmus ist für Thüringen geöffnet.' : 'BKK firmus, anderswo die billigste Kasse, ist für Thüringen nicht geöffnet; wer in einem Land arbeitet, für das sie geöffnet ist, kann sie trotzdem wählen.'} Die AOK PLUS steht in der Thüringer Rangliste auf Platz ${p.aokRang}.`,
    faqs: [
      { q: 'Gibt es eine AOK Thüringen?', a: `Nein, nicht mehr als eigene Kasse. Thüringen und Sachsen werden gemeinsam von der AOK PLUS versichert, deren voller Name beide Länder nennt. Für Sie bedeutet das: derselbe Zusatzbeitrag von ${DE.pk(aok.zb!)} in Erfurt wie in Dresden, aber eine andere Teilung der Pflegeversicherung, sobald Ihr Arbeitsplatz in Sachsen liegt.` },
      { q: 'Ich wohne in Gera und arbeite in Zwickau. Was ändert das?', a: `Für die Pflege zählt der Arbeitsort Sachsen: Sie tragen dort ${DE.pz(w.pv_sachsen_an_mehr)} mehr, bei ${DE.eur(BEISPIEL.lohn)} brutto rund ${DE.eur(pendelJahr)} im Jahr. Bei der Kassenwahl dürfen Sie aus beiden Landeslisten wählen, weil Wohn- und Arbeitsort zählen. ${nurSn.length ? `Nur in Sachsen geöffnet sind zum Beispiel ${nurSn.slice(0, 3).map((k) => k.kurz).join(', ')}.` : 'Die beiden Listen sind derzeit deckungsgleich.'}` },
      { q: 'Welche Kasse ist in Thüringen am billigsten?', a: `${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, danach ${top.slice(1, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Mit ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie bei ${p.billig.kurz} ${DE.eur(p.lohnBillig)} im Monat für Kranken- und Pflegeversicherung zusammen. Leistungen und Service vergleicht dieser Preis nicht.` },
      { q: 'Lohnt sich für Thüringer der Wechsel weg von der AOK PLUS?', a: `Beim Preis hängt es am Einkommen. Bei ${DE.eur(BEISPIEL.lohn)} brutto sparen Sie gegenüber der günstigsten wählbaren Kasse ${DE.eur(p.aokVsBillig)} im Jahr. Unter den ${aoks.length} AOKs hat die AOK PLUS den ${aokPlatz}. niedrigsten Satz. Wer gern eine Geschäftsstelle vor Ort nutzt, sollte das gegen die Ersparnis abwägen.` },
      { q: 'Zahlen Studierende in Jena oder Weimar einen anderen Beitrag als in Sachsen?', a: `Nein. Studierende tragen Kranken- und Pflegeversicherung allein, auf den gesetzlich festen BAföG-Bedarf von ${DE.eur(w.bafoeg_bedarf)}; die sächsische Teilung betrifft nur Beschäftigte. Unterschiede entstehen allein durch den Zusatzbeitrag der gewählten Kasse. Stellen Sie im Rechner oben „Student“ ein, um die Thüringer Rangliste für Ihren Fall zu sehen.` },
    ],
    body: (h) => `
<h2>Gleiche Kasse, andere Pflegeteilung: Thüringen und Sachsen</h2>
<p>Viele Thüringer halten die sächsische Pflegeregel für eine Eigenheit der AOK PLUS. Das stimmt nicht. Maßgeblich ist allein, in welchem Land der Betrieb liegt, in dem Sie beschäftigt sind (§ 58 Abs. 3 SGB XI). Wer in Jena wohnt und arbeitet, zahlt den hälftigen Anteil, auch als AOK-PLUS-Mitglied. Wer täglich nach Sachsen pendelt, zahlt den sächsischen Anteil, auch bei einer Ersatzkasse. Rechnen Sie den Fall im Rechner oben mit Bundesland Sachsen nach, wenn Ihr Arbeitsplatz dort liegt.</p>
${h.table(['Arbeitsplatz', 'Ihr Pflegeanteil im Monat', 'Ihr Gesamtbeitrag'], [
  ['Thüringen', h.eur(arbeitTh.pv.mitglied, 2), h.eur(arbeitTh.selbst)],
  ['Sachsen', h.eur(arbeitSn.pv.mitglied, 2), h.eur(arbeitSn.selbst)],
], `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, AOK PLUS, 2026`, ['l', 'r', 'r'])}
<h2>Kassen mit dem niedrigsten Satz in Thüringen</h2>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<p>${snBilligerDe ? `In Sachsen beginnt die Rangliste bei ${sn.billig.kurz} mit ${h.pk(sn.billig.zb!)}, also niedriger als in Thüringen. Für Pendler mit Arbeitsplatz in Sachsen kann sich das lohnen, auch wenn sie dort den höheren Pflegeanteil zahlen.` : `Sachsen bietet keine günstigere Kasse als Thüringen; der Blick über die Landesgrenze lohnt nur bei Kassen, die in Thüringen fehlen.`} Westlich grenzen ${h.a('guenstigste-krankenkasse-hessen', 'Hessen')} und ${h.a('guenstigste-krankenkasse-bayern', 'Bayern')} an, beide mit eigener AOK und anderen regionalen Betriebskrankenkassen.</p>
<h2>Der Wechsel in der Praxis</h2>
<p>Der Mitgliedsantrag bei der neuen Kasse genügt; sie meldet sich bei der bisherigen, und der Arbeitgeber erfährt die neue Kasse von Ihnen. Neue Mitgliedschaft gilt ab dem übernächsten Monatsersten, nach zwölf Monaten Bindung oder sofort nach einer Erhöhung (${h.a('krankenkasse-wechseln', 'Termin rechnen')}). Rentner in Thüringen müssen bei der Rentenversicherung nichts beantragen, die Kassen melden den Wechsel selbst.</p>
<p>Ein Hinweis zur Liste: Die regionale Öffnung einer Betriebs- oder Innungskrankenkasse steht in ihrer Satzung und kann sich ändern. Diese Seite liest die Liste des GKV-Spitzenverbands täglich neu; öffnet sich eine Kasse für Thüringen oder schließt sie sich, ändert sich die Rangliste oben noch am selben Tag.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-thuringia',
    nav: 'Thuringia',
    card: `${p.n} funds from ${EN.pk(p.billig.zb!)}; the same AOK PLUS as Saxony, but the normal half-and-half care split.`,
    title: 'Cheapest Health Insurance Thuringia 2027: Every Fund, Euros',
    description: `Thuringia 2026/2027: health funds from ${EN.pk(p.billig.zb!)} to ${EN.pk(p.teuer.zb!)} additional rate, worked out in euros, AOK PLUS compared and what commuters to Saxony should know.`,
    h1: 'Cheapest health insurance in Thuringia: funds compared',
    intro: `In Thuringia ${p.n} funds are open, the cheapest being ${p.billig.kurz} at ${EN.pk(p.billig.zb!)}; the regional AOK is shared with Saxony.`,
    resume: `Thuringia (Thüringen) has no AOK of its own: the regional fund is AOK PLUS, which also covers Saxony and charges an additional rate of ${EN.pk(aok.zb!)}. Care insurance is still split normally in Thuringia, ${EN.pz(w.pv_satz / 2)} each for employee and employer; the Saxon exception depends on where you work, not on your fund. The GKV-Spitzenverband list gives Thuringians ${p.n} funds to choose from, ${p.bund.length} of them nationwide. The cheapest is ${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, the most expensive ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child they are ${EN.eur(p.spanneJahr)} a year apart. ${firmusHier ? 'BKK firmus is open to Thuringia as well.' : 'BKK firmus, the cheapest fund in other states, is not open to Thuringia; you can still join it if you work in a state it is open to.'} AOK PLUS ranks ${p.aokRang} in Thuringia.`,
    faqs: [
      { q: 'Is there an AOK Thüringen?', a: `Not as a separate fund any more. Thuringia and Saxony are covered jointly by AOK PLUS, whose full name mentions both states. In practice: the same additional rate of ${EN.pk(aok.zb!)} in Erfurt as in Dresden, but a different care split as soon as your workplace is in Saxony.` },
      { q: 'I live in Gera and work in Zwickau. What changes?', a: `For care insurance your Saxon workplace counts: you pay ${EN.pz(w.pv_sachsen_an_mehr)} more, about ${EN.eur(pendelJahr)} a year on ${EN.eur(BEISPIEL.lohn)} gross. When choosing a fund you may use both states’ lists, since home and workplace both count. ${nurSn.length ? `Open in Saxony but not Thuringia are, for example, ${nurSn.slice(0, 3).map((k) => k.kurz).join(', ')}.` : 'The two lists are currently identical.'}` },
      { q: 'Which fund is cheapest in Thuringia?', a: `${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, then ${top.slice(1, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohnBillig)} a month at ${p.billig.kurz} for health and care insurance together. This price comparison says nothing about benefits or service.` },
      { q: 'Should people in Thuringia leave AOK PLUS?', a: `On price it depends on income. On ${EN.eur(BEISPIEL.lohn)} gross the cheapest fund open to you saves ${EN.eur(p.aokVsBillig)} a year. Among the ${aoks.length} AOK funds, AOK PLUS has rate number ${aokPlatz} from the bottom. If a local branch office matters to you, weigh that against the saving.` },
      { q: 'Do students in Jena or Weimar pay differently from students in Saxony?', a: `No. Students pay health and care insurance alone, based on the statutory BAföG need rate of ${EN.eur(w.bafoeg_bedarf)}; the Saxon split only concerns employees. Differences come solely from the chosen fund’s additional rate. Select “student” in the calculator above to see the Thuringian ranking for your case.` },
    ],
    body: (h) => `
<h2>Same fund, different care split: Thuringia and Saxony</h2>
<p>Many people assume the Saxon care rule is an AOK PLUS quirk. It is not. What counts is the state where the business employing you is located (section 58(3) SGB XI). Live and work in Jena and you pay the half share, even with AOK PLUS. Commute to Saxony every day and you pay the Saxon share, even with a substitute fund. If your workplace is in Saxony, rerun the calculator above with Saxony as the state.</p>
${h.table(['Workplace', 'Your care share a month', 'Your total contribution'], [
  ['Thuringia', h.eur(arbeitTh.pv.mitglied, 2), h.eur(arbeitTh.selbst)],
  ['Saxony', h.eur(arbeitSn.pv.mitglied, 2), h.eur(arbeitSn.selbst)],
], `${h.eur(BEISPIEL.lohn)} gross, one child, AOK PLUS, 2026`, ['l', 'r', 'r'])}
<h2>Funds with the lowest rate in Thuringia</h2>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<p>${snBilligerDe ? `In Saxony the ranking starts with ${sn.billig.kurz} at ${h.pk(sn.billig.zb!)}, lower than in Thuringia. That can pay off for commuters working in Saxony, even though they pay the higher care share there.` : `Saxony offers no cheaper fund than Thuringia; looking across the border only helps for funds missing from the Thuringian list.`} To the west lie ${h.a('guenstigste-krankenkasse-hessen', 'Hesse')} and ${h.a('guenstigste-krankenkasse-bayern', 'Bavaria')}, each with its own AOK and different regional company funds.</p>
<h2>Switching in practice</h2>
<p>An application to the new fund is all it takes; it contacts the old one, and you tell your employer the new fund. Membership starts on the first day of the month after next, after twelve months’ lock-in or straight after a rate rise (${h.a('krankenkasse-wechseln', 'work out the date')}). Pensioners in Thuringia need not apply to the pension insurance; the funds report the switch themselves.</p>
<p>A note on the list: whether a company or guild fund is open to Thuringia is set in its statutes and can change. This page rereads the GKV-Spitzenverband list every day; if a fund opens to Thuringia or withdraws, the ranking above changes the same day.</p>`,
  },
});
