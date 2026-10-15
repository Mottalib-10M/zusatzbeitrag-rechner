import { defineGuide } from '../../lib/guide-types';
import { angestellt, selbststaendig, student } from '../../lib/engine/beitrag';
import { kasse, offen, statistik } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';
import { kLink } from '../../lib/kassen-daten';

/** Beitragssatz der Krankenkasse: allgemeiner, ermäßigter und studentischer Satz plus Zusatzbeitrag, Teilung, Gesamtsozialversicherungsbeitrag. */
const w = J(2026);
const zb = w.zb_durchschnitt;
const B = 3800;
const st = statistik(offen());
const gesamt = w.kv_allgemein + zb;
const svGesamt = w.rv_satz + w.av_satz + w.pv_satz + gesamt;
const svAn = svGesamt / 2;
const GROSS = ['techniker-krankenkasse', 'barmer', 'dak-gesundheit', 'aok-bayern-die-gesundheitskasse', 'ikk-classic', 'knappschaft'].map((id) => kasse(id));
const r = angestellt({ brutto: B, zb, jahr: 2026, eltern: 'k1' });
const sMit = selbststaendig({ einkommen: 3000, zb, jahr: 2026, krankengeld: true, eltern: 'k1' }).kv.mitglied;
const sOhne = selbststaendig({ einkommen: 3000, zb, jahr: 2026, krankengeld: false, eltern: 'k1' }).kv.mitglied;
const stud = student({ zb, jahr: 2026, eltern: 'unter23' }).kv.mitglied;
const spanneMonat = angestellt({ brutto: B, zb: st.max, jahr: 2026, eltern: 'k1' }).kv.mitglied - angestellt({ brutto: B, zb: st.min, jahr: 2026, eltern: 'k1' }).kv.mitglied;

