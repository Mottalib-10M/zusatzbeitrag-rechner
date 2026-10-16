import { defineGuide } from '../../lib/guide-types';
import { rentner } from '../../lib/engine/beitrag';
import { renteAb } from '../../lib/engine/wechsel';
import { offen, kasse } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** Rentner (KVdR): §§ 247, 249a, 226, 229 SGB V, § 59 SGB XI. Alle Beispiele aus dem Motor. */
const w = J(2026), w7 = J(2027);
const zbD = w.zb_durchschnitt;
const r1600 = rentner({ rente: 1600, zb: zbD, jahr: 2026, eltern: 'k1' });
const r1600k = rentner({ rente: 1600, zb: zbD, jahr: 2026, eltern: 'kinderlos' });
const mitBr = rentner({ rente: 1600, betriebsrente: 350, zb: zbD, jahr: 2026, eltern: 'k1' });
const billig = offen()[0], teuer = offen()[offen().length - 1];
const spanne = Math.round((rentner({ rente: 1600, zb: teuer.zb!, jahr: 2026, eltern: 'k1' }).selbst - rentner({ rente: 1600, zb: billig.zb!, jahr: 2026, eltern: 'k1' }).selbst) * 12);
const renten = [1000, 1400, 1800, 2200, 2800];
const ab = renteAb({ y: 2027, m: 1 });
const MDE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const MEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const tk = kasse('techniker-krankenkasse');

