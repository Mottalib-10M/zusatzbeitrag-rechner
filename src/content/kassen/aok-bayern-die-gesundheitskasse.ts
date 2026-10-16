import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { kasse, KASSEN, rangliste } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** AOK Bayern: nur in Bayern geöffnet; Rang unter allen AOKs und unter den in Bayern wählbaren Kassen aus der Liste. */
const ID = 'aok-bayern-die-gesundheitskasse';
const p = profil(ID);
const w = J(2026);
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null).sort((a, b) => a.zb! - b.zb!);
const aokPlatz = aoks.filter((k) => k.zb! < p.zb).length + 1;
const by = p.raengeLand.find((r) => r.l === 'BY')!;
const vorne = rangliste('BY').filter((k) => k.zb! < p.zb);
// Nachbar-AOKs, die für Pendler über die Landesgrenze in Frage kommen.
const nachbarAok = ['aok-baden-wurttemberg', 'aok-die-gesundheitskasse-in-hessen', 'aok-plus-die-gesundheitskasse-fur-sachsen-und-thuringen'].map((id) => kostenZeile(kasse(id)));
const tabelle = [kostenZeile(p.k), ...nachbarAok].sort((a, b) => a.k.zb! - b.k.zb!);
const d = (x: { lohn: number }) => Math.round((x.lohn - p.lohn) * 12);
const ordEn = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 13,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID, land: 'BY' },
  related: ['zusatzbeitrag-liste', 'aok-baden-wurttemberg', 'techniker-krankenkasse', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_175', 'sgb11_55'],
  de: {
    slug: 'aok-bayern-zusatzbeitrag',
    nav: 'AOK Bayern',
    card: `${DE.pk(p.zb)} Zusatzbeitrag, ${aokPlatz}. günstigste aller AOKs; nur für Bayern geöffnet.`,
    title: 'AOK Bayern Zusatzbeitrag 2027: Beitrag und Vergleich',
    description: `AOK Bayern, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Was Mitglieder in Bayern im Monat zahlen, wo die Kasse unter allen AOKs und den in Bayern wählbaren Kassen steht.`,
    h1: 'AOK Bayern: Zusatzbeitrag und Beitrag in Euro',
    intro: `Die AOK Bayern verlangt ${DE.pk(p.zb)}; unter den ${aoks.length} Ortskrankenkassen hat sie den ${aokPlatz}. niedrigsten Satz.`,
    resume: `Die AOK Bayern ist die Ortskrankenkasse des Freistaats und laut Liste des GKV-Spitzenverbands ausschließlich für Bayern geöffnet: Wählen kann sie, wer in Bayern wohnt oder arbeitet. Ihr Zusatzbeitrag beträgt ${DE.pk(p.zb)}, zusammen mit dem allgemeinen Satz also ${DE.pz(w.kv_allgemein + p.zb)} des Bruttos bis zur Bemessungsgrenze. Unter den ${aoks.length} AOKs in Deutschland liegt sie damit auf Platz ${aokPlatz} der günstigsten; unter den ${by.n} Kassen, die in Bayern jedem offenstehen, auf Rang ${by.rang}. Ein Beschäftigter mit ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlt ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung, ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} im Jahr ${p.unterDurchschnitt ? 'weniger' : 'mehr'} als zum amtlichen Durchschnittssatz von ${DE.pz(w.zb_durchschnitt)}. Die günstigste in Bayern wählbare Kasse, ${p.billigste.kurz}, kostet bei diesem Lohn ${DE.eur(p.proJahrVsBilligste)} im Jahr weniger. Wer aus Bayern wegzieht und nicht mehr dort arbeitet, kann die AOK Bayern nicht neu wählen, bleibt aber Mitglied, bis er selbst wechselt.`,
    faqs: [
      { q: 'Wer darf Mitglied der AOK Bayern werden?', a: `Jeder Versicherungspflichtige oder freiwillig Versicherte, der in Bayern wohnt oder dort beschäftigt ist; so steht es in der Öffnung, die die Liste des GKV-Spitzenverbands für die AOK Bayern ausweist. Wer in Ulm wohnt und in Neu-Ulm arbeitet, kann also wählen. Die Kasse darf Sie nicht ablehnen, sobald eine der beiden Bedingungen erfüllt ist (§ 175 Abs. 1 SGB V).` },
      { q: `Wie viel zahle ich bei der AOK Bayern mit ${DE.eur(BEISPIEL.lohnNiedrig)} brutto?`, a: `Mit einem Kind ${DE.eur(p.lohnNiedrig)} im Monat für Kranken- und Pflegeversicherung, an der Bemessungsgrenze von ${DE.eur(w.bbgKv, 2)} sind es ${DE.eur(p.lohnBbg)}. Ihr Arbeitgeber zahlt die gleiche Summe dazu. Ohne Kinder und ab 23 Jahren erhöht sich nur der Pflegeanteil, um ${DE.pz(w.pv_kinderlos)} Ihres Bruttos.` },
      { q: 'Welche Kassen sind in Bayern günstiger als die AOK Bayern?', a: `${vorne.length === 0 ? 'Keine: Die AOK Bayern hat in Bayern derzeit den niedrigsten Satz.' : `${vorne.length} Kassen, angeführt von ${vorne.slice(0, 3).map((k) => `${k.kurz} (${DE.pk(k.zb!)})`).join(', ')}.`} Der Abstand ist in Euro klein: Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie bei der günstigsten ${DE.eur(p.proJahrVsBilligste)} im Jahr weniger. Die vollständige Rangliste für Bayern zeigt der Rechner oben.` },
      { q: 'Was zahlen Rentner bei der AOK Bayern?', a: `Bei ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente ${DE.eur(p.rente)} im Monat: die Hälfte von ${DE.pz(w.kv_allgemein + p.zb)} Krankenversicherung, die Pflege mit ${DE.pz(w.pv_satz)} allein. Die Deutsche Rentenversicherung behält den Betrag ein und zahlt die andere Hälfte der Krankenversicherung. Eine Betriebsrente kommt mit dem vollen Satz hinzu, abzüglich eines Freibetrags.` },
    ],
    body: (h) => `
<h2>Eine Kasse für ein Land: was das für Mitglieder heißt</h2>
<p>Die elf Allgemeinen Ortskrankenkassen sind regional organisiert; die bayerische deckt genau ein Bundesland ab und rechnet ihren Zusatzbeitrag aus den Einnahmen und Ausgaben ihrer bayerischen Versicherten. Dass sie mit ${h.pk(p.zb)} unter ${aoks.length} AOKs auf Platz ${aokPlatz} liegt, ist deshalb eine bayerische Größe, die mit dem Satz der AOK im Nachbarland wenig zu tun hat. Für Pendler ist das praktisch: Wer in Bayern arbeitet und jenseits der Grenze wohnt, hat die Wahl zwischen zwei Ortskrankenkassen und kann die günstigere nehmen.</p>
${h.table(['AOK', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber AOK Bayern im Jahr'], tabelle.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `Nachbar-AOKs, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'r'])}
<h2>Beitrag bei der AOK Bayern in typischen Fällen</h2>
${h.table(['Fall', 'Bemessung', 'Ihr Anteil im Monat'], [
  ['Beschäftigt', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Beschäftigt', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Beschäftigt, Höchstbeitrag', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig ohne Krankengeld', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studium, unter 23', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, Pflege mit einem Kind', ['l', 'r', 'r'])}
<p>In Bayern teilen sich Beschäftigte und Arbeitgeber auch die Pflegeversicherung hälftig; die sächsische Sonderregel gilt nicht. Ein Wechsel von der AOK zu einer günstigeren Kasse spart beim Durchschnittslohn wenig, für Selbstständige mit hohem Gewinn mehr, weil sie den ganzen Zusatzbeitrag tragen. Alle in Bayern wählbaren Kassen stehen in der ${h.a('zusatzbeitrag-liste', 'Liste der Zusatzbeiträge nach Land')}.</p>
<h2>Wenn sich der Satz ändert</h2>
<p>Ihren Satz für 2027 beschließt der Verwaltungsrat der AOK Bayern im Herbst oder Winter; in der amtlichen Liste steht er erst ab dem Tag, an dem er gilt. Steigt er, haben Mitglieder ein Sonderkündigungsrecht bis zum Ende des Monats der Erhöhung, auch innerhalb der ersten zwölf Monate. Senkt die Kasse ihn, profitieren Sie ohne eigenes Zutun ab dem Monat der Senkung; ein Antrag ist nicht nötig. Den genauen Wechseltermin rechnet der ${h.a('krankenkasse-wechseln', 'Fristenrechner')}.</p>`,
  },
  en: {
    slug: 'aok-bayern-additional-contribution',
    nav: 'AOK Bayern',
    card: `${EN.pk(p.zb)} additional rate, the ${ordEn(aokPlatz)} cheapest of all AOKs; open in Bavaria only.`,
    title: 'AOK Bayern Additional Contribution 2027: Cost and Ranking',
    description: `AOK Bayern additional rate in 2026: ${EN.pk(p.zb)}. What members in Bavaria pay a month and how the fund ranks among all AOKs and funds open to Bavarian residents.`,
    h1: 'AOK Bayern: additional rate and cost in euros',
    intro: `AOK Bayern charges ${EN.pk(p.zb)}; of the ${aoks.length} regional AOK funds, it has the ${ordEn(aokPlatz)} lowest rate.`,
    resume: `AOK Bayern is Bavaria’s regional health fund (Allgemeine Ortskrankenkasse), and the GKV-Spitzenverband list shows it open in Bavaria only: you can join if you live or work there. Its additional contribution (Zusatzbeitrag) is ${EN.pk(p.zb)}, making ${EN.pz(w.kv_allgemein + p.zb)} of gross pay up to the ceiling together with the general rate. That puts it ${ordEn(aokPlatz)} cheapest of the ${aoks.length} AOKs in Germany, and rank ${by.rang} of the ${by.n} funds open to anyone in Bavaria. An employee earning ${EN.eur(BEISPIEL.lohn)} gross with one child pays ${EN.eur(p.lohn)} a month for health and care insurance, ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} a year ${p.unterDurchschnitt ? 'less' : 'more'} than at the official average rate of ${EN.pz(w.zb_durchschnitt)}. The cheapest fund open in Bavaria, ${p.billigste.kurz}, costs ${EN.eur(p.proJahrVsBilligste)} a year less at that pay. If you leave Bavaria and no longer work there, you cannot newly join AOK Bayern, but you remain a member until you switch.`,
    faqs: [
      { q: 'Who can join AOK Bayern?', a: `Anyone subject to compulsory insurance, or insured voluntarily, who lives or is employed in Bavaria; that is the opening the GKV-Spitzenverband list records for AOK Bayern. Someone living in Ulm and working in Neu-Ulm can therefore choose it. The fund may not turn you down once either condition is met (section 175(1) SGB V).` },
      { q: `How much will I pay at AOK Bayern on ${EN.eur(BEISPIEL.lohnNiedrig)} gross?`, a: `With one child, ${EN.eur(p.lohnNiedrig)} a month for health and care insurance; at the ceiling of ${EN.eur(w.bbgKv, 2)} it is ${EN.eur(p.lohnBbg)}. Your employer pays the same amount on top. If you are childless and 23 or over, only the care share rises, by ${EN.pz(w.pv_kinderlos)} of your gross pay.` },
      { q: 'Which funds in Bavaria are cheaper than AOK Bayern?', a: `${vorne.length === 0 ? 'None: AOK Bayern currently has the lowest rate in Bavaria.' : `${vorne.length} funds, led by ${vorne.slice(0, 3).map((k) => `${k.kurz} (${EN.pk(k.zb!)})`).join(', ')}.`} In euros the gap is small: on ${EN.eur(BEISPIEL.lohn)} gross the cheapest saves you ${EN.eur(p.proJahrVsBilligste)} a year. The calculator above shows the full ranking for Bavaria.` },
      { q: 'What do pensioners pay at AOK Bayern?', a: `On a ${EN.eur(BEISPIEL.rente)} state pension, ${EN.eur(p.rente)} a month: half of the ${EN.pz(w.kv_allgemein + p.zb)} health rate and the full ${EN.pz(w.pv_satz)} care contribution. German Pension Insurance deducts it and pays the other half of health insurance. A company pension comes on top at the full rate, less an allowance.` },
    ],
    body: (h) => `
<h2>One fund for one state: what it means for members</h2>
<p>The eleven regional AOK funds are organised by territory; the Bavarian one covers exactly one state and sets its additional rate from the income and spending of its Bavarian members. Ranking ${ordEn(aokPlatz)} of ${aoks.length} AOKs at ${h.pk(p.zb)} is therefore a Bavarian figure with little bearing on the AOK next door. For cross-border commuters that is useful: work in Bavaria and live across the state line, and you can choose between two regional funds and take the cheaper one.</p>
${h.table(['AOK', 'Additional rate', 'You pay a month', 'vs AOK Bayern a year'], tabelle.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `Neighbouring AOKs, ${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'r'])}
<h2>AOK Bayern cost in typical cases</h2>
${h.table(['Case', 'Base', 'Your share a month'], [
  ['Employed', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employed', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employed, maximum', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Retired', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed, no sick pay', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student under 23', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, care insurance with one child', ['l', 'r', 'r'])}
<p>In Bavaria employees and employers also split care insurance equally; the Saxon exception does not apply. Moving from the AOK to a cheaper fund saves little at an average wage and more for self-employed members with high profits, who pay the whole additional rate. Every fund open in Bavaria is in the ${h.a('zusatzbeitrag-liste', 'list of additional rates by state')}.</p>
<h2>When the rate changes</h2>
<p>AOK Bayern’s board sets the 2027 rate in the autumn or winter; the official list shows it only from the day it applies. If it goes up, members have a special right to leave until the end of the month of the increase, even within their first twelve months. If the fund lowers it, you benefit automatically from that month; no application is needed. The ${h.a('krankenkasse-wechseln', 'deadline calculator')} gives the exact switch date.</p>`,
  },
});
