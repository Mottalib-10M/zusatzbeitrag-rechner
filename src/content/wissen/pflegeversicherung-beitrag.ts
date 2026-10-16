import { defineGuide } from '../../lib/guide-types';
import { angestellt, rentner, pvZuAb, type Eltern } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** Beitrag zur sozialen Pflegeversicherung (§§ 55, 58, 59 SGB XI, PBAV 2025): Sätze nach Kinderzahl, Sachsen, Rentner. */
const w = J(2026), w27 = J(2027);
const zb = w.zb_durchschnitt;
const B = 3800;
const STUFEN: Array<{ e: Eltern; de: string; en: string }> = [
  { e: 'kinderlos', de: 'kinderlos, ab 23', en: 'childless, 23 or over' },
  { e: 'unter23', de: 'kinderlos, unter 23', en: 'childless, under 23' },
  { e: 'k1', de: 'ein Kind (oder alle Kinder über 25)', en: 'one child (or all children over 25)' },
  { e: 'k2', de: 'zwei Kinder unter 25', en: 'two children under 25' },
  { e: 'k3', de: 'drei Kinder unter 25', en: 'three children under 25' },
  { e: 'k4', de: 'vier Kinder unter 25', en: 'four children under 25' },
  { e: 'k5', de: 'fünf oder mehr unter 25', en: 'five or more under 25' },
];
const zeile = (e: Eltern, sachsen = false) => { const r = angestellt({ brutto: B, zb, jahr: 2026, sachsen, eltern: e }); return { an: r.pv.mitglied, ag: r.pv.andere, satzAn: w.pv_satz / 2 + (sachsen ? w.pv_sachsen_an_mehr : 0) + pvZuAb(e, w) }; };
const kl = zeile('kinderlos'), k1 = zeile('k1'), k5 = zeile('k5');
const sn = zeile('k1', true), snKl = zeile('kinderlos', true);
const diffKl = Math.round((kl.an - k1.an) * 12);
const diffK5 = Math.round((k1.an - k5.an) * 12);
const re = rentner({ rente: 1600, zb, jahr: 2026, eltern: 'kinderlos' }).pv.mitglied;
const reK1 = rentner({ rente: 1600, zb, jahr: 2026, eltern: 'k1' }).pv.mitglied;
const maxPv = angestellt({ brutto: w.bbgPv, zb, jahr: 2026, eltern: 'kinderlos' }).pv.mitglied;
const maxPv27 = angestellt({ brutto: w27.bbgKv, zb, jahr: 2027, eltern: 'kinderlos' }).pv.mitglied;

