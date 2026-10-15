import { defineGuide } from '../../lib/guide-types';
import { student } from '../../lib/engine/beitrag';
import { offen, kasse } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** Pflichtversicherte Studierende: §§ 5 Abs. 1 Nr. 9, 236, 245 SGB V; § 13 BAföG; Pflege § 55 SGB XI. */
const w = J(2026);
const zbD = w.zb_durchschnitt;
const d = student({ zb: zbD, jahr: 2026, eltern: 'unter23' });
const dk = student({ zb: zbD, jahr: 2026, eltern: 'kinderlos' });
const alle = offen();
const billig = alle[0], teuer = alle[alle.length - 1];
const sb = student({ zb: billig.zb!, jahr: 2026, eltern: 'unter23' }), st = student({ zb: teuer.zb!, jahr: 2026, eltern: 'unter23' });
const spanne = Math.round((st.selbst - sb.selbst) * 12);
const auswahl = ['techniker-krankenkasse', 'barmer', 'dak-gesundheit', 'aok-bayern-die-gesundheitskasse', 'handelskrankenkasse-hkk', billig.id, teuer.id].filter((x, i, a) => a.indexOf(x) === i).map((id) => kasse(id)).sort((a, b) => a.zb! - b.zb!);

export default defineGuide({
  id: 'krankenkasse-studenten',
  group: 'rechner',
  order: 5,
  tool: 'beitrag',
  toolPreset: { status: 'student' },
  related: ['familienversicherung', 'midijob-krankenversicherung', 'zusatzbeitrag-liste', 'pflegeversicherung-beitrag', 'krankenkasse-wechseln'],
  sources: ['sgb5_236', 'sgb5_245', 'bafoeg13', 'sgb5_5', 'sgb11_55'],
  de: {
    slug: 'krankenkasse-studenten',
    nav: 'Studierende',
    card: `${DE.eur(d.selbst)} im Monat mit durchschnittlichem Zusatzbeitrag, je nach Kasse ${DE.eur(sb.selbst)} bis ${DE.eur(st.selbst)}.`,
    title: 'Krankenkasse Studenten Beitrag 2027: Monatsbeitrag je Kasse',
    description: 'Krankenkasse für Studenten 2026/2027: Beitrag auf den BAföG-Bedarf, sieben Zehntel des allgemeinen Satzes plus Zusatzbeitrag, Pflege, Unterschied je Kasse.',
    h1: 'Krankenversicherung im Studium: der Beitrag bei jeder Kasse',
    intro: `Mit durchschnittlichem Zusatzbeitrag zahlen Studierende ${DE.eur(d.selbst)} im Monat, ab 23 ohne Kind ${DE.eur(dk.selbst)}.`,
    resume: `Studierende, die nicht mehr über die Eltern familienversichert sind, zahlen in der gesetzlichen Krankenversicherung einen festen Studentenbeitrag. Grundlage ist nicht das eigene Einkommen, sondern der BAföG-Bedarf für Studierende, die nicht bei den Eltern wohnen: ${DE.eur(w.bafoeg_bedarf)} im Monat (§ 236 SGB V mit § 13 BAföG). Darauf gelten sieben Zehntel des allgemeinen Beitragssatzes, also ${DE.pz(w.kvStudent)}, plus der volle Zusatzbeitrag der Kasse (§ 245 SGB V), und die Pflegeversicherung mit ${DE.pz(w.pv_satz)}, ab dem 23. Geburtstag ohne Kind ${DE.pz(w.pv_satz + w.pv_kinderlos)}. Mit dem durchschnittlichen Zusatzbeitrag von ${DE.pz(zbD)} sind das ${DE.eur(d.kv.mitglied)} Krankenversicherung und ${DE.eur(d.pv.mitglied)} Pflege, zusammen ${DE.eur(d.selbst)} im Monat. Weil die Grundlage für alle gleich ist, unterscheidet nur der Zusatzbeitrag die Kassen: Zwischen ${billig.kurz} und ${teuer.kurz} liegen ${DE.eur(spanne)} im Jahr. Die studentische Versicherung gilt bis zum Abschluss des 14. Fachsemesters, längstens bis zum 30. Geburtstag.`,
    faqs: [
      { q: 'Bis wann bin ich als Student über meine Eltern versichert?', a: `Bis zum 25. Geburtstag, solange Ihr eigenes Gesamteinkommen ${DE.eur(w.famGrenze)} im Monat nicht übersteigt, mit Minijob ${DE.eur(w.geringfuegigkeit)} (§ 10 SGB V). Ein freiwilliger Wehrdienst oder ein Freiwilligendienst verlängert die Frist. Danach, oder wenn ein Elternteil privat versichert ist und mehr verdient, brauchen Sie die eigene studentische Versicherung.` },
      { q: 'Ändert sich der Studentenbeitrag, wenn ich neben dem Studium arbeite?', a: 'Nein, solange Sie als Werkstudent während der Vorlesungszeit nicht mehr als 20 Stunden in der Woche arbeiten: Dann bleiben Sie in der Beschäftigung versicherungsfrei und zahlen weiter den festen Studentenbeitrag. Arbeiten Sie dauerhaft mehr, werden Sie als Beschäftigter versichert und zahlen auf den Lohn. Ein Minijob ändert am Beitrag nichts.' },
      { q: 'Was zahle ich nach dem 14. Semester oder ab 30?', a: `Dann endet die studentische Pflichtversicherung, und Sie werden freiwilliges Mitglied. Ohne eigenes Einkommen gilt die Mindestbemessung von ${DE.eur(w.mindestFreiwillig, 2)} im Monat mit dem vollen ermäßigten Satz von ${DE.pz(w.kv_ermaessigt)} plus Zusatzbeitrag; das ist deutlich mehr als der Studentenbeitrag. Längere Studienzeiten können aus familiären oder persönlichen Gründen anerkannt werden.` },
      { q: 'Kann ich mich als Student von der gesetzlichen Versicherung befreien lassen?', a: 'Ja, innerhalb von drei Monaten nach Beginn der Versicherungspflicht, wenn Sie privat versichert sind, etwa über die Beihilfe eines Elternteils oder als internationale Studentin mit einem anerkannten Vertrag (§ 8 Abs. 1 Nr. 5 SGB V). Die Befreiung gilt für das ganze Studium und lässt sich nicht widerrufen.' },
    ],
    body: (h) => `
<h2>Studentenbeitrag bei ausgewählten Kassen</h2>
${h.table(['Kasse', 'Zusatzbeitrag', 'Krankenversicherung', 'Pflege unter 23', 'zusammen'], auswahl.map((k) => { const x = student({ zb: k.zb!, jahr: 2026, eltern: 'unter23' }); return [k.kurz, h.pk(k.zb!), h.eur(x.kv.mitglied), h.eur(x.pv.mitglied), h.eur(x.selbst)]; }), `2026, Grundlage ${h.eur(w.bafoeg_bedarf)}; alle Kassen im Rechner oben`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Warum alle Studierenden auf ${h.eur(w.bafoeg_bedarf)} zahlen</h2>
<p>Der Gesetzgeber hat für Studierende eine feste beitragspflichtige Einnahme gewählt, damit niemand sein Einkommen nachweisen muss: den monatlichen Bedarf, den das BAföG für Studierende mit eigener Wohnung festsetzt, ${h.eur(J(2026).bafoeg_bedarf)}. Ändert sich der BAföG-Satz, ändert sich der Beitrag ab dem folgenden Semester, also zum 1. April oder 1. Oktober. Ob Sie selbst BAföG bekommen, spielt dabei keine Rolle.</p>
<p>Gezahlt wird für das Semester im Voraus oder monatlich, je nach Kasse; die Hochschule verlangt bei der Einschreibung nur die Meldung der Kasse, dass Sie versichert sind. Wer die Kasse wechselt, gibt der Hochschule die neue Kasse an. Die Fristen sind dieselben wie für alle: zwölf Monate Bindung, Wechsel zum übernächsten Monat (${h.a('krankenkasse-wechseln', 'Wechsel rechnen')}).</p>
<h2>Kinderlosenzuschlag ab 23</h2>
<p>Viele Studierende überrascht er im Semester nach dem 23. Geburtstag: Ab dann zahlen Kinderlose ${h.pz(w.pv_kinderlos)} mehr Pflegebeitrag, beim Studentenbeitrag ${h.eur(dk.pv.mitglied - d.pv.mitglied, 2)} im Monat. Wer ein Kind hat, weist es der Kasse einmal nach und zahlt den Zuschlag nicht (${h.a('pflegeversicherung-beitrag', 'mehr zum Pflegebeitrag')}).</p>`,
  },
  en: {
    slug: 'health-insurance-students',
    nav: 'Students',
    card: `${EN.eur(d.selbst)} a month at the average additional rate, from ${EN.eur(sb.selbst)} to ${EN.eur(st.selbst)} depending on the fund.`,
    title: 'Student Health Insurance Germany 2027: Cost at Every Fund',
    description: 'Statutory health insurance for students in Germany 2026/2027: paid on the BAföG need rate at seven tenths of the general rate plus the fund’s rate, care.',
    h1: 'Student health insurance in Germany: the contribution at every fund',
    intro: `At the average additional rate students pay ${EN.eur(d.selbst)} a month, or ${EN.eur(dk.selbst)} from age 23 without children.`,
    resume: `Students in Germany who are no longer covered through their parents’ family insurance pay a fixed student contribution to their statutory health fund (Krankenkasse). It is not based on their own income but on the BAföG need rate for students living away from their parents: ${EN.eur(w.bafoeg_bedarf)} a month (section 236 of Book V of the Social Code with section 13 of the federal student finance act, BAföG). On that amount students pay seven tenths of the general rate, ${EN.pz(w.kvStudent)}, plus their fund’s full additional rate (Zusatzbeitrag) (section 245), and long-term care insurance at ${EN.pz(w.pv_satz)}, or ${EN.pz(w.pv_satz + w.pv_kinderlos)} from their 23rd birthday without children. At the average additional rate of ${EN.pz(zbD)} that is ${EN.eur(d.kv.mitglied)} health and ${EN.eur(d.pv.mitglied)} care insurance, ${EN.eur(d.selbst)} a month together. Since the base is the same for everyone, only the additional rate separates the funds: ${billig.kurz} and ${teuer.kurz} are ${EN.eur(spanne)} a year apart. Student cover lasts until the end of the 14th semester, and at most until the 30th birthday.`,
    faqs: [
      { q: 'Until when am I covered through my parents as a student?', a: `Until your 25th birthday, as long as your own total income stays at or below ${EN.eur(w.famGrenze)} a month, or ${EN.eur(w.geringfuegigkeit)} with a minijob (section 10 SGB V). Voluntary military or volunteer service extends this. After that, or if one parent is privately insured and earns more, you need your own student cover.` },
      { q: 'Does my student contribution change if I work alongside my studies?', a: 'No, as long as you work no more than 20 hours a week during term as a working student (Werkstudent): the job stays exempt and you keep paying the fixed student contribution. If you regularly work more, you are insured as an employee and pay on your wages. A minijob changes nothing about the contribution.' },
      { q: 'What do I pay after the 14th semester or from age 30?', a: `Compulsory student cover ends and you become a voluntary member. Without income of your own the minimum base of ${EN.eur(w.mindestFreiwillig, 2)} a month applies, at the full reduced rate of ${EN.pz(w.kv_ermaessigt)} plus the additional rate; that is clearly more than the student contribution. Longer study periods can be recognised for family or personal reasons.` },
      { q: 'Can I opt out of statutory insurance as a student?', a: 'Yes, within three months of becoming compulsorily insured, if you have private cover, for example through a parent’s civil servant allowance or as an international student with a recognised policy (section 8(1) no. 5 SGB V). The exemption lasts for the whole of your studies and cannot be revoked.' },
    ],
    body: (h) => `
<h2>Student contribution at selected funds</h2>
${h.table(['Fund', 'Additional rate', 'Health', 'Care under 23', 'Total'], auswahl.map((k) => { const x = student({ zb: k.zb!, jahr: 2026, eltern: 'unter23' }); return [k.kurz, h.pk(k.zb!), h.eur(x.kv.mitglied), h.eur(x.pv.mitglied), h.eur(x.selbst)]; }), `2026, base ${h.eur(w.bafoeg_bedarf)}; every fund in the calculator above`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Why every student pays on ${h.eur(w.bafoeg_bedarf)}</h2>
<p>The law gives students a fixed contributory income so nobody has to prove what they earn: the monthly need that BAföG sets for students with their own home, ${h.eur(J(2026).bafoeg_bedarf)}. When the BAföG rate changes, the contribution changes from the next semester, on 1 April or 1 October. Whether you actually receive BAföG makes no difference.</p>
<p>Depending on the fund you pay per semester in advance or monthly; at enrolment the university only needs your fund’s electronic confirmation that you are insured. If you switch fund, tell the university the new one. The deadlines are the same as for everyone: twelve months’ lock-in, switch to the month after next (${h.a('krankenkasse-wechseln', 'work out the dates')}).</p>
<h2>The childless surcharge from 23</h2>
<p>Many students are surprised by it in the semester after their 23rd birthday: from then on, childless members pay ${h.pz(w.pv_kinderlos)} more care contribution, ${h.eur(dk.pv.mitglied - d.pv.mitglied, 2)} a month on the student contribution. Anyone with a child proves it to the fund once and pays no surcharge (${h.a('pflegeversicherung-beitrag', 'more on the care contribution')}).</p>`,
  },
});
