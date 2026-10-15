import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN, kasse } from '../../lib/engine/kassen';

/** Brandenburg: Rangliste aus der Liste des GKV-Spitzenverbands; was über einen Arbeitsplatz in Berlin hinzukommt. */
const p = landProfil('BB');
const be = landProfil('BE');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const firmus = kasse('bkk-firmus');
const firmusHier = p.r.some((k) => k.id === firmus.id);
const nurUeberBerlin = be.r.filter((k) => !p.r.some((x) => x.id === k.id));
const berlinPlus = Math.round((kostenZeile(p.billig).lohn - kostenZeile(be.billig).lohn) * 12);
const bundAnteil = Math.round((p.bund.length / p.n) * 100);

export default defineGuide({
  id: 'guenstigste-krankenkasse-brandenburg',
  group: 'laender',
  order: 53,
  land: 'BB',
  tool: 'beitrag',
  toolPreset: { land: 'BB', kasse: 'aok-nordost-die-gesundheitskasse' },
  related: ['guenstigste-krankenkasse-berlin', 'aok-nordost-die-gesundheitskasse', 'guenstigste-krankenkasse-sachsen', 'guenstigste-krankenkasse-mecklenburg-vorpommern', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_242', 'sgb11_55'],
  de: {
    slug: 'guenstigste-krankenkasse-brandenburg',
    nav: 'Brandenburg',
    card: `${p.n} Kassen, angeführt von ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}; mit Arbeitsplatz in Berlin kommen ${nurUeberBerlin.length} Kassen hinzu.`,
    title: 'Günstigste Krankenkasse Brandenburg 2027: Kassen in Euro',
    description: `Brandenburg 2026/2027: alle hier geöffneten Krankenkassen ab ${DE.pk(p.billig.zb!)} Zusatzbeitrag, Beitrag in Euro, AOK Nordost und was ein Berliner Arbeitsplatz ändert.`,
    h1: 'Günstigste Krankenkasse in Brandenburg: was das Land bietet',
    intro: `Für Brandenburg sind ${p.n} Kassen geöffnet; an der Spitze steht ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, die AOK Nordost folgt auf Platz ${p.aokRang}.`,
    resume: `Brandenburg hat eine kürzere Kassenliste als die meisten westdeutschen Flächenländer: ${p.n} Krankenkassen sind laut GKV-Spitzenverband hier wählbar, davon ${p.bund.length} bundesweit geöffnete, also rund ${bundAnteil} Prozent. Regionale Betriebskrankenkassen, die ihre Satzung für Brandenburg geöffnet haben, gibt es nur ${p.regional.length}. ${firmusHier ? `${firmus.kurz} gehört dazu.` : `${firmus.kurz}, in vielen anderen Ländern die günstigste Kasse, ist nicht darunter.`} Deshalb führt ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)} die Brandenburger Rangliste an; am Ende steht ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind liegen dazwischen ${DE.eur(p.spanneJahr)} im Jahr. Die Ortskrankenkasse ist die AOK Nordost mit ${DE.pk(aok.zb!)}, dieselbe wie in Berlin und Mecklenburg-Vorpommern. Wer in Berlin arbeitet, darf zusätzlich jede Kasse der Berliner Liste wählen. Der Pflegebeitrag wird wie fast überall hälftig zwischen Beschäftigten und Arbeitgeber geteilt.`,
    faqs: [
      { q: 'Warum ist BKK firmus in Brandenburg nicht wählbar?', a: `Eine Betriebskrankenkasse entscheidet in ihrer Satzung, für welche Länder sie sich öffnet. ${firmusHier ? `${firmus.kurz} ist derzeit für Brandenburg geöffnet und steht in der Rangliste.` : `${firmus.kurz} ist laut Liste des GKV-Spitzenverbands für ${firmus.laender.length} Länder geöffnet, Brandenburg gehört nicht dazu.`} Arbeiten Sie in einem dieser Länder, etwa in Berlin, können Sie sie über den Arbeitsort trotzdem wählen.` },
      { q: 'Was bringt mir als Brandenburger ein Arbeitsplatz in Berlin für die Kassenwahl?', a: `Sie dürfen aus beiden Listen wählen. ${nurUeberBerlin.length ? `Nur über Berlin erreichbar sind ${nurUeberBerlin.length} Kassen, darunter ${nurUeberBerlin.slice(0, 3).map((k) => k.kurz).join(', ')}.` : 'Derzeit kommen keine Kassen hinzu.'} Die günstigste davon spart bei ${DE.eur(BEISPIEL.lohn)} brutto gegenüber der günstigsten Brandenburger Kasse ${DE.eur(Math.max(0, berlinPlus))} im Jahr. Die Mitgliedschaft bleibt bestehen, wenn Sie später den Arbeitsplatz wechseln.` },
      { q: 'Wie schneidet die AOK Nordost in Brandenburg ab?', a: `Sie verlangt ${DE.pk(aok.zb!)} und steht damit auf Platz ${p.aokRang} von ${p.n}. Unter allen ${aoks.length} AOKs ist ihr Satz der ${aokPlatz}. niedrigste, ${aok.zb! > w.zb_durchschnitt ? 'über' : 'unter'} dem amtlichen Durchschnitt von ${DE.pz(w.zb_durchschnitt)}. Gegenüber ${p.billig.kurz} zahlen Mitglieder bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(p.aokVsBillig)} im Jahr mehr.` },
      { q: 'Muss ich in Cottbus oder Frankfurt (Oder) eine Geschäftsstelle haben?', a: `Nein, eine Geschäftsstelle vor Ort ist keine Voraussetzung. Bundesweite Kassen arbeiten oft per Telefon, Post und App; regionale haben teils wenige Standorte. Wer Beratung am Schalter braucht, etwa für Pflege oder Hilfsmittel, sollte das prüfen, bevor der Preis allein entscheidet. Der Zusatzbeitrag sagt darüber nichts aus.` },
      { q: 'Wie viel zahlt eine Rentnerin in Brandenburg bei der günstigsten Kasse?', a: `Mit ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente und einem Kind ${DE.eur(kostenZeile(p.billig).rente)} im Monat bei ${p.billig.kurz}, gegenüber ${DE.eur(kostenZeile(aok).rente)} bei der AOK Nordost. Die Rentenversicherung trägt die Hälfte der Krankenversicherung, die Pflege zahlen Rentner allein. Eine Änderung des Zusatzbeitrags wirkt bei der Rente erst ab dem zweiten Folgemonat.` },
    ],
    body: (h) => `
<h2>Eine kurze Liste und ihr Grund</h2>
<p>Die Auswahl einer Krankenkasse hängt nicht nur am Preis, sondern an der Öffnung: Bundesweite Kassen nehmen jeden auf, regionale nur Menschen aus den Ländern ihrer Satzung. Brandenburg steht in den Satzungen seltener als etwa Nordrhein-Westfalen oder Bayern. Das verkürzt die Liste und schiebt Kassen nach vorn, die anderswo im Mittelfeld lägen. Hier die fünf mit dem niedrigsten Satz:</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Der Umweg über den Berliner Arbeitsplatz</h2>
<p>Der Gesetzgeber lässt Beschäftigte zwischen den Kassen ihres Wohn- und ihres Arbeitslandes wählen. Für Brandenburger mit Job in ${h.a('guenstigste-krankenkasse-berlin', 'Berlin')} heißt das: ${be.billig.id === p.billig.id ? `Die Spitze ist in beiden Ländern dieselbe, ${p.billig.kurz}.` : `In Berlin führt ${be.billig.kurz} mit ${h.pk(be.billig.zb!)} die Liste an; über den Arbeitsort steht sie auch Ihnen offen.`} Endet die Beschäftigung später, bleiben Sie Mitglied. Wer dagegen in Brandenburg wohnt und arbeitet, ist auf die Brandenburger Liste beschränkt.</p>
${h.table(['Günstigste Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat'], [
  [`Brandenburg: ${kLink(h, p.billig)}`, h.pk(p.billig.zb!), h.eur(p.lohnBillig)],
  [`Berlin: ${kLink(h, be.billig)}`, h.pk(be.billig.zb!), h.eur(be.lohnBillig)],
], `${h.eur(BEISPIEL.lohn)} brutto, ein Kind`, ['l', 'r', 'r'])}
<h2>Pflege, Rente und Wechsel</h2>
<p>Der Pflegebeitrag wird in Brandenburg hälftig geteilt, je ${h.pz(w.pv_satz / 2)}; die höhere Arbeitnehmerlast gibt es nur in ${h.a('guenstigste-krankenkasse-sachsen', 'Sachsen')}. Rentner zahlen die Pflege ohnehin allein und den halben Krankenversicherungssatz samt halbem Zusatzbeitrag, die andere Hälfte trägt die Rentenversicherung. Ein Wechsel wirkt zum übernächsten Monatsersten, nach zwölf Monaten Bindung oder sofort nach einer Erhöhung; die Termine berechnet der ${h.a('krankenkasse-wechseln', 'Fristenrechner')}.</p>
<p>Ein Blick lohnt auch nach Norden und Süden: ${h.a('guenstigste-krankenkasse-mecklenburg-vorpommern', 'Mecklenburg-Vorpommern')} teilt sich mit Brandenburg die AOK Nordost und eine ähnlich kurze Liste, während in ${h.a('guenstigste-krankenkasse-sachsen', 'Sachsen')} die AOK PLUS zuständig ist und mehr regionale Betriebskrankenkassen geöffnet sind. Wer in der Lausitz wohnt und in Sachsen arbeitet, wählt aus beiden Listen, zahlt dann aber den sächsischen Pflegeanteil, weil dafür der Arbeitsort zählt.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-brandenburg',
    nav: 'Brandenburg',
    card: `${p.n} funds, led by ${p.billig.kurz} at ${EN.pk(p.billig.zb!)}; a job in Berlin adds ${nurUeberBerlin.length} more.`,
    title: 'Cheapest Health Insurance Brandenburg 2027: Funds in Euros',
    description: `Brandenburg 2026/2027: every health fund open to the state from ${EN.pk(p.billig.zb!)} additional rate, cost in euros, AOK Nordost and what a job in Berlin changes for you.`,
    h1: 'Cheapest health insurance in Brandenburg: what the state offers',
    intro: `${p.n} funds are open to Brandenburg; ${p.billig.kurz} leads at ${EN.pk(p.billig.zb!)}, with AOK Nordost in position ${p.aokRang}.`,
    resume: `Brandenburg has a shorter fund list than most western states: the GKV-Spitzenverband lists ${p.n} statutory health funds open here, ${p.bund.length} of them nationwide, roughly ${bundAnteil} percent. Only ${p.regional.length} regional company funds have opened their statutes to Brandenburg. ${firmusHier ? `${firmus.kurz} is one of them.` : `${firmus.kurz}, the cheapest fund in many other states, is not among them.`} So ${p.billig.kurz} at ${EN.pk(p.billig.zb!)} tops the Brandenburg ranking, with ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)} at the bottom. On ${EN.eur(BEISPIEL.lohn)} gross with one child there are ${EN.eur(p.spanneJahr)} a year between them. The regional fund is AOK Nordost at ${EN.pk(aok.zb!)}, the same as in Berlin and Mecklenburg-Western Pomerania. If you work in Berlin, you may also join any fund on the Berlin list. Care insurance is split half and half between employee and employer, as in almost every state.`,
    faqs: [
      { q: 'Why can’t I join BKK firmus in Brandenburg?', a: `A company fund decides in its statutes which states it opens to. ${firmusHier ? `${firmus.kurz} is currently open to Brandenburg and appears in the ranking.` : `According to the GKV-Spitzenverband list ${firmus.kurz} is open to ${firmus.laender.length} states, and Brandenburg is not one of them.`} If you work in one of those states, Berlin for instance, you can still join it through your workplace.` },
      { q: 'How does a job in Berlin widen my choice as a Brandenburg resident?', a: `You may choose from both lists. ${nurUeberBerlin.length ? `${nurUeberBerlin.length} funds are reachable only through Berlin, including ${nurUeberBerlin.slice(0, 3).map((k) => k.kurz).join(', ')}.` : 'At the moment no extra funds are added.'} The cheapest of them saves ${EN.eur(Math.max(0, berlinPlus))} a year against the cheapest Brandenburg fund on ${EN.eur(BEISPIEL.lohn)} gross. Your membership continues even if you later change jobs.` },
      { q: 'How does AOK Nordost perform in Brandenburg?', a: `It charges ${EN.pk(aok.zb!)}, placing it ${p.aokRang} of ${p.n}. Among all ${aoks.length} AOK funds its rate is number ${aokPlatz} from the bottom, ${aok.zb! > w.zb_durchschnitt ? 'above' : 'below'} the official average of ${EN.pz(w.zb_durchschnitt)}. Compared with ${p.billig.kurz}, members pay ${EN.eur(p.aokVsBillig)} a year more on ${EN.eur(BEISPIEL.lohn)} gross.` },
      { q: 'Do I need a branch office in Cottbus or Frankfurt (Oder)?', a: `No, a local office is not required to join. Nationwide funds often work by phone, post and app; regional funds sometimes have few branches. If you need face-to-face advice, for long-term care or medical aids for instance, check that before letting price decide. The additional rate tells you nothing about service.` },
      { q: 'What does a pensioner in Brandenburg pay at the cheapest fund?', a: `With a ${EN.eur(BEISPIEL.rente)} state pension and one child, ${EN.eur(kostenZeile(p.billig).rente)} a month at ${p.billig.kurz}, against ${EN.eur(kostenZeile(aok).rente)} at AOK Nordost. The pension insurance pays half the health contribution; pensioners pay care insurance alone. A change in the additional rate reaches the pension only from the second month after it.` },
    ],
    body: (h) => `
<h2>A short list, and why</h2>
<p>Which funds you can join depends not just on price but on where they are open: nationwide funds take anyone, regional ones only people from the states named in their statutes. Brandenburg appears in those statutes less often than, say, North Rhine-Westphalia or Bavaria. That shortens the list and pushes funds to the top that would sit mid-table elsewhere. Here are the five with the lowest rate:</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>The detour through a Berlin job</h2>
<p>The law lets employees choose among the funds of the state they live in and the state they work in. For Brandenburg residents with a job in ${h.a('guenstigste-krankenkasse-berlin', 'Berlin')} that means: ${be.billig.id === p.billig.id ? `the top fund is the same in both states, ${p.billig.kurz}.` : `${be.billig.kurz} leads the Berlin list at ${h.pk(be.billig.zb!)}, and through your workplace it is open to you too.`} If the job later ends, you remain a member. If you live and work in Brandenburg, the Brandenburg list is all you have.</p>
${h.table(['Cheapest fund', 'Additional rate', 'You pay a month'], [
  [`Brandenburg: ${kLink(h, p.billig)}`, h.pk(p.billig.zb!), h.eur(p.lohnBillig)],
  [`Berlin: ${kLink(h, be.billig)}`, h.pk(be.billig.zb!), h.eur(be.lohnBillig)],
], `${h.eur(BEISPIEL.lohn)} gross, one child`, ['l', 'r', 'r'])}
<h2>Care insurance, pensions and switching</h2>
<p>Care insurance is split in half in Brandenburg, ${h.pz(w.pv_satz / 2)} each; the heavier employee share exists only in ${h.a('guenstigste-krankenkasse-sachsen', 'Saxony')}. Pensioners pay care insurance alone anyway, plus half the health rate and half the additional rate, with the pension insurance paying the other half. A switch takes effect on the first day of the month after next, after twelve months’ lock-in or straight after a rate rise; the ${h.a('krankenkasse-wechseln', 'deadline calculator')} gives the dates.</p>
<p>Look north and south as well: ${h.a('guenstigste-krankenkasse-mecklenburg-vorpommern', 'Mecklenburg-Western Pomerania')} shares AOK Nordost and a similarly short list with Brandenburg, while ${h.a('guenstigste-krankenkasse-sachsen', 'Saxony')} has AOK PLUS and more regional company funds open. If you live in Lusatia and work in Saxony, you choose from both lists but pay the Saxon care share, because the workplace decides that.</p>`,
  },
});
