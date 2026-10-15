import { defineGuide } from '../../lib/guide-types';
import { selbststaendig } from '../../lib/engine/beitrag';
import { offen } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** Freiwillig versicherte Selbstständige: § 240 SGB V (Mindestbemessung, BBG), §§ 241, 243, 44 SGB V, § 59 Abs. 4 SGB XI. */
const w = J(2026), w7 = J(2027);
const zbD = w.zb_durchschnitt;
const s = (e: number, kg = false, j: 2026 | 2027 = 2026, zb = zbD) => selbststaendig({ einkommen: e, zb, jahr: j, krankengeld: kg, eltern: 'k1' });
const mind = s(800), mind7 = s(800, false, 2027), max = s(9000), max7 = s(9000, false, 2027);
const b3000 = s(3000), b3000kg = s(3000, true);
const billig = offen()[0], teuer = offen()[offen().length - 1];
const spanne3000 = Math.round((s(3000, false, 2026, teuer.zb!).selbst - s(3000, false, 2026, billig.zb!).selbst) * 12);
const gewinne = [1000, 2000, 3000, 4500, 6000];

export default defineGuide({
  id: 'krankenkassenbeitrag-selbststaendige',
  group: 'rechner',
  order: 4,
  tool: 'beitrag',
  toolPreset: { status: 'selbststaendig' },
  related: ['freiwillig-versichert', 'beitragsbemessungsgrenze', 'beste-krankenkasse', 'krankenkasse-wechseln', 'zusatzbeitrag-liste'],
  sources: ['sgb5_240', 'sgb5_243', 'sgb5_44', 'sgb11_59', 'sgb11_55'],
  de: {
    slug: 'krankenkassenbeitrag-selbststaendige',
    nav: 'Selbstständige',
    card: `Mindestens ${DE.eur(mind.selbst)} im Monat, höchstens ${DE.eur(max.selbst)}: alles allein, mit oder ohne Krankengeld, bei jeder Kasse.`,
    title: 'Krankenkassenbeitrag Selbstständige 2027: Mindestbeitrag',
    description: `Krankenkassenbeitrag für Selbstständige 2026/2027: Gewinn mal ${DE.pz(w.kv_ermaessigt, 1)} oder ${DE.pz(w.kv_allgemein, 1)} plus Zusatzbeitrag, Pflege, Mindestbemessung, Höchstbeitrag, Kassenvergleich.`,
    h1: 'Krankenkassenbeitrag für Selbstständige: Mindest- bis Höchstbeitrag',
    intro: `Ohne Krankengeld zahlen Selbstständige 2026 mindestens ${DE.eur(mind.selbst)} und höchstens ${DE.eur(max.selbst)} im Monat, Kranken- und Pflegeversicherung zusammen.`,
    resume: `Selbstständige sind in der gesetzlichen Krankenversicherung freiwillig versichert und zahlen den ganzen Beitrag allein, weil kein Arbeitgeber die Hälfte übernimmt. Grundlage ist der Gewinn laut letztem Einkommensteuerbescheid, umgerechnet auf den Monat, mindestens aber ${DE.eur(w.mindestFreiwillig, 2)} (ein Neunzigstel der Bezugsgröße je Tag, § 240 Abs. 4 SGB V) und höchstens die Beitragsbemessungsgrenze von ${DE.eur(w.bbgKv, 2)}. Der Satz ist ${DE.pz(w.kv_ermaessigt)} ohne Krankengeld oder ${DE.pz(w.kv_allgemein)}, wenn Sie Krankengeld ab der siebten Woche wählen, jeweils plus den vollen Zusatzbeitrag Ihrer Kasse; dazu kommt die Pflege mit ${DE.pz(w.pv_satz)}. Mit dem durchschnittlichen Zusatzbeitrag von ${DE.pz(zbD)} zahlen Sie bei ${DE.eur(3000)} Gewinn ${DE.eur(b3000.selbst)} im Monat ohne und ${DE.eur(b3000kg.selbst)} mit Krankengeld. Der Mindestbeitrag liegt bei ${DE.eur(mind.selbst)}, der Höchstbeitrag bei ${DE.eur(max.selbst)}; 2027 steigen beide auf ${DE.eur(mind7.selbst)} und ${DE.eur(max7.selbst)}. Weil Selbstständige den Zusatzbeitrag voll tragen, bringt ein Kassenwechsel doppelt so viel wie bei Beschäftigten.`,
    faqs: [
      { q: 'Was ist der Mindestbeitrag zur Krankenkasse für Selbstständige?', a: `Der Beitrag auf ${DE.eur(w.mindestFreiwillig, 2)} im Monat, auch wenn der Gewinn darunter liegt: mit durchschnittlichem Zusatzbeitrag ${DE.eur(mind.selbst)} für Kranken- und Pflegeversicherung ohne Krankengeld. 2027 steigt die Mindestbemessung mit der Bezugsgröße auf ${DE.eur(w7.mindestFreiwillig, 2)}, der Mindestbeitrag damit auf ${DE.eur(mind7.selbst)}. Seit 2019 gilt für Selbstständige dieselbe Mindestbemessung wie für alle freiwilligen Mitglieder; Sonderregeln für Gründer gibt es nicht mehr.` },
      { q: 'Lohnt sich das Krankengeld für Selbstständige?', a: `Es kostet ${DE.pz(w.kv_allgemein - w.kv_ermaessigt)} des Gewinns mehr, bei ${DE.eur(3000)} also ${DE.eur(b3000kg.selbst - b3000.selbst)} im Monat. Dafür zahlt die Kasse ab der siebten Woche einer Krankheit Krankengeld nach dem beitragspflichtigen Einkommen (§ 44 SGB V). Wer Rücklagen oder eine private Tagegeldversicherung hat, verzichtet oft; wer allein von seinen Aufträgen lebt, eher nicht.` },
      { q: 'Wie berechnet die Kasse meinen Beitrag, wenn der Steuerbescheid noch fehlt?', a: 'Vorläufig nach Ihrer Schätzung oder dem letzten Bescheid; ist kein Bescheid da, setzt sie oft zunächst den Höchstbeitrag an. Sobald der Steuerbescheid für das Jahr vorliegt, rechnet sie endgültig ab und erstattet zu viel gezahlte Beiträge oder fordert nach (§ 240 Abs. 4a SGB V). Reichen Sie den Bescheid deshalb rechtzeitig ein.' },
      { q: 'Wie viel spare ich als Selbstständiger mit einer günstigeren Kasse?', a: `Den ganzen Unterschied im Zusatzbeitrag, nicht nur die Hälfte: Bei ${DE.eur(3000)} Gewinn liegen zwischen ${billig.kurz} (${DE.pk(billig.zb!)}) und ${teuer.kurz} (${DE.pk(teuer.zb!)}) ${DE.eur(spanne3000)} im Jahr. Am Höchstbeitrag ist es noch mehr, weil der Zusatzbeitrag bis zur Grenze mitwächst.` },
    ],
    body: (h) => `
<h2>Beitrag nach Gewinn, mit durchschnittlichem Zusatzbeitrag</h2>
${h.table(['Gewinn im Monat', 'Grundlage', 'ohne Krankengeld', 'mit Krankengeld'], gewinne.map((g) => [h.eur(g), h.eur(s(g).basisKv, 2), h.eur(s(g).selbst), h.eur(s(g, true).selbst)]), `2026, Zusatzbeitrag ${h.pz(zbD)}, Pflege mit Kind, Kranken- und Pflegeversicherung zusammen`, ['r', 'r', 'r', 'r'])}
<h2>Was als Einkommen zählt</h2>
<p>Für freiwillige Mitglieder zählt die gesamte wirtschaftliche Leistungsfähigkeit: der Gewinn aus selbstständiger Arbeit, aber auch Mieteinnahmen, Kapitalerträge und Renten. Die Kasse liest diese Beträge aus dem Einkommensteuerbescheid und teilt sie durch zwölf. Wer neben der Selbstständigkeit angestellt ist, ist in der Regel über die Beschäftigung pflichtversichert, solange die Selbstständigkeit nicht hauptberuflich ist; dann zahlt man auf den Lohn wie jeder Beschäftigte. Mehr zur freiwilligen Mitgliedschaft im Allgemeinen: ${h.a('freiwillig-versichert', 'freiwillig versichert')}.</p>
<h2>Die Grenzen 2026 und 2027</h2>
${h.table(['', '2026', '2027 (vorläufig)'], [['Mindestbemessung im Monat', h.eur(w.mindestFreiwillig, 2), h.eur(w7.mindestFreiwillig, 2)], ['Beitragsbemessungsgrenze im Monat', h.eur(w.bbgKv, 2), h.eur(w7.bbgKv, 2)], ['Mindestbeitrag ohne Krankengeld', h.eur(mind.selbst), h.eur(mind7.selbst)], ['Höchstbeitrag ohne Krankengeld', h.eur(max.selbst), h.eur(max7.selbst)]], 'Mit durchschnittlichem Zusatzbeitrag und Pflege mit Kind; 2027 nach dem Kabinettsbeschluss zu den Rechengrößen', ['l', 'r', 'r'])}
<p>Der Höchstbeitrag steigt 2027 stärker als die Löhne, weil das GKV-Beitragssatzstabilisierungsgesetz die Beitragsbemessungsgrenze einmalig um ${h.eur(3600)} im Jahr zusätzlich anhebt. In der Pflege bleibt die Grenze nach geltendem Recht bei ${h.eur(w7.bbgPv)} im Monat (${h.a('beitragsbemessungsgrenze', 'mehr zur Beitragsbemessungsgrenze')}).</p>`,
  },
  en: {
    slug: 'health-insurance-self-employed',
    nav: 'Self-employed',
    card: `At least ${EN.eur(mind.selbst)} a month, at most ${EN.eur(max.selbst)}: all paid by you, with or without sick pay, at every fund.`,
    title: 'Health Insurance Self-Employed Germany 2027: Min and Max',
    description: `German statutory health insurance for the self-employed 2026/2027: profit times ${EN.pz(w.kv_ermaessigt, 1)} or ${EN.pz(w.kv_allgemein, 1)} plus the fund’s rate, care, minimum, maximum, comparison.`,
    h1: 'Health insurance for the self-employed in Germany: minimum to maximum',
    intro: `Without sick pay, self-employed members pay at least ${EN.eur(mind.selbst)} and at most ${EN.eur(max.selbst)} a month in 2026, health and care insurance together.`,
    resume: `Self-employed people in Germany’s statutory system are voluntary members (freiwillig versichert) and pay the whole contribution themselves, since no employer covers half. The base is profit from the latest income tax assessment divided by twelve, but at least ${EN.eur(w.mindestFreiwillig, 2)} a month (one ninetieth of the reference value per day, section 240(4) SGB V) and at most the contribution ceiling of ${EN.eur(w.bbgKv, 2)}. The rate is ${EN.pz(w.kv_ermaessigt)} without sick pay, or ${EN.pz(w.kv_allgemein)} if you opt for sick pay from week seven, plus your fund’s full additional rate (Zusatzbeitrag); long-term care adds ${EN.pz(w.pv_satz)}. At the average additional rate of ${EN.pz(zbD)}, a ${EN.eur(3000)} profit costs ${EN.eur(b3000.selbst)} a month without and ${EN.eur(b3000kg.selbst)} with sick pay. The minimum is ${EN.eur(mind.selbst)}, the maximum ${EN.eur(max.selbst)}; in 2027 they rise to ${EN.eur(mind7.selbst)} and ${EN.eur(max7.selbst)}. Because you carry the whole additional rate, switching fund saves twice as much as it does for an employee.`,
    faqs: [
      { q: 'What is the minimum health insurance contribution for the self-employed?', a: `The contribution on ${EN.eur(w.mindestFreiwillig, 2)} a month, even if your profit is lower: ${EN.eur(mind.selbst)} for health and care insurance without sick pay at the average additional rate. In 2027 the minimum base rises with the reference value to ${EN.eur(w7.mindestFreiwillig, 2)}, so the minimum becomes ${EN.eur(mind7.selbst)}. Since 2019 the self-employed have had the same minimum base as every voluntary member; there are no special founder rules any more.` },
      { q: 'Is sick pay worth it for the self-employed?', a: `It costs ${EN.pz(w.kv_allgemein - w.kv_ermaessigt)} more of your profit, ${EN.eur(b3000kg.selbst - b3000.selbst)} a month on ${EN.eur(3000)}. In return the fund pays sick pay (Krankengeld) from week seven of an illness, based on your contributory income (section 44 SGB V). People with savings or private daily sickness cover often skip it; those living from current contracts usually do not.` },
      { q: 'How is my contribution set before my tax assessment arrives?', a: 'Provisionally, from your estimate or the last assessment; without any assessment funds often start at the maximum. Once the tax assessment for the year arrives, the fund settles finally and refunds overpayments or asks for more (section 240(4a) SGB V). So send in the assessment promptly.' },
      { q: 'How much does a cheaper fund save a self-employed member?', a: `The whole difference in additional rate, not half: on ${EN.eur(3000)} profit, ${billig.kurz} (${EN.pk(billig.zb!)}) and ${teuer.kurz} (${EN.pk(teuer.zb!)}) are ${EN.eur(spanne3000)} a year apart. At the maximum the gap is larger still, because the additional rate grows with income up to the ceiling.` },
    ],
    body: (h) => `
<h2>Contribution by profit, at the average additional rate</h2>
${h.table(['Monthly profit', 'Base', 'without sick pay', 'with sick pay'], gewinne.map((g) => [h.eur(g), h.eur(s(g).basisKv, 2), h.eur(s(g).selbst), h.eur(s(g, true).selbst)]), `2026, additional rate ${h.pz(zbD)}, care with one child, health and care together`, ['r', 'r', 'r', 'r'])}
<h2>What counts as income</h2>
<p>For voluntary members the fund looks at total economic capacity: profit from self-employment, but also rental and investment income and pensions. It reads these from your income tax assessment and divides by twelve. If you are also employed, you are usually covered compulsorily through the job as long as self-employment is not your main occupation; you then pay on your wages like any employee. More on voluntary membership in general: ${h.a('freiwillig-versichert', 'voluntary membership')}.</p>
<h2>Limits for 2026 and 2027</h2>
${h.table(['', '2026', '2027 (provisional)'], [['Minimum base a month', h.eur(w.mindestFreiwillig, 2), h.eur(w7.mindestFreiwillig, 2)], ['Contribution ceiling a month', h.eur(w.bbgKv, 2), h.eur(w7.bbgKv, 2)], ['Minimum without sick pay', h.eur(mind.selbst), h.eur(mind7.selbst)], ['Maximum without sick pay', h.eur(max.selbst), h.eur(max7.selbst)]], 'At the average additional rate, care with one child; 2027 per the cabinet decision on reference values', ['l', 'r', 'r'])}
<p>The maximum rises faster than wages in 2027 because the 2026 contribution stabilisation act lifts the ceiling by an extra ${h.eur(3600)} a year, once. For care insurance the ceiling stays at ${h.eur(w7.bbgPv)} a month under current law (${h.a('beitragsbemessungsgrenze', 'more on the contribution ceiling')}).</p>`,
  },
});