export default defineGuide({
  id: 'pflegeversicherung-beitrag',
  group: 'wissen',
  order: 84,
  mini: 'pflege',
  related: ['zusatzbeitrag-liste', 'beitragssatz-krankenkasse', 'krankenkassenbeitrag-rentner', 'arbeitgeberanteil-krankenversicherung'],
  sources: ['sgb11_55', 'pbav2025', 'sgb11_58', 'sgb11_59', 'bmgPflegeFinanzierung'],
  de: {
    slug: 'pflegeversicherung-beitrag',
    nav: 'Pflegeversicherung: Beitrag',
    card: `${DE.pz(w.pv_satz, 1)} Grundsatz, ${DE.num(w.pv_kinderlos, 1)} Punkte mehr für Kinderlose, ${DE.num(w.pv_abschlag_kind, 2)} Punkte weniger je Kind ab dem zweiten: Ihr Pflegebeitrag in Euro.`,
    title: 'Pflegeversicherung Beitrag 2027: Sätze, Kinder, Kinderlose',
    description: 'Pflegeversicherung 2026 und 2027: Beitragssatz, Zuschlag für Kinderlose, Abschläge für Eltern, Regel in Sachsen und Ihr Beitrag in Euro je nach Kinderzahl.',
    h1: 'Beitrag zur Pflegeversicherung: was Sie je nach Kinderzahl zahlen',
    intro: `Bei ${DE.eur(B)} brutto zahlen Kinderlose ab 23 ${DE.eur(kl.an, 2)} im Monat, Eltern mit einem Kind ${DE.eur(k1.an, 2)}, mit fünf Kindern unter 25 ${DE.eur(k5.an, 2)}.`,
    resume: `Der Beitragssatz zur sozialen Pflegeversicherung beträgt seit dem 1. Januar 2025 ${DE.pz(w.pv_satz, 1)} des beitragspflichtigen Einkommens (§ 55 SGB XI mit der Pflege-Beitragssatz-Anpassungsverordnung 2025) und gilt unverändert auch 2026. Beschäftigte und Arbeitgeber teilen ihn hälftig, nur in Sachsen tragen Beschäftigte ${DE.num(w.pv_sachsen_an_mehr, 1)} Punkte mehr. Wer 23 Jahre oder älter ist und keine Kinder hat, zahlt allein einen Zuschlag von ${DE.num(w.pv_kinderlos, 1)} Punkten. Eltern mit mehreren Kindern unter 25 zahlen weniger: ab dem zweiten bis zum fünften Kind je ${DE.num(w.pv_abschlag_kind, 2)} Punkte Abschlag. Bei ${DE.eur(B)} brutto ergibt das für Beschäftigte zwischen ${DE.eur(k5.an, 2)} und ${DE.eur(kl.an, 2)} im Monat; Kinderlose zahlen ${DE.eur(diffKl)} im Jahr mehr als Eltern eines Kindes. Rentner tragen den ganzen Beitrag selbst. Anders als in der Krankenversicherung gibt es keinen Zusatzbeitrag: Die Pflegeversicherung kostet bei jeder Kasse dasselbe, die Wahl der Kasse ändert daran nichts.`,
    faqs: [
      { q: 'Zahle ich bei einer günstigeren Krankenkasse auch weniger Pflegebeitrag?', a: 'Nein. Jede Krankenkasse führt eine Pflegekasse, aber deren Beitragssatz ist bundesweit gesetzlich festgelegt. Einen kassenindividuellen Zusatzbeitrag gibt es in der Pflegeversicherung nicht. Ein Kassenwechsel senkt nur den Zusatzbeitrag zur Krankenversicherung; Ihr Pflegebeitrag bleibt bei gleichem Einkommen und gleicher Kinderzahl auf den Cent gleich.' },
      { q: 'Wie weise ich nach, dass ich Kinder habe?', a: 'Beschäftigte melden Kinder beim Arbeitgeber, Selbstzahler bei ihrer Pflegekasse (§ 55 Abs. 3a SGB XI). Wo das automatisierte Übermittlungsverfahren nach § 55a SGB XI greift, kommen die Daten ohne Ihr Zutun; sonst belegen Sie mit Geburtsurkunde oder Steuerbescheinigung. Kommt der Nachweis innerhalb von sechs Monaten nach der Geburt, wirkt er ab dem Geburtsmonat, sonst erst ab dem Folgemonat.' },
      { q: 'Werden Kinder über 25 beim Abschlag noch berücksichtigt?', a: `Nein. Der Abschlag von ${DE.num(w.pv_abschlag_kind, 2)} Punkten je Kind gilt nur bis zum Ende des Monats, in dem das Kind 25 wird. Danach zählt es nur noch für die Elterneigenschaft: Wer ein Kind hat, zahlt keinen Kinderlosenzuschlag, auch wenn das Kind längst erwachsen ist. Mit ausschließlich über 25-jährigen Kindern zahlen Sie den Grundsatz von ${DE.pz(w.pv_satz / 2, 1)} als Beschäftigter.` },
      { q: 'Warum zahlen Beschäftigte in Sachsen mehr Pflegebeitrag?', a: `Bei Einführung der Pflegeversicherung 1995 strichen alle Länder einen Feiertag, um die Arbeitgeber zu entlasten, nur Sachsen behielt den Buß- und Bettag. Zum Ausgleich tragen dort Beschäftigte ${DE.num(w.pv_sachsen_an_mehr, 1)} Punkte mehr und Arbeitgeber entsprechend weniger (§ 58 Abs. 3 SGB XI). Maßgeblich ist der Beschäftigungsort, nicht der Wohnort. Bei ${DE.eur(B)} brutto sind das ${DE.eur(sn.an, 2)} statt ${DE.eur(k1.an, 2)} im Monat.` },
      { q: 'Wie viel Pflegebeitrag zahlen Rentner?', a: `Rentner tragen den Beitrag allein, die Rentenversicherung zahlt nichts dazu (§ 59 SGB XI). Bei ${DE.eur(1600)} gesetzlicher Rente sind das ${DE.eur(reK1, 2)} im Monat mit Kind und ${DE.eur(re, 2)} ohne Kind. Auch Betriebsrenten sind pflegebeitragspflichtig, sobald sie die Freigrenze von ${DE.eur(w.vbFrei, 2)} überschreiten, dann in voller Höhe.` },
      { q: 'Steigt der Pflegebeitrag 2027?', a: 'Nach geltendem Recht nicht: Satz, Zuschlag und Abschläge bleiben, wie sie sind. Der Regierungsentwurf des Pflegeneuordnungsgesetzes, vom Kabinett am 30. September 2026 beschlossen, sieht einen höheren Zuschlag für Kinderlose und eine höhere Beitragsbemessungsgrenze vor. Solange er nicht verkündet ist, rechnet diese Seite mit dem geltenden Recht; der Rechner wird umgestellt, sobald das Gesetz im Bundesgesetzblatt steht.' },
    ],
    body: (h) => `
<h2>Ein Satz für alle Kassen, aber nicht für alle Menschen</h2>
<p>In der Pflegeversicherung gibt es keinen Wettbewerb über den Preis. Der Satz von ${h.pz(w.pv_satz, 1)} gilt bei jeder Pflegekasse (${h.src('pbav2025', '§ 1 PBAV 2025')}); er unterscheidet sich nur nach Ihrer persönlichen Lage. Drei Merkmale entscheiden: ob Sie Kinder haben, wie viele davon jünger als 25 sind, und ob Sie in Sachsen arbeiten. Die Tabelle zeigt den Anteil von Beschäftigten bei ${h.eur(B)} brutto außerhalb Sachsens:</p>
${h.table(['Lage', 'Ihr Satz', 'Sie zahlen im Monat', 'Arbeitgeber'], STUFEN.map((s) => { const z = zeile(s.e); return [s.de, h.pz(z.satzAn, 2), h.eur(z.an, 2), h.eur(z.ag, 2)]; }), `${h.eur(B)} brutto, 2026, mit dem Motor dieser Seite gerechnet`, ['l', 'r', 'r', 'r'])}
<p>Der Arbeitgeber zahlt in jeder Zeile dasselbe, denn Zuschlag und Abschläge betreffen nach ${h.src('sgb11_58', '§ 58 SGB XI')} nur Ihren Anteil. Zwischen der teuersten und der günstigsten Zeile liegen bei diesem Lohn ${h.eur((kl.an - k5.an) * 12)} im Jahr.</p>
<h2>Kinderlosenzuschlag: wer ihn zahlt und wer nicht</h2>
<p>Den Zuschlag von ${h.num(w.pv_kinderlos, 1)} Punkten zahlen Mitglieder ab dem Monat nach ihrem 23. Geburtstag, wenn sie nie Eltern geworden sind. Als Eltern gelten auch Adoptiv-, Stief- und Pflegeeltern, wenn das Kind bei Aufnahme bestimmte Altersgrenzen noch nicht erreicht hatte (${h.src('sgb11_55', '§ 55 Abs. 3 und 4 SGB XI')}). Ein einziges Kind genügt auf Dauer, auch wenn es längst erwachsen ist. Vom Zuschlag befreit sind außerdem vor 1940 Geborene, Wehr- und Zivildienstleistende und Bezieher von Grundsicherungsgeld. Bei ${h.eur(B)} brutto macht der Zuschlag ${h.eur(diffKl)} im Jahr aus; an der Beitragsbemessungsgrenze von ${h.eur(w.bbgPv, 2)} zahlen Kinderlose ${h.eur(maxPv, 2)} Pflegebeitrag im Monat.</p>
<h2>Abschläge für Eltern mit mehreren Kindern</h2>
<p>Seit Juli 2023 belohnt die Pflegeversicherung größere Familien (§ 55 Abs. 3 Satz 4 SGB XI). Ab dem zweiten Kind sinkt der Anteil der Eltern je Kind um ${h.num(w.pv_abschlag_kind, 2)} Punkte, höchstens für vier Kinder, also bis zu ${h.num(-pvZuAb('k5', w), 2)} Punkte weniger. Gezählt werden nur Kinder, die jünger als 25 sind; mit jedem Geburtstag über diese Grenze fällt ein Abschlag weg, frühestens am Ende des Monats, in dem das Kind 25 wird. Eltern von fünf Kindern unter 25 zahlen bei ${h.eur(B)} brutto ${h.eur(diffK5)} im Jahr weniger als Eltern eines Kindes. Die Abschläge gelten für beide Elternteile, wenn beide versichert sind, und auch für Eltern, die selbst noch keine 23 sind.</p>
<h2>Sachsen: mehr für Beschäftigte, weniger für Arbeitgeber</h2>
<p>Sachsen ist das einzige Land, das 1995 keinen Feiertag aufgegeben hat. Zum Ausgleich verschiebt ${h.src('sgb11_58', '§ 58 Abs. 3 SGB XI')} einen Prozentpunkt: Beschäftigte tragen ${h.num(w.pv_sachsen_an_mehr, 1)} Punkte mehr, Arbeitgeber ${h.num(w.pv_sachsen_an_mehr, 1)} Punkte weniger. Bei ${h.eur(B)} brutto zahlen Beschäftigte mit Kind dort ${h.eur(sn.an, 2)} statt ${h.eur(k1.an, 2)}, Kinderlose ${h.eur(snKl.an, 2)}. Entscheidend ist der Ort der Beschäftigung: Wer in Thüringen wohnt und in Leipzig arbeitet, zahlt nach sächsischer Regel, wer in Dresden wohnt und in Berlin arbeitet, nach der allgemeinen. Welche Kassen in Sachsen wählbar sind und was sie kosten, zeigt die ${h.a('zusatzbeitrag-liste', 'Kassenliste mit Länderübersicht')}.</p>
<h2>Rentner, Selbstständige, Studierende</h2>
<p>Wer keinen Arbeitgeber hat, zahlt den ganzen Satz allein: Rentner auf ihre gesetzliche Rente und ihre Betriebsrente (${h.src('sgb11_59', '§ 59 SGB XI')}), freiwillig versicherte Selbstständige auf ihr Einkommen, mindestens auf ${h.eur(w.mindestFreiwillig, 2)} im Monat, Studierende auf den festen BAföG-Bedarf von ${h.eur(w.bafoeg_bedarf)}. Zuschlag und Abschläge gelten für sie genauso. Ein Rentner mit ${h.eur(1600)} Rente und Kind zahlt ${h.eur(reK1, 2)} im Monat; Einzelheiten unter ${h.a('krankenkassenbeitrag-rentner', 'Krankenkassenbeitrag für Rentner')}.</p>
<h2>Die Grenze der Pflegeversicherung 2027</h2>
<p>Für 2027 steigt die Beitragsbemessungsgrenze der Krankenversicherung auf ${h.eur(w27.bbgKv)} im Monat, die der Pflegeversicherung nach geltendem Recht nur auf ${h.eur(w27.bbgPv)}. Wer darüber verdient, zahlt 2027 höchstens ${h.eur(maxPv27, 2)} Pflegebeitrag als kinderloser Beschäftigter; der Entwurf des Pflegeneuordnungsgesetzes würde das ändern (${h.a('beitragsbemessungsgrenze', 'Beitragsbemessungsgrenze')}). Gerechnet wird hier nur, was gilt; ein Entwurf kann sich im Bundestag noch ändern, und erst die Verkündung macht ihn verbindlich.</p>`,
  },
  en: {
    slug: 'long-term-care-contribution',
    nav: 'Care insurance contribution',
    card: `${EN.pz(w.pv_satz, 1)} base rate, ${EN.num(w.pv_kinderlos, 1)} points more if childless, ${EN.num(w.pv_abschlag_kind, 2)} points less per child from the second: your care contribution in euros.`,
    title: 'Long-Term Care Contribution Germany 2027: Rates and Children',
    description: 'German long-term care insurance 2026 and 2027: the rate, childless surcharge, discounts for parents, the Saxony rule and your cost in euros by family size.',
    h1: 'Long-term care contributions: what you pay by number of children',
    intro: `On ${EN.eur(B)} gross, childless members aged 23 or over pay ${EN.eur(kl.an, 2)} a month, parents of one child ${EN.eur(k1.an, 2)}, with five children under 25 ${EN.eur(k5.an, 2)}.`,
    resume: `The contribution rate for statutory long-term care insurance (Pflegeversicherung) has been ${EN.pz(w.pv_satz, 1)} of contributory income since 1 January 2025 (section 55 of Book XI of the Social Code with the 2025 rate ordinance) and is unchanged in 2026. Employees and employers split it equally; only in Saxony do employees carry ${EN.num(w.pv_sachsen_an_mehr, 1)} points more. Members aged 23 or over who have no children pay a surcharge of ${EN.num(w.pv_kinderlos, 1)} points on their own. Parents of several children under 25 pay less: ${EN.num(w.pv_abschlag_kind, 2)} points off for each child from the second to the fifth. On ${EN.eur(B)} gross that puts an employee’s share between ${EN.eur(k5.an, 2)} and ${EN.eur(kl.an, 2)} a month; childless members pay ${EN.eur(diffKl)} a year more than parents of one child. Pensioners pay the whole contribution themselves. Unlike health insurance there is no additional rate: care insurance costs the same at every fund, so your choice of fund makes no difference to it.`,
    faqs: [
      { q: 'Does a cheaper health fund also mean a lower care contribution?', a: 'No. Every health fund runs a care fund, but the care rate is fixed by law nationwide. There is no fund-specific additional rate in care insurance. Switching fund only lowers the additional rate on health insurance; with the same income and number of children your care contribution stays the same to the cent.' },
      { q: 'How do I prove that I have children?', a: 'Employees report children to their employer, self-payers to their care fund (section 55(3a) SGB XI). Where the automated procedure under section 55a SGB XI applies, the data arrive without your doing anything; otherwise you provide a birth certificate or tax document. Proof given within six months of a birth counts from the month of birth, otherwise only from the following month.' },
      { q: 'Do children over 25 still count for the discount?', a: `No. The ${EN.num(w.pv_abschlag_kind, 2)}-point discount per child only runs until the end of the month in which the child turns 25. After that the child counts only for parenthood: anyone who has a child pays no childless surcharge, however old the child is. With only children over 25 an employee pays the base share of ${EN.pz(w.pv_satz / 2, 1)}.` },
      { q: 'Why do employees in Saxony pay more care contribution?', a: `When care insurance began in 1995, every state abolished a public holiday to relieve employers, except Saxony, which kept the Day of Repentance and Prayer. In return employees there carry ${EN.num(w.pv_sachsen_an_mehr, 1)} points more and employers that much less (section 58(3) SGB XI). Your place of work counts, not your home. On ${EN.eur(B)} gross that is ${EN.eur(sn.an, 2)} instead of ${EN.eur(k1.an, 2)} a month.` },
      { q: 'How much care contribution do pensioners pay?', a: `Pensioners pay it alone; the pension insurance adds nothing (section 59 SGB XI). On a ${EN.eur(1600)} state pension that is ${EN.eur(reK1, 2)} a month with a child and ${EN.eur(re, 2)} without. Company pensions are also liable once they exceed the threshold of ${EN.eur(w.vbFrei, 2)}, and then in full.` },
      { q: 'Will the care contribution rise in 2027?', a: 'Not under current law: rate, surcharge and discounts stay as they are. The government’s draft Care Reorganisation Act, adopted by the cabinet on 30 September 2026, would raise the childless surcharge and the contribution ceiling. Until it is published as law, this site calculates with the law in force and will switch over once the act appears in the Federal Law Gazette.' },
    ],
    body: (h) => `
<h2>One rate for every fund, but not for every person</h2>
<p>There is no price competition in care insurance. The rate of ${h.pz(w.pv_satz, 1)} applies at every care fund (${h.src('pbav2025', 'section 1 PBAV 2025')}); it only varies with your personal situation. Three things decide it: whether you have children, how many of them are under 25, and whether you work in Saxony. The table shows an employee’s share on ${h.eur(B)} gross outside Saxony:</p>
${h.table(['Situation', 'Your rate', 'You pay a month', 'Employer'], STUFEN.map((s) => { const z = zeile(s.e); return [s.en, h.pz(z.satzAn, 2), h.eur(z.an, 2), h.eur(z.ag, 2)]; }), `${h.eur(B)} gross, 2026, worked out with this site’s engine`, ['l', 'r', 'r', 'r'])}
<p>The employer pays the same on every row, because under ${h.src('sgb11_58', 'section 58 SGB XI')} surcharge and discounts only affect your share. Between the most and the least expensive row lie ${h.eur((kl.an - k5.an) * 12)} a year at this pay.</p>
<h2>The childless surcharge: who pays it and who does not</h2>
<p>The ${h.num(w.pv_kinderlos, 1)} points surcharge applies from the month after your 23rd birthday if you have never been a parent. Adoptive, step and foster parents count as parents if the child had not passed certain ages when it joined the family (${h.src('sgb11_55', 'section 55(3) and (4) SGB XI')}). A single child is enough for good, even if the child grew up long ago. People born before 1940, those doing military or civilian service and recipients of basic income support are also exempt. On ${h.eur(B)} gross the surcharge comes to ${h.eur(diffKl)} a year; at the care ceiling of ${h.eur(w.bbgPv, 2)} a childless employee pays ${h.eur(maxPv, 2)} a month.</p>
<h2>Discounts for parents of several children</h2>
<p>Since July 2023 care insurance rewards larger families (section 55(3), sentence 4 SGB XI). From the second child, the parent’s share falls by ${h.num(w.pv_abschlag_kind, 2)} points per child, for at most four children, so up to ${h.num(-pvZuAb('k5', w), 2)} points less. Only children under 25 count; each discount lapses at the end of the month in which that child turns 25. Parents of five children under 25 pay ${h.eur(diffK5)} a year less on ${h.eur(B)} gross than parents of one. The discounts apply to both parents if both are insured, and to parents who are not yet 23 themselves.</p>
<h2>Saxony: more for employees, less for employers</h2>
<p>Saxony is the only state that gave up no public holiday in 1995. In return ${h.src('sgb11_58', 'section 58(3) SGB XI')} shifts one percentage point: employees carry ${h.num(w.pv_sachsen_an_mehr, 1)} points more and employers ${h.num(w.pv_sachsen_an_mehr, 1)} points less. On ${h.eur(B)} gross, employees with a child pay ${h.eur(sn.an, 2)} there instead of ${h.eur(k1.an, 2)}, childless employees ${h.eur(snKl.an, 2)}. The place of work decides: live in Thuringia and work in Leipzig and the Saxon rule applies; live in Dresden and work in Berlin and it does not. Which funds are open in Saxony, and what they cost, is in the ${h.a('zusatzbeitrag-liste', 'fund list with its state overview')}.</p>
<h2>Pensioners, self-employed, students</h2>
<p>Without an employer you pay the whole rate yourself: pensioners on their state and company pensions (${h.src('sgb11_59', 'section 59 SGB XI')}), self-employed voluntary members on their income, at least on ${h.eur(w.mindestFreiwillig, 2)} a month, students on the fixed BAföG need rate of ${h.eur(w.bafoeg_bedarf)}. Surcharge and discounts apply to them in the same way. A pensioner with a ${h.eur(1600)} pension and a child pays ${h.eur(reK1, 2)} a month; details under ${h.a('krankenkassenbeitrag-rentner', 'health contributions for pensioners')}.</p>
<h2>The care ceiling in 2027</h2>
<p>For 2027 the health insurance ceiling rises to ${h.eur(w27.bbgKv)} a month, the care ceiling under current law only to ${h.eur(w27.bbgPv)}. If you earn more, the most a childless employee pays in 2027 is ${h.eur(maxPv27, 2)} a month in care contributions; the draft Care Reorganisation Act would change this (${h.a('beitragsbemessungsgrenze', 'contribution ceiling')}). Only what is in force is calculated here.</p>`,
  },
});
