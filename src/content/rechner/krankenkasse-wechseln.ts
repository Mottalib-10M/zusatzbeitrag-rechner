import { defineGuide } from '../../lib/guide-types';
import { wechsel, renteAb } from '../../lib/engine/wechsel';
import { P } from '../../lib/fmt';

/** Fristen § 175 Abs. 4 SGB V, Beispiele aus dem Motor. */
const W = P.wechsel;
const normal = wechsel({ y: 2026, m: 11 }, { y: 2021, m: 3 }, null); // Erklärung November → neue Kasse ab Februar 2027
const sonderJan = wechsel({ y: 2027, m: 1 }, { y: 2026, m: 8 }, { y: 2027, m: 1 }); // seit August 2026 Mitglied, Erhöhung Januar
const sonderDez = wechsel({ y: 2026, m: 12 }, { y: 2026, m: 8 }, { y: 2027, m: 1 });
const gesperrt = wechsel({ y: 2026, m: 11 }, { y: 2026, m: 8 }, null);
const MDE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const MEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const de = (m: { y: number; m: number }) => `${MDE[m.m - 1]} ${m.y}`;
const en = (m: { y: number; m: number }) => `${MEN[m.m - 1]} ${m.y}`;
const rJan = renteAb({ y: 2027, m: 1 });

