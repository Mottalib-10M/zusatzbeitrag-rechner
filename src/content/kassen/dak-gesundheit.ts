import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { kasse } from '../../lib/engine/kassen';
import { student, selbststaendig } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** DAK-Gesundheit: Satz aus der Kassenliste, Beträge aus dem Motor. */
const p = profil('dak-gesundheit');
const w = J(2026);
const barmer = kostenZeile(kasse('barmer')), tk = kostenZeile(kasse('techniker-krankenkasse')), kkh = kostenZeile(kasse('kaufmannische-krankenkasse-kkh'));
const d = (x: { lohn: number }) => Math.round((x.lohn - p.lohn) * 12);
// Kinderlose Studierende ab 23 und Selbstständige mit Krankengeld: zwei Lagen, die auf anderen Seiten fehlen.
const stud23 = student({ zb: p.zb, jahr: 2026, eltern: 'kinderlos' }).selbst;
const selbstKg = selbststaendig({ einkommen: BEISPIEL.gewinn, zb: p.zb, jahr: 2026, krankengeld: true, eltern: 'k1' }).selbst;
const zuBillig = Math.round(p.proJahrVsBilligste);
const nachbarn = [tk.k, p.k, barmer.k, kkh.k].map(kostenZeile).sort((a, b) => a.k.zb! - b.k.zb!);
const wortDe = (z: number) => (z > p.zb ? 'mehr' : 'weniger');
const wortEn = (z: number) => (z > p.zb ? 'more' : 'less');