export default defineGuide({
  id: 'beitragssatz-krankenkasse',
  group: 'wissen',
  order: 85,
  mini: 'gesamtsatz',
  related: ['durchschnittlicher-zusatzbeitrag', 'arbeitgeberanteil-krankenversicherung', 'pflegeversicherung-beitrag', 'zusatzbeitrag-liste', 'krankenkasse-studenten'],
  sources: ['sgb5_241', 'sgb5_243', 'sgb5_245', 'sgb5_249', 'sgb5_242'],
  de: {
    slug: 'beitragssatz-krankenkasse',
    nav: 'Beitragssatz der Krankenkasse',
    card: `${DE.pz(w.kv_allgemein, 1)} plus Zusatzbeitrag, je zur Hälfte: wie sich der Satz Ihrer Kasse zusammensetzt und was er in Euro bedeutet.`,
    title: 'Beitragssatz Krankenkasse 2026: allgemein plus Zusatzbeitrag',
    description: 'Beitragssatz der Krankenkasse 2026 und 2027: allgemeiner, ermäßigter und studentischer Satz, der Zusatzbeitrag Ihrer Kasse, wer welchen Anteil trägt, in Euro.',
    h1: 'Beitragssatz der Krankenkasse: woraus er besteht und wer ihn trägt',
    intro: `${DE.pz(w.kv_allgemein, 1)} für alle plus der Zusatzbeitrag Ihrer Kasse, heute ${DE.pk(st.min)} bis ${DE.pk(st.max)}; Beschäftigte und Arbeitgeber zahlen je die Hälfte.`,
    resume: `Der Beitragssatz der gesetzlichen Krankenversicherung hat zwei Teile. Der allgemeine Beitragssatz von ${DE.pz(w.kv_allgemein, 1)} ist gesetzlich festgelegt und bei jeder Kasse gleich (§ 241 SGB V). Dazu kommt der Zusatzbeitrag, den jede Kasse selbst bestimmt; laut Liste des GKV-Spitzenverbands liegt er bei den frei wählbaren Kassen heute zwischen ${DE.pk(st.min)} und ${DE.pk(st.max)}. Mit dem amtlichen Durchschnitt von ${DE.pz(zb, 1)} ergibt das einen Gesamtsatz von ${DE.pz(gesamt, 1)}. Seit 2019 teilen sich Beschäftigte und Arbeitgeber beide Teile hälftig, Ihr Anteil beträgt also ${DE.pz(gesamt / 2, 2)} des Bruttolohns bis zur Beitragsbemessungsgrenze; bei ${DE.eur(B)} sind das ${DE.eur(r.kv.mitglied, 2)} im Monat. Wer keinen Anspruch auf Krankengeld hat, zahlt den ermäßigten Satz von ${DE.pz(w.kv_ermaessigt, 1)}, Studierende sieben Zehntel des allgemeinen Satzes, ${DE.pz(w.kvStudent, 2)}. Die Pflegeversicherung kommt mit ${DE.pz(w.pv_satz, 1)} gesondert hinzu und ist kein Teil des Krankenkassenbeitrags.`,
    faqs: [
      { q: 'Wie hoch ist der Beitragssatz meiner Krankenkasse insgesamt?', a: `${DE.pz(w.kv_allgemein, 1)} plus der Zusatzbeitrag Ihrer Kasse. Bei der Techniker Krankenkasse mit ${DE.pk(GROSS[0].zb!)} sind das ${DE.pz(w.kv_allgemein + GROSS[0].zb!, 2)}, bei BARMER mit ${DE.pk(GROSS[1].zb!)} ${DE.pz(w.kv_allgemein + GROSS[1].zb!, 2)}. Den Zusatzbeitrag Ihrer Kasse finden Sie in der amtlichen Liste oder auf Ihrer Gehaltsabrechnung, meist als Prozentsatz neben der Zeile Krankenversicherung.` },
      { q: 'Seit wann zahlt der Arbeitgeber auch den Zusatzbeitrag zur Hälfte?', a: 'Seit dem 1. Januar 2019, durch das GKV-Versichertenentlastungsgesetz. Davor trugen Beschäftigte den Zusatzbeitrag allein, und nur der allgemeine Satz war geteilt. Heute regelt § 249 SGB V die hälftige Teilung beider Teile. Für Rentner übernimmt die Rentenversicherung die andere Hälfte; Selbstständige und Studierende tragen den ganzen Satz selbst.' },
      { q: 'Wann gilt der ermäßigte Beitragssatz?', a: `Für Mitglieder ohne Anspruch auf Krankengeld (§ 243 SGB V), vor allem freiwillig versicherte Selbstständige, die keine Wahlerklärung für Krankengeld abgegeben haben, und Bezieher einer Vollrente wegen Alters, die nebenbei arbeiten, weil sie keinen Anspruch auf Krankengeld haben (§ 50 Abs. 1 SGB V). Der Satz liegt bei ${DE.pz(w.kv_ermaessigt, 1)} statt ${DE.pz(w.kv_allgemein, 1)}; der Zusatzbeitrag kommt in voller Höhe hinzu. Bei ${DE.eur(3000)} Gewinn spart das ${DE.eur(sMit - sOhne, 2)} im Monat.` },
      { q: 'Ist der Pflegebeitrag im Beitragssatz der Krankenkasse enthalten?', a: `Nein. Die Pflegeversicherung ist ein eigener Versicherungszweig mit eigenem Satz von ${DE.pz(w.pv_satz, 1)}, der bei jeder Kasse gleich ist. Die Krankenkasse zieht ihn nur mit ein und leitet ihn an ihre Pflegekasse weiter. Auf der Gehaltsabrechnung stehen Kranken- und Pflegeversicherung deshalb in getrennten Zeilen.` },
      { q: 'Wie viel Prozent vom Brutto gehen insgesamt an die Sozialversicherung?', a: `Mit durchschnittlichem Zusatzbeitrag ${DE.pz(svGesamt, 1)} für Rente, Arbeitslosigkeit, Pflege und Krankheit zusammen, davon tragen Beschäftigte ${DE.pz(svAn, 2)} und Kinderlose ab 23 zusätzlich ${DE.num(w.pv_kinderlos, 1)} Punkte. Dieser Gesamtsozialversicherungsbeitragssatz zum 1. Januar dient auch als Grundlage für den Faktor F im Übergangsbereich bis ${DE.eur(w.uebergang_oben)}.` },
    ],
    body: (h) => `
<h2>Zwei Bausteine, ein Satz</h2>
<p>Der Krankenkassenbeitrag setzt sich aus einem festen und einem beweglichen Teil zusammen. Fest ist der allgemeine Beitragssatz von ${h.pz(w.kv_allgemein, 1)} (${h.src('sgb5_241', '§ 241 SGB V')}); er fließt in den Gesundheitsfonds, der das Geld nach Alter, Geschlecht und Krankheiten der Versicherten auf alle Kassen verteilt. Beweglich ist der Zusatzbeitrag (${h.src('sgb5_242', '§ 242 SGB V')}): Jede Kasse setzt ihn so fest, dass er die Lücke zwischen ihren Zuweisungen und ihren Ausgaben schließt. Nur in diesem Teil unterscheiden sich die Kassen beim Preis. Was eine Kasse mit ihrem Zusatzbeitrag finanziert, ist überwiegend gesetzlich vorgegeben; Unterschiede gibt es bei Satzungsleistungen, Bonusprogrammen und beim Service, die sich aber nicht in einem Prozentsatz ausdrücken lassen. Für den Vergleich in Euro reicht deshalb der Zusatzbeitrag, für alles andere lohnt ein Blick in die Satzung der Kasse.</p>
${h.table(['Kasse', 'Allgemein', 'Zusatzbeitrag', 'Gesamtsatz', 'Ihr Anteil'], GROSS.map((k) => [kLink(h, k), h.pz(w.kv_allgemein, 1), h.pk(k.zb!), h.pz(w.kv_allgemein + k.zb!, 2), h.pz((w.kv_allgemein + k.zb!) / 2, 3)]), 'Sätze laut Liste des GKV-Spitzenverbands', ['l', 'r', 'r', 'r', 'r'])}
<p>Zwischen der günstigsten und der teuersten frei wählbaren Kasse liegen ${h.num(st.max - st.min, 2)} Punkte. Bei ${h.eur(B)} brutto macht das für Sie ${h.eur(spanneMonat, 2)} im Monat aus, für den Arbeitgeber dasselbe noch einmal. Aufs Jahr gerechnet ist das der Betrag, den ein Wechsel von der teuersten zur günstigsten Kasse höchstens bringt, wenn beide in Ihrem Land wählbar sind.</p>
<h2>Drei Sätze für drei Lagen</h2>
<p>Nicht jeder zahlt den allgemeinen Satz. Das Gesetz kennt drei Stufen, und auf jede kommt der volle Zusatzbeitrag der Kasse:</p>
${h.table(['Satz', 'Höhe', 'Für wen', 'Beispiel im Monat'], [
  ['Allgemein (§ 241)', h.pz(w.kv_allgemein, 1), 'Beschäftigte, Rentner, Selbstständige mit Krankengeld', `${h.eur(r.kv.mitglied, 2)} Anteil bei ${h.eur(B)} brutto`],
  ['Ermäßigt (§ 243)', h.pz(w.kv_ermaessigt, 1), 'Mitglieder ohne Krankengeld, etwa Selbstständige', `${h.eur(sOhne, 2)} bei ${h.eur(3000)} Gewinn`],
  ['Studierende (§ 245)', h.pz(w.kvStudent, 2), 'pflichtversicherte Studierende', `${h.eur(stud, 2)} auf ${h.eur(w.bafoeg_bedarf)}`],
], `Mit Zusatzbeitrag ${h.pz(zb, 1)}, 2026`, ['l', 'r', 'l', 'r'])}
<p>Der ermäßigte Satz ist kein Rabatt, sondern der Preis für den Verzicht auf Krankengeld: Wer ihn zahlt, bekommt bei längerer Krankheit keinen Lohnersatz von der Kasse. Selbstständige können per Wahlerklärung den allgemeinen Satz wählen und erhalten dann Krankengeld ab der siebten Woche; ob sich das lohnt, zeigt der Ratgeber ${h.a('freiwillig-versichert', 'freiwillig versichert')}. Für Studierende ist der Satz auf sieben Zehntel abgesenkt, die Grundlage ist ein fester Betrag statt des tatsächlichen Einkommens (${h.a('krankenkasse-studenten', 'Krankenkasse für Studenten')}).</p>
<h2>Wer welchen Anteil trägt</h2>
<p>Bei Beschäftigten teilen sich Arbeitnehmer und Arbeitgeber den ganzen Satz hälftig (${h.src('sgb5_249', '§ 249 SGB V')}), den allgemeinen Teil wie den Zusatzbeitrag. Das gilt seit Januar 2019; vorher zahlten Beschäftigte den Zusatzbeitrag allein. Bei Rentnern übernimmt die Rentenversicherung die Hälfte des Beitrags auf die gesetzliche Rente, nicht aber auf Betriebsrenten, für die der volle Satz allein gilt. Freiwillig versicherte Selbstständige und Studierende zahlen alles selbst. Wer als Beschäftigter über der Versicherungspflichtgrenze verdient und freiwillig gesetzlich bleibt, bekommt vom Arbeitgeber einen Zuschuss in Höhe der Hälfte, wirtschaftlich also dasselbe (${h.a('arbeitgeberanteil-krankenversicherung', 'Arbeitgeberanteil')}).</p>
<h2>Wie der Satz auf der Gehaltsabrechnung erscheint</h2>
<p>Auf der Abrechnung finden Sie den Satz meist nicht als eine Zahl, sondern verteilt: eine Zeile Krankenversicherung mit Ihrem Anteil in Euro, oft daneben der halbe Gesamtsatz in Prozent, und getrennt davon die Pflegeversicherung. Wer nachrechnen will, teilt den Eurobetrag der Krankenversicherung durch das beitragspflichtige Brutto des Monats und verdoppelt das Ergebnis; heraus kommt der Gesamtsatz Ihrer Kasse. Weicht er vom Satz in der amtlichen Liste ab, gibt es meist einen einfachen Grund: Der Lohn lag im Übergangsbereich, es gab eine Einmalzahlung, oder die Kasse hat ihren Satz im Laufe des Monats geändert.</p>
<p>Für Rentner zeigt die Rentenanpassungsmitteilung den Abzug, für freiwillig Versicherte der Beitragsbescheid der Kasse. Bei Betriebsrenten zieht die Zahlstelle den vollen Satz ab, also allgemeinen Satz und ganzen Zusatzbeitrag, nach Abzug des Freibetrags von ${h.eur(w.vbFrei, 2)}; mehr dazu im Ratgeber ${h.a('betriebsrente-krankenversicherung', 'Betriebsrente')}.</p>
<h2>Der Beitrag im Gesamtbild der Sozialversicherung</h2>
<p>Auf der Gehaltsabrechnung ist die Krankenversicherung nur eine von vier Zeilen. Zusammen ergeben Renten-, Arbeitslosen-, Pflege- und Krankenversicherung mit durchschnittlichem Zusatzbeitrag ${h.pz(svGesamt, 1)} des Bruttolohns:</p>
${h.table(['Versicherung', 'Satz gesamt', 'Ihr Anteil'], [
  ['Rentenversicherung', h.pz(w.rv_satz, 1), h.pz(w.rv_satz / 2, 2)],
  ['Arbeitslosenversicherung', h.pz(w.av_satz, 1), h.pz(w.av_satz / 2, 2)],
  ['Pflegeversicherung (mit Kind)', h.pz(w.pv_satz, 1), h.pz(w.pv_satz / 2, 2)],
  ['Krankenversicherung mit Durchschnitt', h.pz(gesamt, 1), h.pz(gesamt / 2, 2)],
  ['Zusammen', h.pz(svGesamt, 1), h.pz(svAn, 2)],
], 'Bis zur jeweiligen Beitragsbemessungsgrenze, außerhalb Sachsens, 2026', ['l', 'r', 'r'])}
<p>Rente und Arbeitslosenversicherung haben eine höhere Beitragsbemessungsgrenze als die Krankenversicherung, deshalb stimmen die Prozentsätze bei hohen Löhnen nicht mehr für jede Zeile. Der Zusatzbeitrag ist der einzige Teil dieser Rechnung, den Sie durch die Wahl Ihrer Kasse beeinflussen können; welche Kasse in Ihrem Land wie viel verlangt, zeigt die ${h.a('zusatzbeitrag-liste', 'Liste aller Zusatzbeiträge')}, den Betrag für Ihr Einkommen der ${h.a('home', 'Beitragsrechner')}.</p>`,
  },
  en: {
    slug: 'health-insurance-contribution-rate',
    nav: 'Contribution rate of a fund',
    card: `${EN.pz(w.kv_allgemein, 1)} plus the additional rate, split in half: how your fund’s rate is built and what it means in euros.`,
    title: 'Health Insurance Contribution Rate Germany 2026: Explained',
    description: 'German health insurance contribution rate 2026 and 2027: general, reduced and student rates, your fund’s additional rate, who pays which share, cost in euros.',
    h1: 'Health insurance contribution rate: how it is built and who pays it',
    intro: `${EN.pz(w.kv_allgemein, 1)} for everyone plus your fund’s additional rate, today ${EN.pk(st.min)} to ${EN.pk(st.max)}; employees and employers each pay half.`,
    resume: `The contribution rate of German statutory health insurance has two parts. The general rate (allgemeiner Beitragssatz) of ${EN.pz(w.kv_allgemein, 1)} is set by law and the same at every fund (section 241 of Book V of the Social Code). On top comes the additional contribution (Zusatzbeitrag) that each fund sets itself; according to the GKV-Spitzenverband list it currently ranges from ${EN.pk(st.min)} to ${EN.pk(st.max)} among open funds. With the official average of ${EN.pz(zb, 1)} the total is ${EN.pz(gesamt, 1)}. Since 2019 employees and employers have split both parts equally, so your share is ${EN.pz(gesamt / 2, 2)} of gross pay up to the contribution ceiling; on ${EN.eur(B)} that is ${EN.eur(r.kv.mitglied, 2)} a month. Members with no right to sick pay pay the reduced rate of ${EN.pz(w.kv_ermaessigt, 1)}, students seven tenths of the general rate, ${EN.pz(w.kvStudent, 2)}. Long-term care insurance comes on top at ${EN.pz(w.pv_satz, 1)} and is not part of the health contribution.`,
    faqs: [
      { q: 'What is my health fund’s total contribution rate?', a: `${EN.pz(w.kv_allgemein, 1)} plus your fund’s additional rate. At Techniker Krankenkasse with ${EN.pk(GROSS[0].zb!)} that is ${EN.pz(w.kv_allgemein + GROSS[0].zb!, 2)}, at BARMER with ${EN.pk(GROSS[1].zb!)} it is ${EN.pz(w.kv_allgemein + GROSS[1].zb!, 2)}. You find your fund’s additional rate in the official list or on your payslip, usually as a percentage next to the health insurance line.` },
      { q: 'Since when has the employer paid half the additional rate too?', a: 'Since 1 January 2019. Before that employees paid the additional rate alone and only the general rate was shared. Today section 249 SGB V splits both parts equally. For pensioners the pension insurance pays the other half; self-employed members and students pay the full rate themselves.' },
      { q: 'When does the reduced contribution rate apply?', a: `For members with no right to sick pay (section 243 SGB V), mainly self-employed voluntary members who have not opted into sick pay, and people drawing a full old-age pension who still work, since they have no right to sick pay (section 50(1) SGB V). The rate is ${EN.pz(w.kv_ermaessigt, 1)} instead of ${EN.pz(w.kv_allgemein, 1)}; the additional rate is added in full. On ${EN.eur(3000)} profit this saves ${EN.eur(sMit - sOhne, 2)} a month.` },
      { q: 'Is the care contribution included in the health fund’s rate?', a: `No. Long-term care insurance is a separate branch with its own rate of ${EN.pz(w.pv_satz, 1)}, the same at every fund. The health fund merely collects it and passes it on to its care fund. That is why health and care insurance appear on separate lines of your payslip.` },
      { q: 'What share of gross pay goes to social insurance in total?', a: `With the average additional rate, ${EN.pz(svGesamt, 1)} for pension, unemployment, care and health together, of which employees pay ${EN.pz(svAn, 2)}, plus ${EN.num(w.pv_kinderlos, 1)} points if childless and 23 or over. This total social insurance rate is also the basis for factor F in the transition zone up to ${EN.eur(w.uebergang_oben)}.` },
    ],
    body: (h) => `
<h2>Two building blocks, one rate</h2>
<p>The health contribution has a fixed part and a variable part. The fixed part is the general rate of ${h.pz(w.kv_allgemein, 1)} (${h.src('sgb5_241', 'section 241 SGB V')}); it goes into the central health fund (Gesundheitsfonds), which shares the money among all funds by the age, sex and illnesses of their members. The variable part is the additional rate (${h.src('sgb5_242', 'section 242 SGB V')}): each fund sets it to close the gap between its allocations and its spending. Funds differ in price only in this part.</p>
${h.table(['Fund', 'General', 'Additional', 'Total rate', 'Your share'], GROSS.map((k) => [kLink(h, k), h.pz(w.kv_allgemein, 1), h.pk(k.zb!), h.pz(w.kv_allgemein + k.zb!, 2), h.pz((w.kv_allgemein + k.zb!) / 2, 3)]), 'Rates from the GKV-Spitzenverband list', ['l', 'r', 'r', 'r', 'r'])}
<p>Between the cheapest and the most expensive open fund lie ${h.num(st.max - st.min, 2)} points. On ${h.eur(B)} gross that is ${h.eur(spanneMonat, 2)} a month for you, and the same again for your employer.</p>
<h2>Three rates for three situations</h2>
<p>Not everyone pays the general rate. The law has three levels, and each gets the fund’s full additional rate on top:</p>
${h.table(['Rate', 'Level', 'Who', 'Example a month'], [
  ['General (section 241)', h.pz(w.kv_allgemein, 1), 'Employees, pensioners, self-employed with sick pay', `${h.eur(r.kv.mitglied, 2)} share on ${h.eur(B)} gross`],
  ['Reduced (section 243)', h.pz(w.kv_ermaessigt, 1), 'Members without sick pay, such as the self-employed', `${h.eur(sOhne, 2)} on ${h.eur(3000)} profit`],
  ['Students (section 245)', h.pz(w.kvStudent, 2), 'Compulsorily insured students', `${h.eur(stud, 2)} on ${h.eur(w.bafoeg_bedarf)}`],
], `With additional rate ${h.pz(zb, 1)}, 2026`, ['l', 'r', 'l', 'r'])}
<p>The reduced rate is not a discount but the price of giving up sick pay: whoever pays it gets no wage replacement from the fund during a long illness. Self-employed members can opt into the general rate and then receive sick pay from week seven; whether that pays off is covered in the guide to ${h.a('freiwillig-versichert', 'voluntary membership')}. For students the rate is cut to seven tenths and the base is a fixed amount instead of actual income (${h.a('krankenkasse-studenten', 'health insurance for students')}).</p>
<h2>Who pays which share</h2>
<p>For employees, worker and employer split the whole rate in half (${h.src('sgb5_249', 'section 249 SGB V')}), general part and additional rate alike. This has applied since January 2019; before that employees paid the additional rate alone. For pensioners the pension insurance pays half the contribution on the state pension, but not on company pensions, which carry the full rate alone. Self-employed voluntary members and students pay everything themselves. Employees above the compulsory insurance threshold who stay in the statutory system voluntarily get an employer subsidy of half, which comes to the same thing (${h.a('arbeitgeberanteil-krankenversicherung', 'employer share')}).</p>
<h2>How the rate shows up on your payslip</h2>
<p>Your payslip rarely shows the rate as one figure. Usually there is a health insurance line with your share in euros, often next to half the total rate in percent, and a separate line for care insurance. To check it, divide the euro amount for health insurance by the month’s contributory gross pay and double the result; that gives your fund’s total rate. If it differs from the official list, the reason is usually simple: pay fell in the transition zone, there was a one-off payment, or the fund changed its rate during the month. Pensioners see the deduction on their pension adjustment notice, voluntary members on the fund’s contribution notice.</p>
<h2>The contribution within social insurance as a whole</h2>
<p>On a payslip health insurance is only one of four lines. Together pension, unemployment, care and health insurance at the average additional rate take ${h.pz(svGesamt, 1)} of gross pay:</p>
${h.table(['Insurance', 'Total rate', 'Your share'], [
  ['Pension insurance', h.pz(w.rv_satz, 1), h.pz(w.rv_satz / 2, 2)],
  ['Unemployment insurance', h.pz(w.av_satz, 1), h.pz(w.av_satz / 2, 2)],
  ['Long-term care (with a child)', h.pz(w.pv_satz, 1), h.pz(w.pv_satz / 2, 2)],
  ['Health insurance at the average', h.pz(gesamt, 1), h.pz(gesamt / 2, 2)],
  ['Total', h.pz(svGesamt, 1), h.pz(svAn, 2)],
], 'Up to each contribution ceiling, outside Saxony, 2026', ['l', 'r', 'r'])}
<p>Pension and unemployment insurance have a higher contribution ceiling than health insurance, so at high pay the percentages no longer hold for every line. The additional rate is the only part of this bill you can influence through your choice of fund; which fund in your state charges what is shown in the ${h.a('zusatzbeitrag-liste', 'list of all additional rates')}, and the amount for your income in the ${h.a('home', 'contribution calculator')}.</p>`,
  },
});