export default defineGuide({
  id: 'krankenkasse-wechseln',
  group: 'rechner',
  order: 1,
  tool: 'wechsel',
  related: ['sonderkuendigungsrecht', 'zusatzbeitrag-liste', 'zusatzbeitrag-2027', 'beste-krankenkasse', 'krankenkassenbeitrag-rentner'],
  sources: ['sgb5_175', 'sgb5_247', 'gkvListe', 'sgb5_242'],
  de: {
    slug: 'krankenkasse-wechseln',
    nav: 'Krankenkasse wechseln',
    card: `Fristen rechnen: neue Kasse zum übernächsten Monat, nach ${W.bindung_monate} Monaten Bindung oder sofort mit Sonderkündigungsrecht.`,
    title: 'Krankenkasse wechseln 2027: Fristen, Termin, Sonderrecht',
    description: `Krankenkasse wechseln 2026/2027: ab wann die neue Kasse gilt, ${W.bindung_monate} Monate Bindung, Kündigung zum übernächsten Monat, Sonderkündigungsrecht bei Erhöhung.`,
    h1: 'Krankenkasse wechseln: ab wann die neue Kasse gilt',
    intro: `Wer im November wählt, ist ab 1. ${de(normal.beginn)} bei der neuen Kasse; bei einer Erhöhung gilt die Bindung von ${W.bindung_monate} Monaten nicht.`,
    resume: `Ein Kassenwechsel braucht seit 2021 nur noch einen Schritt: Sie werden Mitglied der neuen Kasse, und diese meldet den Wechsel elektronisch an die alte, eine eigene Kündigung ist nicht nötig (§ 175 Abs. 2 und 4 SGB V). Wirksam wird er zum Ablauf des übernächsten Kalendermonats, gerechnet ab dem Monat, in dem Sie die neue Kasse wählen: Wer im November 2026 wählt, ist im Dezember und Januar noch bei der alten Kasse und ab 1. ${de(normal.beginn)} bei der neuen. Voraussetzung ist eine Mitgliedschaft von mindestens ${W.bindung_monate} Monaten, die zum Wechseltermin abgelaufen sein muss. Erhöht die Kasse ihren Zusatzbeitrag, entfällt diese Bindung: Dann können Sie bis zum Ende des Monats wählen, ab dem der höhere Satz gilt, zahlen ihn aber bis zum Wechsel. Beschäftigte geben dem Arbeitgeber die neue Kasse an, Rentner der Rentenversicherung über die Kasse, die den Wechsel meldet.`,
    faqs: [
      { q: 'Muss ich meiner alten Krankenkasse kündigen?', a: 'Nein. Seit dem 1. Januar 2021 genügt der Antrag bei der neuen Kasse; sie meldet den Wechsel elektronisch an die alte, und diese bestätigt das Ende der Mitgliedschaft binnen zwei Wochen (§ 175 Abs. 2 SGB V). Eine eigene Kündigung ist nur nötig, wenn Sie die gesetzliche Versicherung ganz verlassen, etwa für eine private.' },
      { q: 'Ich bin erst seit Sommer bei meiner Kasse. Kann ich trotzdem wechseln?', a: `Nur mit Sonderkündigungsrecht. Ohne Erhöhung bindet Sie die Mitgliedschaft ${W.bindung_monate} Monate: Wer im August 2026 eingetreten ist, kann frühestens im ${de(gesperrt.fruehestens)} wählen und ist ab 1. ${de(gesperrt.beginn)} bei der neuen Kasse. Erhöht die Kasse aber zum Januar, dürfen Sie bis Ende Januar wählen und sind ab 1. ${de(sonderJan.beginn)} weg.` },
      { q: 'Lohnt es sich, schon im Dezember zu wählen, wenn meine Kasse zum Januar erhöht?', a: `Ja, um einen Monat. Wer im Dezember 2026 wählt, ist ab 1. ${de(sonderDez.beginn)} bei der neuen Kasse und zahlt den höheren Satz ${sonderDez.monateErhoeht} Monate; wer erst im Januar wählt, zahlt ihn ${sonderJan.monateErhoeht} Monate und wechselt zum 1. ${de(sonderJan.beginn)}. Erhöhungen zum Januar beschließen die Kassen meist im Dezember und veröffentlichen sie dann.` },
      { q: 'Was müssen Rentner beim Kassenwechsel beachten?', a: `Die neue Kasse meldet den Wechsel auch an die Rentenversicherung, Sie müssen dort nichts beantragen. Eine Änderung des Zusatzbeitrags wirkt bei der Rente erst ab dem zweiten Folgemonat (§ 247 Satz 3 SGB V): Eine Erhöhung zum 1. Januar 2027 wird ab ${de(rJan)} von der Rente abgezogen, bei einem Wechsel entsprechend später.` },
    ],
    body: (h) => `
<h2>Drei Fälle, durchgerechnet</h2>
${h.table(['Fall', 'Wahl im', 'Letzter Monat alt', 'Neue Kasse ab', 'Monate erhöht'], [
  [`Lange Mitglied, keine Erhöhung`, de({ y: 2026, m: 11 }), de(normal.letzterMonat), `1. ${de(normal.beginn)}`, '0'],
  [`Seit August 2026, Erhöhung zum Januar`, de({ y: 2026, m: 12 }), de(sonderDez.letzterMonat), `1. ${de(sonderDez.beginn)}`, String(sonderDez.monateErhoeht)],
  [`Seit August 2026, Erhöhung zum Januar`, de({ y: 2027, m: 1 }), de(sonderJan.letzterMonat), `1. ${de(sonderJan.beginn)}`, String(sonderJan.monateErhoeht)],
  [`Seit August 2026, keine Erhöhung`, de(gesperrt.fruehestens), de(gesperrt.letzterMonat), `1. ${de(gesperrt.beginn)}`, '0'],
], 'Berechnet mit dem Rechner oben, Regeln nach § 175 Abs. 4 SGB V')}
<h2>Was der Rechner prüft</h2>
<p>Er zählt zuerst die Bindung: zwölf Monate ab dem ersten Monat Ihrer Mitgliedschaft, die zum Ende der alten Mitgliedschaft abgelaufen sein müssen. Danach rechnet er die Frist, die immer gleich lang ist, egal ob Sie am ersten oder am letzten Tag des Monats wählen: Monat der Wahl, zwei volle Folgemonate, dann die neue Kasse. Gibt es eine Erhöhung, prüft er, ob Ihre Wahl spätestens im Monat der Erhöhung liegt; dann gilt die Bindung nicht, und er zeigt, wie viele Monate Sie den höheren Satz noch zahlen und was das bei Ihrem Brutto kostet.</p>
<p>Wie viel ein Wechsel im Jahr bringt, zeigt der ${h.a('home', 'Beitragsrechner mit allen Kassen Ihres Landes')}; welche Kasse welchen Satz hat, die ${h.a('zusatzbeitrag-liste', 'vollständige Liste der Zusatzbeiträge')}.</p>
<h2>Die Ausnahmen, die oft übersehen werden</h2>
<p>Wer einen Wahltarif abgeschlossen hat, ist länger gebunden: drei Jahre beim Selbstbehalt, ein Jahr bei der Prämie für nicht genutzte Leistungen (§ 53 Abs. 8 SGB V). Das Sonderkündigungsrecht bei einer Erhöhung gilt auch dann, mit einer Ausnahme: dem Krankengeld-Wahltarif, den vor allem Selbstständige abschließen. Endet die Mitgliedschaft kraft Gesetzes, etwa weil Sie in die Familienversicherung wechseln oder ins Ausland ziehen, gibt es keine Bindung. Und eine Betriebskrankenkasse, die nur Beschäftigten ihres Trägers offensteht, können Sie nur wählen, solange Sie dort arbeiten.</p>
<p>Ihre Leistungen laufen beim Wechsel ohne Lücke weiter: Eine laufende Behandlung, ein genehmigtes Hilfsmittel oder Krankengeld enden nicht, die neue Kasse übernimmt. Die elektronische Gesundheitskarte der alten Kasse gilt bis zum letzten Tag der Mitgliedschaft.</p>`,
  },
  en: {
    slug: 'switch-health-insurance',
    nav: 'Switching your fund',
    card: `Work out the dates: new fund from the month after next, after ${W.bindung_monate} months’ lock-in or at once with the special right.`,
    title: 'Switch Health Insurance Germany 2027: Deadlines and Dates',
    description: `Switching German health fund in 2026/2027: when the new fund starts, the ${W.bindung_monate}-month lock-in, notice to the month after next, the special right after a rate rise.`,
    h1: 'Switching health fund in Germany: when the new fund starts',
    intro: `Join a new fund in November and it covers you from 1 ${en(normal.beginn)}; after a rate rise the ${W.bindung_monate}-month lock-in does not apply.`,
    resume: `Since 2021 switching statutory health fund (Krankenkasse) in Germany takes one step: you join the new fund, and it notifies the old one electronically, so no separate termination letter is needed (section 175(2) and (4) of Book V of the Social Code, SGB V). The switch takes effect at the end of the month after next, counted from the month in which you join: choose a new fund in November 2026 and you stay with the old one through December and January, then move on 1 ${en(normal.beginn)}. You must have been a member for at least ${W.bindung_monate} months by the switch date. If your fund raises its additional rate (Zusatzbeitrag), the lock-in falls away: you can join a new fund until the end of the month in which the higher rate starts, but you pay it until you leave. Employees tell their employer the new fund; pensioners need do nothing, as the funds inform the pension insurance.`,
    faqs: [
      { q: 'Do I need to cancel my old health fund?', a: 'No. Since 1 January 2021 an application to the new fund is enough; it notifies the old fund electronically, which confirms the end of membership within two weeks (section 175(2) SGB V). You only send a cancellation yourself if you leave statutory insurance altogether, for example to take out private cover.' },
      { q: 'I only joined my fund this summer. Can I still switch?', a: `Only with the special termination right. Without a rate rise you are locked in for ${W.bindung_monate} months: someone who joined in August 2026 can choose a new fund in ${en(gesperrt.fruehestens)} at the earliest and is covered by it from 1 ${en(gesperrt.beginn)}. If the fund raises its rate in January, you may choose until the end of January and leave on 1 ${en(sonderJan.beginn)}.` },
      { q: 'Is it worth choosing in December if my fund raises its rate in January?', a: `Yes, by one month. Choose in December 2026 and the new fund starts on 1 ${en(sonderDez.beginn)}, so you pay the higher rate for ${sonderDez.monateErhoeht} months; choose in January and you pay it for ${sonderJan.monateErhoeht} months and switch on 1 ${en(sonderJan.beginn)}. Funds usually decide and publish January increases in December.` },
      { q: 'What should pensioners know about switching fund?', a: `The new fund also informs the pension insurance, so you apply for nothing there. A change in the additional rate reaches the pension only from the second month after it (section 247, sentence 3 SGB V): a rise on 1 January 2027 is deducted from your pension from ${en(rJan)}, and a switch takes effect correspondingly later.` },
    ],
    body: (h) => `
<h2>Three cases, worked through</h2>
${h.table(['Case', 'Join in', 'Last month old', 'New fund from', 'Months higher'], [
  ['Long-standing member, no rise', en({ y: 2026, m: 11 }), en(normal.letzterMonat), `1 ${en(normal.beginn)}`, '0'],
  ['Member since August 2026, rise in January', en({ y: 2026, m: 12 }), en(sonderDez.letzterMonat), `1 ${en(sonderDez.beginn)}`, String(sonderDez.monateErhoeht)],
  ['Member since August 2026, rise in January', en({ y: 2027, m: 1 }), en(sonderJan.letzterMonat), `1 ${en(sonderJan.beginn)}`, String(sonderJan.monateErhoeht)],
  ['Member since August 2026, no rise', en(gesperrt.fruehestens), en(gesperrt.letzterMonat), `1 ${en(gesperrt.beginn)}`, '0'],
], 'Worked out with the calculator above, rules of section 175(4) SGB V')}
<h2>What the calculator checks</h2>
<p>It first counts the lock-in: twelve months from the first month of membership, which must have run out by the time the old membership ends. Then it applies the notice period, which is the same however early or late in the month you choose: the month you join, two full months after it, then the new fund. If there is a rate rise, it checks whether you chose no later than the month the rise takes effect; if so the lock-in does not apply, and it shows how many months you still pay the higher rate and what that costs on your gross pay.</p>
<p>What a switch saves a year is shown by the ${h.a('home', 'calculator with every fund in your state')}; which fund charges what, by the ${h.a('zusatzbeitrag-liste', 'full list of additional rates')}.</p>
<h2>Exceptions people miss</h2>
<p>An optional tariff (Wahltarif) ties you longer: three years for a deductible, one year for a bonus for unused benefits (section 53(8) SGB V). The special right after a rate rise still applies, with one exception: the optional sick-pay tariff that mainly self-employed members take out. If membership ends by law, for example because you move into family cover or abroad, there is no lock-in. And a company fund (BKK) open only to its own staff can only be chosen while you work there.</p>
<p>Your cover continues without a gap: ongoing treatment, an approved aid or sick pay do not stop, the new fund takes over. The old fund’s health card stays valid until the last day of membership.</p>`,
  },
});