export default defineGuide({
  id: 'dak-gesundheit',
  group: 'kassen',
  order: 12,
  kasse: 'dak-gesundheit',
  tool: 'beitrag',
  toolPreset: { kasse: 'dak-gesundheit' },
  related: ['barmer', 'techniker-krankenkasse', 'kaufmannische-krankenkasse-kkh', 'krankenkasse-studenten', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_245', 'sgb5_243'],
  de: {
    slug: 'dak-zusatzbeitrag',
    nav: 'DAK-Gesundheit',
    card: `${DE.pk(p.zb)} Zusatzbeitrag; ${DE.eur(p.lohn)} im Monat bei ${DE.eur(BEISPIEL.lohn)} brutto, Studierende zahlen ${DE.eur(p.student)}.`,
    title: 'DAK Zusatzbeitrag 2027: was Mitglieder monatlich zahlen',
    description: `DAK-Gesundheit, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Monatsbeitrag für Angestellte, Studierende, Rentner und Selbstständige, Abstand zu BARMER und TK, Blick auf 2027.`,
    h1: 'DAK-Gesundheit: Zusatzbeitrag und Monatsbeitrag',
    intro: `Die DAK-Gesundheit erhebt ${DE.pk(p.zb)}; ein Angestellter mit ${DE.eur(BEISPIEL.lohn)} brutto zahlt ${DE.eur(p.lohn)} im Monat, Studierende ${DE.eur(p.student)}.`,
    resume: `Für die DAK-Gesundheit nennt die Kassenliste des GKV-Spitzenverbands einen Zusatzbeitrag von ${DE.pk(p.zb)}. Wer dort versichert und angestellt ist, zahlt die Hälfte von ${DE.pz(w.kv_allgemein + p.zb)} seines Bruttolohns an Krankenversicherung, dazu die Hälfte von ${DE.pz(w.pv_satz)} an Pflegeversicherung; den Rest übernimmt der Arbeitgeber. Bei ${DE.eur(BEISPIEL.lohn)} brutto mit einem Kind kommen ${DE.eur(p.lohn)} im Monat zusammen. Studierende zahlen ${DE.eur(p.student)} unabhängig vom Nebenjob, weil das Gesetz ihren Beitrag am BAföG-Bedarf festmacht. Gegenüber dem amtlichen Durchschnittssatz von ${DE.pz(w.zb_durchschnitt)} kostet die DAK bei ${DE.eur(BEISPIEL.lohn)} ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} im Jahr ${p.unterDurchschnitt ? 'weniger' : 'mehr'}, gegenüber ${p.billigste.kurz}, der günstigsten frei wählbaren Kasse, ${DE.eur(zuBillig)} mehr. Unter ${p.nBund} Kassen liegt sie auf Platz ${p.rangBund}. Wie alle Ersatzkassen nimmt sie Mitglieder aus allen Ländern auf, und wer umzieht, bleibt einfach Mitglied.`,
    faqs: [
      { q: 'Wie viel zahlen Studierende bei der DAK-Gesundheit?', a: `${DE.eur(p.student)} im Monat, wenn sie unter 23 sind oder Kinder haben, ${DE.eur(stud23)} als Kinderlose ab 23. Grundlage ist der BAföG-Bedarf von ${DE.eur(w.bafoeg_bedarf)}, auf den sieben Zehntel des allgemeinen Satzes, also ${DE.pz(w.kvStudent)}, plus der volle Zusatzbeitrag der DAK erhoben werden. Ein Minijob ändert daran nichts.` },
      { q: 'Ist die DAK-Gesundheit teurer als die BARMER?', a: `Die BARMER verlangt ${DE.pk(barmer.k.zb!)}, die DAK ${DE.pk(p.zb)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie bei der BARMER ${DE.eur(Math.abs(d(barmer)))} im Jahr ${wortDe(barmer.k.zb!)} als bei der DAK, bei der Techniker Krankenkasse ${DE.eur(Math.abs(d(tk)))} ${wortDe(tk.k.zb!)}. Leistungen außerhalb des gesetzlichen Katalogs vergleicht dieser Satz nicht; sie stehen in der Satzung jeder Kasse.` },
      { q: 'Was kostet die DAK Selbstständige mit Krankengeld?', a: `Mit ${DE.eur(BEISPIEL.gewinn)} Monatsgewinn und gesetzlichem Krankengeld ab der siebten Krankheitswoche ${DE.eur(selbstKg)} im Monat; ohne Krankengeld gilt der ermäßigte Satz von ${DE.pz(w.kv_ermaessigt)}, dann sind es ${DE.eur(p.selbst)}. Freiwillig Versicherte tragen Zusatzbeitrag und Pflege allein, ein Arbeitgeberanteil fehlt. Die Kasse setzt den Beitrag nach dem letzten Steuerbescheid fest.` },
      { q: 'Wann wirkt eine Beitragserhöhung der DAK bei meinem Lohn?', a: `Ab dem Monat, für den die Satzung den neuen Satz festlegt, meist der Januar; der Arbeitgeber behält ihn mit der nächsten Abrechnung ein. Sie haben dann bis zum Ende dieses Monats ein Sonderkündigungsrecht, zahlen den höheren Satz aber bis zum Ende der Mitgliedschaft, also mindestens drei Monate.` },
    ],
    body: (h) => `
<h2>Die DAK-Gesundheit zwischen TK, BARMER und KKH</h2>
<p>Die vier Kassen in der Tabelle sind bundesweit geöffnete Ersatzkassen und damit für jeden Beschäftigten wählbar, egal ob in Kiel oder Konstanz. Ihr Abstand ergibt sich ausschließlich aus dem Zusatzbeitrag, denn der allgemeine Satz von ${h.pz(w.kv_allgemein)} und die Pflege sind überall gleich. Für die DAK-Gesundheit bedeutet ${h.pk(p.zb)}: ${p.rangBund - 1} der ${p.nBund} frei wählbaren Kassen sind günstiger. Interessant wird der Vergleich vor allem für Gutverdienende, weil der Unterschied mit dem Gehalt bis zur Bemessungsgrenze von ${h.eur(w.bbgKv, 2)} wächst; dort zahlen Sie bei der DAK ${h.eur(p.lohnBbg)} im Monat.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber DAK im Jahr'], nachbarn.map((x) => [x.k.id === 'dak-gesundheit' ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === 'dak-gesundheit' ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'r'])}
<h2>Studium, Rente, Selbstständigkeit: der DAK-Beitrag je Gruppe</h2>
${h.table(['Gruppe', 'Bemessung', 'Beitrag im Monat'], [
  ['Studium, unter 23', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
  ['Studium, kinderlos ab 23', h.eur(w.bafoeg_bedarf), h.eur(stud23)],
  ['Angestellt', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Angestellt', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig mit Krankengeld', h.eur(BEISPIEL.gewinn), h.eur(selbstKg)],
], '2026, Pflege mit einem Kind, soweit nicht anders angegeben', ['l', 'r', 'r'])}
<p>Studierende zahlen bei jeder Kasse auf denselben gesetzlichen Betrag; was die DAK von anderen unterscheidet, ist bei ihnen nur der Zusatzbeitrag auf ${h.eur(w.bafoeg_bedarf)}, im Jahr wenige Euro. Mit dem Semester, in dem man 30 wird, endet die studentische Versicherung in der Regel (§ 190 Abs. 9 SGB V), danach rechnet die Kasse als freiwillige Versicherung mit Mindestbeitrag (${h.a('krankenkasse-studenten', 'Beitrag im Studium')}).</p>
<h2>Von der DAK weg oder zur DAK hin</h2>
<p>In beiden Richtungen stellen Sie nur den Mitgliedsantrag bei der Kasse, zu der Sie wollen. Die Termine hängen am Monat Ihres Antrags, nicht am Tag (${h.a('krankenkasse-wechseln', 'Termin ausrechnen')}). Wer jetzt bei der DAK ist und im Herbst über einen Wechsel nachdenkt, kann auch abwarten, welchen Satz die Kasse für das neue Jahr beschließt: Steigt er, entfällt die Bindung von zwölf Monaten, und der Wechsel ist bis zum Ende des Monats möglich, ab dem der höhere Satz gilt. Bleibt er gleich, vergleicht man ihn mit den neuen Sätzen der übrigen Kassen, die erst ab Januar in der amtlichen Liste stehen. Familienversicherte Kinder und Ehepartner wechseln automatisch mit dem Mitglied.</p>`,
  },
  en: {
    slug: 'dak-additional-contribution',
    nav: 'DAK-Gesundheit',
    card: `${EN.pk(p.zb)} additional rate; ${EN.eur(p.lohn)} a month on ${EN.eur(BEISPIEL.lohn)} gross, students pay ${EN.eur(p.student)}.`,
    title: 'DAK Additional Contribution 2027: What Members Pay Monthly',
    description: `DAK-Gesundheit additional rate in 2026: ${EN.pk(p.zb)}. Monthly cost for employees, students, pensioners and the self-employed, the gap to BARMER and TK, 2027 outlook.`,
    h1: 'DAK-Gesundheit: additional rate and monthly contribution',
    intro: `DAK-Gesundheit charges ${EN.pk(p.zb)}; an employee on ${EN.eur(BEISPIEL.lohn)} gross pays ${EN.eur(p.lohn)} a month, students ${EN.eur(p.student)}.`,
    resume: `The GKV-Spitzenverband fund list gives DAK-Gesundheit an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)}. An employee insured there pays half of ${EN.pz(w.kv_allgemein + p.zb)} of gross pay for health insurance and half of ${EN.pz(w.pv_satz)} for long-term care insurance; the employer pays the rest. On ${EN.eur(BEISPIEL.lohn)} gross with one child that adds up to ${EN.eur(p.lohn)} a month. Students pay ${EN.eur(p.student)} however much they earn on the side, because the law ties their contribution to the BAföG need rate. Compared with the official average rate of ${EN.pz(w.zb_durchschnitt)}, DAK costs ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} a year ${p.unterDurchschnitt ? 'less' : 'more'} at ${EN.eur(BEISPIEL.lohn)}; compared with ${p.billigste.kurz}, the cheapest fund open to everyone, ${EN.eur(zuBillig)} more. It ranks ${p.rangBund} of ${p.nBund}. Like every substitute fund (Ersatzkasse), it accepts members from all states, and moving house simply leaves the membership in place.`,
    faqs: [
      { q: 'How much do students pay at DAK-Gesundheit?', a: `${EN.eur(p.student)} a month if they are under 23 or have children, ${EN.eur(stud23)} if childless and 23 or over. The base is the BAföG need rate of ${EN.eur(w.bafoeg_bedarf)}, charged at seven tenths of the general rate, so ${EN.pz(w.kvStudent)}, plus DAK’s full additional rate. A minijob on the side changes nothing.` },
      { q: 'Is DAK-Gesundheit dearer than BARMER?', a: `BARMER charges ${EN.pk(barmer.k.zb!)}, DAK ${EN.pk(p.zb)}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(Math.abs(d(barmer)))} a year ${wortEn(barmer.k.zb!)} at BARMER than at DAK, and ${EN.eur(Math.abs(d(tk)))} ${wortEn(tk.k.zb!)} at Techniker Krankenkasse. The rate does not compare benefits beyond the statutory catalogue; those are set out in each fund’s statutes.` },
      { q: 'What does DAK cost a self-employed member with sick pay?', a: `With ${EN.eur(BEISPIEL.gewinn)} monthly profit and statutory sick pay from the seventh week of illness, ${EN.eur(selbstKg)} a month; without sick pay the reduced rate of ${EN.pz(w.kv_ermaessigt)} applies and it is ${EN.eur(p.selbst)}. Voluntary members carry the additional rate and care insurance alone, with no employer share. The fund sets the amount from your latest tax assessment.` },
      { q: 'When does a DAK rate rise show up on my payslip?', a: `From the month the fund’s statutes set for the new rate, usually January; your employer deducts it from the next payroll. You then have a special right to leave until the end of that month, but pay the higher rate until membership ends, so for at least three months.` },
    ],
    body: (h) => `
<h2>DAK-Gesundheit next to TK, BARMER and KKH</h2>
<p>All four funds in the table are substitute funds open nationwide, so any employee can join, whether in Kiel or Konstanz. The gap between them comes only from the additional rate, because the general rate of ${h.pz(w.kv_allgemein)} and care insurance are the same everywhere. For DAK-Gesundheit, ${h.pk(p.zb)} means that ${p.rangBund - 1} of the ${p.nBund} open funds are cheaper. The comparison matters most to higher earners, since the gap grows with pay up to the ceiling of ${h.eur(w.bbgKv, 2)}; there you pay ${h.eur(p.lohnBbg)} a month at DAK.</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'vs DAK a year'], nachbarn.map((x) => [x.k.id === 'dak-gesundheit' ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === 'dak-gesundheit' ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'r'])}
<h2>Students, pensioners, the self-employed: DAK cost by group</h2>
${h.table(['Group', 'Base', 'Contribution a month'], [
  ['Student under 23', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
  ['Student, childless, 23+', h.eur(w.bafoeg_bedarf), h.eur(stud23)],
  ['Employee', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employee', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Pensioner', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed with sick pay', h.eur(BEISPIEL.gewinn), h.eur(selbstKg)],
], '2026, care insurance with one child unless stated', ['l', 'r', 'r'])}
<p>Students pay on the same statutory amount at every fund; what sets DAK apart for them is only the additional rate on ${h.eur(w.bafoeg_bedarf)}, a few euros a year. Student cover usually ends with the semester in which you turn 30 (section 190(9) SGB V), after which the fund charges as voluntary insurance with a minimum contribution (${h.a('krankenkasse-studenten', 'student contributions')}).</p>
<h2>Leaving DAK or joining it</h2>
<p>Either way you only send a membership application to the fund you want to join. Dates depend on the month of your application, not the day (${h.a('krankenkasse-wechseln', 'work out the date')}). If you are with DAK and thinking about a switch in the autumn, you can also wait for the rate the fund sets for the new year: if it rises, the twelve-month lock-in falls away and you may switch until the end of the month the higher rate starts. If it stays the same, compare it with the other funds’ new rates, which appear in the official list only from January. Family members covered free of charge move with the member automatically.</p>`,
  },
});