export default defineGuide({
  id: 'krankenkassenbeitrag-rentner',
  group: 'rechner',
  order: 3,
  tool: 'beitrag',
  toolPreset: { status: 'rentner' },
  related: ['betriebsrente-krankenversicherung', 'krankenkasse-wechseln', 'pflegeversicherung-beitrag', 'zusatzbeitrag-liste', 'durchschnittlicher-zusatzbeitrag'],
  sources: ['sgb5_247', 'sgb5_249a', 'sgb5_226', 'sgb5_248', 'sgb11_59', 'sgb5_5', 'sgb6_106'],
  de: {
    slug: 'krankenkassenbeitrag-rentner',
    nav: 'Rentner',
    card: `Halber Satz auf die Rente, Pflege voll, Betriebsrente mit Freibetrag ${DE.eur(w.vbFrei, 2)}: Ihr Abzug im Monat bei jeder Kasse.`,
    title: 'Krankenkassenbeitrag Rentner 2027: Abzug von der Rente',
    description: 'Krankenkassenbeitrag für Rentner 2026/2027: halber Satz plus halber Zusatzbeitrag auf die Rente, Pflege allein, Betriebsrente mit Freibetrag, Abzug je Kasse.',
    h1: 'Krankenkassenbeitrag für Rentner: was von der Rente abgeht',
    intro: `Bei ${DE.eur(1600)} Rente und durchschnittlichem Zusatzbeitrag gehen ${DE.eur(r1600.selbst)} im Monat für Kranken- und Pflegeversicherung ab, kinderlos ${DE.eur(r1600k.selbst)}.`,
    resume: `Pflichtversicherte Rentner zahlen auf die gesetzliche Rente den halben allgemeinen Beitragssatz von ${DE.pz(w.kv_allgemein / 2)} und den halben Zusatzbeitrag ihrer Kasse; die andere Hälfte trägt die Rentenversicherung (§§ 247, 249a SGB V). Die Pflegeversicherung zahlen sie dagegen allein: ${DE.pz(w.pv_satz)} der Rente, kinderlos ${DE.pz(w.pv_satz + w.pv_kinderlos)}. Bei ${DE.eur(1600)} Rente und dem durchschnittlichen Zusatzbeitrag von ${DE.pz(zbD)} sind das ${DE.eur(r1600.kv.mitglied)} Krankenversicherung und ${DE.eur(r1600.pv.mitglied)} Pflege, zusammen ${DE.eur(r1600.selbst)} im Monat. Eine Betriebsrente kommt hinzu: Auf sie zahlen Rentner den vollen Satz allein, in der Krankenversicherung bleiben aber ${DE.eur(w.vbFrei, 2)} frei (2027: ${DE.eur(w7.vbFrei, 2)}). Zwischen der günstigsten und der teuersten frei wählbaren Kasse liegen bei ${DE.eur(1600)} Rente ${DE.eur(spanne)} im Jahr. Erhöht eine Kasse ihren Zusatzbeitrag, wird der neue Satz bei der Rente erst ab dem zweiten Folgemonat abgezogen.`,
    faqs: [
      { q: 'Warum zahle ich als Rentner die Pflege allein, die Krankenversicherung aber nur halb?', a: `Weil das Gesetz es so aufteilt: Für die Krankenversicherung trägt die Rentenversicherung die Hälfte des allgemeinen Satzes und des Zusatzbeitrags (§ 249a SGB V), für die Pflege gibt es keinen solchen Zuschuss (§ 59 Abs. 1 SGB XI). Bei ${DE.eur(1600)} Rente sind das ${DE.eur(r1600.pv.mitglied)} Pflege und ${DE.eur(r1600.kv.mitglied)} Krankenversicherung im Monat.` },
      { q: 'Ab wann zieht die Rentenversicherung einen höheren Zusatzbeitrag ab?', a: `Ab dem ersten Tag des zweiten Monats nach der Änderung (§ 247 Satz 3 SGB V). Erhöht Ihre Kasse zum 1. Januar 2027, wird der höhere Satz ab ${MDE[ab.m - 1]} ${ab.y} von der Rente abgezogen; Januar und Februar laufen noch mit dem alten. Dieselbe Verzögerung gilt, wenn Ihre Kasse den Satz senkt.` },
      { q: 'Wie viel Krankenkassenbeitrag zahle ich auf meine Betriebsrente?', a: `Den vollen allgemeinen Satz plus den vollen Zusatzbeitrag, allein. In der Krankenversicherung bleiben ${DE.eur(w.vbFrei, 2)} im Monat frei: Bei ${DE.eur(350)} Betriebsrente zahlen Sie ${DE.eur(mitBr.kv.mitglied - r1600.kv.mitglied)} Krankenversicherung. In der Pflege ist dieser Betrag nur eine Grenze: Darüber zählt die ganze Betriebsrente, hier ${DE.eur(mitBr.pv.mitglied - r1600.pv.mitglied)} Pflege.` },
      { q: 'Lohnt sich ein Kassenwechsel auch in der Rente?', a: `Ja, wenn der Unterschied groß genug ist. Weil die Rentenversicherung die Hälfte des Zusatzbeitrags trägt, sparen Sie nur die halbe Differenz: zwischen ${billig.kurz} und ${teuer.kurz} bei ${DE.eur(1600)} Rente ${DE.eur(spanne)} im Jahr. Die neue Kasse meldet den Wechsel auch der Rentenversicherung, Sie müssen dort nichts beantragen.` },
    ],
    body: (h) => `
<h2>Abzug von der Rente bei durchschnittlichem Zusatzbeitrag</h2>
${h.table(['Rente brutto', 'Krankenversicherung', 'Pflege mit Kind', 'Pflege kinderlos', 'Abzug mit Kind'], renten.map((r) => {
  const a = rentner({ rente: r, zb: zbD, jahr: 2026, eltern: 'k1' }); const b = rentner({ rente: r, zb: zbD, jahr: 2026, eltern: 'kinderlos' });
  return [h.eur(r), h.eur(a.kv.mitglied), h.eur(a.pv.mitglied), h.eur(b.pv.mitglied), h.eur(a.selbst)];
}), `2026, Zusatzbeitrag ${h.pz(zbD)}; mit dem Rechner oben für Ihre Kasse`, ['r', 'r', 'r', 'r', 'r'])}
<h2>Wer in der Rente pflichtversichert ist</h2>
<p>Pflichtversichert als Rentner (Krankenversicherung der Rentner, KVdR) ist, wer in der zweiten Hälfte seines Erwerbslebens zu mindestens neun Zehnteln gesetzlich versichert war, als Mitglied oder über die Familie. Wer die Vorversicherungszeit nicht erfüllt, bleibt freiwillig versichert und zahlt auf alle Einnahmen, also auch auf Mieten oder Kapitalerträge; die Rentenversicherung gibt dann einen Zuschuss in Höhe der halben Beiträge auf die Rente. Der Rechner oben rechnet die Pflichtversicherung.</p>
<p>Für die Betriebsrente gilt in beiden Fällen der volle Satz. Die Kasse holt ihn bei der Zahlstelle ab, also beim früheren Arbeitgeber, der Pensionskasse oder dem Versorgungswerk. Mehr dazu, mit einem eigenen Rechner: ${h.a('betriebsrente-krankenversicherung', 'Krankenversicherung auf die Betriebsrente')}.</p>
<h2>Was ein Wechsel in der Rente bringt</h2>
<p>Bei ${h.eur(1600)} Rente kostet jeder Zehntelpunkt Zusatzbeitrag ${h.eur(1600 * 0.1 / 200 * 12)} im Jahr, weil die Hälfte die Rentenversicherung trägt. Bei der ${tk.kurz} mit ${h.pk(tk.zb!)} zahlen Sie im Monat ${h.eur(rentner({ rente: 1600, zb: tk.zb!, jahr: 2026, eltern: 'k1' }).selbst)}. Ob sich ein Wechsel lohnt, zeigt die Rangliste im Rechner, nach Bundesland gefiltert. Die Fristen sind dieselben wie bei Beschäftigten (${h.a('krankenkasse-wechseln', 'Wechsel rechnen')}); nur der Abzug an der Rente folgt zwei Monate später.</p>`,
  },
  en: {
    slug: 'health-insurance-for-pensioners',
    nav: 'Pensioners',
    card: `Half the rate on your pension, care in full, company pension with a ${EN.eur(w.vbFrei, 2)} allowance: the monthly deduction at every fund.`,
    title: 'Health Insurance for Pensioners Germany 2027: Deductions',
    description: 'German health insurance for pensioners 2026/2027: half the rate plus half the additional rate on the state pension, care in full, company pensions, per fund.',
    h1: 'Health insurance for pensioners in Germany: what comes off the pension',
    intro: `On a ${EN.eur(1600)} pension and the average additional rate, ${EN.eur(r1600.selbst)} a month goes to health and care insurance, or ${EN.eur(r1600k.selbst)} if childless.`,
    resume: `Pensioners in Germany’s compulsory pensioners’ health insurance (Krankenversicherung der Rentner, KVdR) pay half the general rate, ${EN.pz(w.kv_allgemein / 2)}, plus half of their fund’s additional rate (Zusatzbeitrag) on the state pension; the pension insurance pays the other half (sections 247 and 249a of Book V of the Social Code). Long-term care insurance, by contrast, they pay alone: ${EN.pz(w.pv_satz)} of the pension, or ${EN.pz(w.pv_satz + w.pv_kinderlos)} if childless. On a ${EN.eur(1600)} pension and the average additional rate of ${EN.pz(zbD)}, that is ${EN.eur(r1600.kv.mitglied)} health and ${EN.eur(r1600.pv.mitglied)} care insurance, ${EN.eur(r1600.selbst)} a month in total. A company pension (Betriebsrente) is extra: pensioners pay the full rate on it alone, but ${EN.eur(w.vbFrei, 2)} is exempt for health insurance (${EN.eur(w7.vbFrei, 2)} in 2027). Between the cheapest and dearest open fund, a ${EN.eur(1600)} pension differs by ${EN.eur(spanne)} a year. When a fund raises its rate, the pension deduction changes only from the second month after.`,
    faqs: [
      { q: 'Why do pensioners pay care insurance in full but only half the health insurance?', a: `Because the law splits it that way: for health insurance the pension insurance pays half the general rate and half the additional rate (section 249a SGB V); there is no such subsidy for care insurance (section 59(1) SGB XI). On a ${EN.eur(1600)} pension that means ${EN.eur(r1600.pv.mitglied)} care and ${EN.eur(r1600.kv.mitglied)} health insurance a month.` },
      { q: 'When does the pension insurance start deducting a higher additional rate?', a: `From the first day of the second month after the change (section 247, sentence 3 SGB V). If your fund raises its rate on 1 January 2027, the higher rate is deducted from your pension from ${MEN[ab.m - 1]} ${ab.y}; January and February still run at the old rate. The same delay applies when a fund lowers its rate.` },
      { q: 'How much health insurance do I pay on my company pension?', a: `The full general rate plus the full additional rate, alone. For health insurance ${EN.eur(w.vbFrei, 2)} a month is exempt: on a ${EN.eur(350)} company pension you pay ${EN.eur(mitBr.kv.mitglied - r1600.kv.mitglied)} health insurance. For care insurance that amount is only a threshold: above it the whole company pension counts, here ${EN.eur(mitBr.pv.mitglied - r1600.pv.mitglied)} care.` },
      { q: 'Is switching fund worth it in retirement?', a: `Yes, if the gap is large enough. Because the pension insurance pays half the additional rate, you save only half the difference: between ${billig.kurz} and ${teuer.kurz}, ${EN.eur(spanne)} a year on a ${EN.eur(1600)} pension. The new fund also informs the pension insurance, so you apply for nothing there.` },
    ],
    body: (h) => `
<h2>Deduction from the pension at the average additional rate</h2>
${h.table(['Gross pension', 'Health', 'Care with child', 'Care childless', 'Deduction with child'], renten.map((r) => {
  const a = rentner({ rente: r, zb: zbD, jahr: 2026, eltern: 'k1' }); const b = rentner({ rente: r, zb: zbD, jahr: 2026, eltern: 'kinderlos' });
  return [h.eur(r), h.eur(a.kv.mitglied), h.eur(a.pv.mitglied), h.eur(b.pv.mitglied), h.eur(a.selbst)];
}), `2026, additional rate ${h.pz(zbD)}; use the calculator above for your fund`, ['r', 'r', 'r', 'r', 'r'])}
<h2>Who is in compulsory cover as a pensioner</h2>
<p>You are in compulsory pensioners’ cover (KVdR) if you were insured in the statutory system, as a member or through your family, for at least nine tenths of the second half of your working life. If you miss that qualifying period you remain a voluntary member and pay on all income, including rent or investment income; the pension insurance then pays a subsidy equal to half the contributions on the pension. The calculator above works out compulsory cover.</p>
<p>Company pensions pay the full rate either way. The fund collects it from the paying body: your former employer, the pension fund or the professional scheme. More on this, with its own calculator: ${h.a('betriebsrente-krankenversicherung', 'health insurance on a company pension')}.</p>
<h2>What switching achieves in retirement</h2>
<p>On a ${h.eur(1600)} pension each tenth of a point of additional rate costs ${h.eur(1600 * 0.1 / 200 * 12)} a year, because the pension insurance pays half. At ${tk.kurz}, ${h.pk(tk.zb!)}, you pay ${h.eur(rentner({ rente: 1600, zb: tk.zb!, jahr: 2026, eltern: 'k1' }).selbst)} a month. The ranking in the calculator, filtered by state, shows whether a switch pays. Deadlines are the same as for employees (${h.a('krankenkasse-wechseln', 'work out the dates')}); only the pension deduction follows two months later.</p>`,
  },
});
