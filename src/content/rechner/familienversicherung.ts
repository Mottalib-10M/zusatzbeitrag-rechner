import { defineGuide } from '../../lib/guide-types';
import { angestellt } from '../../lib/engine/beitrag';
import { J, P, DE, EN } from '../../lib/fmt';

/** Familienversicherung § 10 SGB V; Ehegattenzuschlag § 242b SGB V ab 2028 (BGBl. 2026 I Nr. 228). */
const w = J(2026), w7 = J(2027);
const Z = P.ehegattenzuschlag_2028;
const zu = (b: number) => Math.round(Math.min(b, w7.bbgKv) * Z.punkte) / 100;
const loehne = [2500, 3500, 4500, 6375];
const bsp = angestellt({ brutto: 4000, zb: w.zb_durchschnitt, jahr: 2026, eltern: 'k1' });

export default defineGuide({
  id: 'familienversicherung',
  group: 'rechner',
  order: 6,
  tool: 'familie',
  related: ['krankenkasse-studenten', 'midijob-krankenversicherung', 'freiwillig-versichert', 'zusatzbeitrag-liste', 'pflegeversicherung-beitrag'],
  sources: ['sgb5_10', 'bgblStabG', 'sgb4_8', 'bmasRg2026', 'bmasRg2027'],
  de: {
    slug: 'familienversicherung-einkommensgrenze',
    nav: 'Familienversicherung',
    card: `Beitragsfrei bis ${DE.eur(w.famGrenze)} im Monat (2027: ${DE.eur(w7.famGrenze)}), mit Minijob bis ${DE.eur(w.geringfuegigkeit)}; ab 2028 Zuschlag für Ehepartner.`,
    title: 'Familienversicherung Einkommensgrenze 2027: Grenze prüfen',
    description: 'Familienversicherung 2026/2027: Einkommensgrenze für Ehepartner und Kinder, Minijob, Altersgrenzen, und was der neue Zuschlag für Ehepartner ab 2028 kostet.',
    h1: 'Familienversicherung: Einkommensgrenze 2026 und 2027',
    intro: `Ehepartner und Kinder sind 2026 beitragsfrei mitversichert, solange ihr Einkommen ${DE.eur(w.famGrenze)} im Monat nicht übersteigt, mit Minijob ${DE.eur(w.geringfuegigkeit)}.`,
    resume: `Ehepartner, eingetragene Lebenspartner und Kinder eines Mitglieds sind in der gesetzlichen Krankenversicherung beitragsfrei mitversichert, wenn ihr regelmäßiges Gesamteinkommen ein Siebtel der Bezugsgröße nicht übersteigt (§ 10 Abs. 1 Nr. 5 SGB V): ${DE.eur(w.famGrenze)} im Monat 2026 und, mit der Bezugsgröße 2027, ${DE.eur(w7.famGrenze)}. Wer einen Minijob hat, darf bis zur Minijob-Grenze verdienen, ${DE.eur(w.geringfuegigkeit)} im Jahr 2026 und ${DE.eur(w7.geringfuegigkeit)} im Jahr 2027. Kinder sind bis 18 mitversichert, bis 23 ohne Erwerbstätigkeit und bis 25 in Schule, Ausbildung oder Studium. Neu ist ein Zuschlag, den das GKV-Beitragssatzstabilisierungsgesetz vom 24. Juli 2026 einführt: Ab dem 1. Januar 2028 zahlen Mitglieder für einen familienversicherten Ehepartner ${DE.pz(Z.punkte)} mehr Beitrag, allein und ohne Arbeitgeberanteil (§ 242b SGB V). Bei ${DE.eur(4000)} brutto wären das ${DE.eur(zu(4000))} im Monat. Ausgenommen sind unter anderem Paare mit einem Kind unter ${Z.kind_unter} Jahren im Haushalt, pflegende und erwerbsgeminderte Partner und Partner im Rentenalter.`,
    faqs: [
      { q: 'Was zählt zum Gesamteinkommen bei der Familienversicherung?', a: `Alle Einkünfte im Sinne des Steuerrechts als Monatsdurchschnitt: Lohn, Gewinn aus Selbstständigkeit, Mieteinnahmen, Kapitalerträge über dem Sparer-Pauschbetrag und Renten ohne den Anteil für Kindererziehungszeiten. Steuerfreie Leistungen wie das Elterngeld zählen nicht. Die Grenze 2026 liegt bei ${DE.eur(w.famGrenze)}, mit Minijob bei ${DE.eur(w.geringfuegigkeit)}.` },
      { q: 'Was passiert, wenn mein Minijob die Grenze übersteigt?', a: `Dann endet die Familienversicherung, und es beginnt eine eigene Versicherung: über die Beschäftigung, wenn sie mehr als geringfügig ist (Übergangsbereich ab ${DE.eur(w.geringfuegigkeit + 0.01, 2)}), sonst als freiwilliges Mitglied. Ein gelegentliches, nicht vorhersehbares Überschreiten in höchstens zwei Monaten im Jahr ist erlaubt (§ 8 Abs. 1b SGB IV).` },
      { q: 'Wer zahlt den Zuschlag für Ehepartner ab 2028?', a: `Das Mitglied allein, nicht der Arbeitgeber: ${DE.pz(Z.punkte)} auf seine beitragspflichtigen Einnahmen bis zur Beitragsbemessungsgrenze, bei Beschäftigten über die Lohnabrechnung (§ 242b Abs. 2 SGB V). Auf Renten wird er nicht vor dem 1. Juli 2028 erhoben. Kinder bleiben in jedem Fall beitragsfrei.` },
      { q: 'Kann mein Kind familienversichert bleiben, wenn ein Elternteil privat versichert ist?', a: 'Nur wenn der gesetzlich versicherte Elternteil mehr verdient oder der privat versicherte Elternteil unter der Versicherungspflichtgrenze bleibt. Ist der privat versicherte Ehegatte der Besserverdiener und liegt er über der Grenze, ist das Kind nicht familienversichert (§ 10 Abs. 3 SGB V) und braucht eine eigene Versicherung.' },
    ],
    body: (h) => `
<h2>Die Grenzen 2026 und 2027</h2>
${h.table(['', '2026', '2027 (vorläufig)'], [
  ['Einkommensgrenze (ein Siebtel der Bezugsgröße)', h.eur(w.famGrenze), h.eur(w7.famGrenze)],
  ['Grenze mit Minijob', h.eur(w.geringfuegigkeit), h.eur(w7.geringfuegigkeit)],
  ['Bezugsgröße im Monat', h.eur(w.bezugsgroesse_monat), h.eur(w7.bezugsgroesse_monat)],
], 'Nach § 10 Abs. 1 SGB V; 2027 mit der Bezugsgröße aus dem Kabinettsbeschluss vom 7. Oktober 2026', ['l', 'r', 'r'])}
<h2>Der Ehegattenzuschlag ab 2028 in Euro</h2>
<p>Was der Zuschlag kostet, hängt nur vom Einkommen des Mitglieds ab, nicht von der Kasse. Gerechnet mit der Beitragsbemessungsgrenze 2027, weil die für 2028 noch nicht feststeht:</p>
${h.table(['Bruttolohn des Mitglieds', 'Zuschlag im Monat', 'im Jahr'], loehne.map((b) => [h.eur(b), h.eur(zu(b)), h.eur(zu(b) * 12)]), `${h.pz(Z.punkte)} nach § 242b SGB V, ohne Arbeitgeberanteil`, ['r', 'r', 'r'])}
<p>Zum Vergleich: Ein Beschäftigter mit ${h.eur(4000)} brutto zahlt heute ${h.eur(bsp.kv.mitglied)} Krankenversicherung im Monat; der Zuschlag erhöht seinen Anteil also spürbar. Er entfällt, solange ein Kind unter ${Z.kind_unter} Jahren im Haushalt des Ehepartners lebt oder ein Kind mit Behinderung sich nicht selbst unterhalten kann, wenn der Ehepartner einen Angehörigen mit mindestens Pflegegrad 2 zehn Stunden in der Woche pflegt, Pflegezeit nimmt, die Regelaltersgrenze erreicht hat, selbst mindestens Pflegegrad 3 hat, voll erwerbsgemindert ist oder einen Grad der Behinderung von mindestens 60 hat. Die Kasse berücksichtigt Ausnahmen, die sie kennt, auch ohne Antrag.</p>
<h2>Wann sich eine eigene Versicherung trotzdem lohnt</h2>
<p>Wer knapp über der Grenze liegt, zahlt als freiwilliges Mitglied mindestens den Beitrag auf ${h.eur(w.mindestFreiwillig, 2)}. Ein Minijob bis ${h.eur(w.geringfuegigkeit)} hält die Familienversicherung dagegen, und eine Beschäftigung im Übergangsbereich kostet anfangs nur wenig (${h.a('midijob-krankenversicherung', 'Midijob rechnen')}). Studierende über 25 wechseln in die ${h.a('krankenkasse-studenten', 'studentische Versicherung')}.</p>`,
  },
  en: {
    slug: 'family-insurance-income-limit',
    nav: 'Family insurance',
    card: `Free cover up to ${EN.eur(w.famGrenze)} a month (2027: ${EN.eur(w7.famGrenze)}), ${EN.eur(w.geringfuegigkeit)} with a minijob; a spouse surcharge from 2028.`,
    title: 'Family Insurance Germany Income Limit 2027: Check Your Case',
    description: 'German family health insurance 2026/2027: the income limit for spouses and children, minijobs, age limits and what the new spouse surcharge from 2028 will cost.',
    h1: 'Family insurance in Germany: the income limit for 2026 and 2027',
    intro: `In 2026 spouses and children are covered free of charge as long as their income stays at or below ${EN.eur(w.famGrenze)} a month, or ${EN.eur(w.geringfuegigkeit)} with a minijob.`,
    resume: `In Germany’s statutory health insurance, a member’s spouse, registered partner and children are covered free of charge (Familienversicherung) if their regular total income does not exceed one seventh of the reference value (section 10(1) no. 5 of Book V of the Social Code): ${EN.eur(w.famGrenze)} a month in 2026 and, with the 2027 reference value, ${EN.eur(w7.famGrenze)}. With a minijob they may earn up to the minijob limit, ${EN.eur(w.geringfuegigkeit)} in 2026 and ${EN.eur(w7.geringfuegigkeit)} in 2027. Children are covered until 18, until 23 if not working and until 25 in school, training or university. New is a surcharge introduced by the contribution stabilisation act of 24 July 2026: from 1 January 2028, members pay ${EN.pz(Z.punkte)} more for a spouse in family cover, alone and with no employer share (section 242b SGB V). On ${EN.eur(4000)} gross that would be ${EN.eur(zu(4000))} a month. Exempt are, among others, couples with a child under ${Z.kind_unter} in the household, spouses who care for a relative or have reduced earning capacity, and spouses of pension age.`,
    faqs: [
      { q: 'What counts as total income for family insurance?', a: `All income in the tax sense as a monthly average: wages, self-employed profit, rent, investment income above the saver’s allowance and pensions excluding the child-raising component. Tax-free benefits such as parental allowance (Elterngeld) do not count. The 2026 limit is ${EN.eur(w.famGrenze)}, or ${EN.eur(w.geringfuegigkeit)} with a minijob.` },
      { q: 'What happens if my minijob goes over the limit?', a: `Family cover ends and your own insurance starts: through the job if it is more than marginal (transition zone from ${EN.eur(w.geringfuegigkeit + 0.01, 2)}), otherwise as a voluntary member. Occasional, unforeseeable overruns in at most two months a year are allowed (section 8(1b) SGB IV).` },
      { q: 'Who pays the spouse surcharge from 2028?', a: `The member alone, not the employer: ${EN.pz(Z.punkte)} on their contributory income up to the ceiling, deducted through payroll for employees (section 242b(2) SGB V). It is not charged on pensions before 1 July 2028. Children stay free of charge in every case.` },
      { q: 'Can my child stay in family cover if one parent is privately insured?', a: 'Only if the statutorily insured parent earns more, or the privately insured parent stays below the compulsory insurance threshold. If the privately insured spouse is the higher earner and above the threshold, the child is not in family cover (section 10(3) SGB V) and needs insurance of its own.' },
    ],
    body: (h) => `
<h2>The limits for 2026 and 2027</h2>
${h.table(['', '2026', '2027 (provisional)'], [
  ['Income limit (one seventh of the reference value)', h.eur(w.famGrenze), h.eur(w7.famGrenze)],
  ['Limit with a minijob', h.eur(w.geringfuegigkeit), h.eur(w7.geringfuegigkeit)],
  ['Reference value a month', h.eur(w.bezugsgroesse_monat), h.eur(w7.bezugsgroesse_monat)],
], 'Under section 10(1) SGB V; 2027 using the reference value from the cabinet decision of 7 October 2026', ['l', 'r', 'r'])}
<h2>The spouse surcharge from 2028 in euros</h2>
<p>What the surcharge costs depends only on the member’s income, not on the fund. Worked out with the 2027 contribution ceiling, as the 2028 ceiling is not yet set:</p>
${h.table(['Member’s gross pay', 'Surcharge a month', 'a year'], loehne.map((b) => [h.eur(b), h.eur(zu(b)), h.eur(zu(b) * 12)]), `${h.pz(Z.punkte)} under section 242b SGB V, no employer share`, ['r', 'r', 'r'])}
<p>For comparison: an employee on ${h.eur(4000)} gross pays ${h.eur(bsp.kv.mitglied)} health insurance a month today, so the surcharge is a noticeable increase. It does not apply while a child under ${Z.kind_unter} lives in the spouse’s household or a disabled child cannot support itself, or if the spouse cares at least ten hours a week for a relative with care grade 2 or higher, takes care leave, has reached pension age, has care grade 3 or higher, has full reduced earning capacity or a disability degree of at least 60. Funds apply exceptions they know of even without an application.</p>
<h2>When your own cover makes sense anyway</h2>
<p>Just above the limit, a voluntary membership costs at least the contribution on ${h.eur(w.mindestFreiwillig, 2)}. A minijob up to ${h.eur(w.geringfuegigkeit)} keeps family cover, and a job in the transition zone costs little at first (${h.a('midijob-krankenversicherung', 'work out a midijob')}). Students over 25 move to ${h.a('krankenkasse-studenten', 'student cover')}.</p>`,
  },
});
