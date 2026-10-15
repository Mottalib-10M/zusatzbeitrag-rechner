import { defineGuide } from '../../lib/guide-types';
import { angestellt } from '../../lib/engine/beitrag';
import { offen, statistik, KASSEN } from '../../lib/engine/kassen';
import { P, J, DE, EN } from '../../lib/fmt';

/** Zusatzbeitrag 2027: Schätzung des Schätzerkreises, Fahrplan bis Januar, Kosten einer Erhöhung. Alles aus P, J und dem Motor. */
const S = P.schaetzung_2027;
const w26 = J(2026), w27 = J(2027);
const rechnerisch = (S.luecke_mrd / S.bpe_mrd) * 100;
const st = statistik(offen());
const ueber = offen().filter((k) => k.zb! > w26.zb_durchschnitt).length;
const unter = offen().filter((k) => k.zb! < w26.zb_durchschnitt).length;
/** Mehrkosten im Jahr (Anteil Beschäftigte, ein Kind) bei einer Erhöhung um p Punkte, Grenzen 2027. */
const mehr = (brutto: number, p: number) => (angestellt({ brutto, zb: w27.zb_durchschnitt + p, jahr: 2027, eltern: 'k1' }).selbst - angestellt({ brutto, zb: w27.zb_durchschnitt, jahr: 2027, eltern: 'k1' }).selbst) * 12;
const LOEHNE = [2500, 3800, 5000, w27.bbgKv];
const SCHRITTE = [0.2, 0.5];
const mittelBeispiel = mehr(3800, 0.3);
const nKassen = KASSEN.filter((k) => k.zb !== null).length;
const ausgabenPlus = ((S.ausgaben_mrd - S.ausgaben_2026_mrd) / S.ausgaben_2026_mrd) * 100;

export default defineGuide({
  id: 'zusatzbeitrag-2027',
  group: 'wissen',
  order: 80,
  mini: 'erhoehung',
  related: ['durchschnittlicher-zusatzbeitrag', 'sonderkuendigungsrecht', 'zusatzbeitrag-liste', 'beitragsbemessungsgrenze', 'krankenkasse-wechseln'],
  sources: ['basTableau2027', 'basSchaetzerkreis', 'sgb5_242a', 'gkvListe', 'sgb5_175'],
  de: {
    slug: 'zusatzbeitrag-prognose',
    nav: 'Zusatzbeitrag 2027',
    card: `Schätzerkreis: rechnerisch ${DE.pz(w27.zb_durchschnitt, 1)} für 2027. Was das für Ihre Kasse heißt und wann die echten Sätze feststehen.`,
    title: 'Zusatzbeitrag 2027: Prognose, Fahrplan, was es kostet',
    description: `Zusatzbeitrag 2027: Der Schätzerkreis rechnet mit ${DE.pz(w27.zb_durchschnitt, 1)}, die Kassen verlangen heute mehr. Der Fahrplan bis Januar und was jede Erhöhung in Euro kostet.`,
    h1: 'Zusatzbeitrag 2027: was feststeht und was nicht',
    intro: `Rechnerisch ${DE.pz(w27.zb_durchschnitt, 1)} im Schnitt, so die Schätzung vom 14. Oktober 2026; den Satz Ihrer Kasse für 2027 kennt heute noch niemand.`,
    resume: `Für 2027 hat der Schätzerkreis beim Bundesamt für Soziale Sicherung am 14. Oktober 2026 Ausgaben der Krankenkassen von ${DE.num(S.ausgaben_mrd, 1)} Milliarden Euro vorausgesagt, ${DE.pz(ausgabenPlus, 1)} mehr als 2026. Die Zuweisungen des Gesundheitsfonds decken davon ${DE.num(S.zuweisungen_mrd, 1)} Milliarden; die Lücke von ${DE.num(S.luecke_mrd, 1)} Milliarden, geteilt durch die beitragspflichtigen Einnahmen aller Mitglieder von ${DE.num(S.bpe_mrd, 1)} Milliarden, ergibt rechnerisch ${DE.pz(rechnerisch, 2)}, gerundet ${DE.pz(w27.zb_durchschnitt, 1)} wie 2026. Diesen Durchschnitt legt das Bundesgesundheitsministerium bis zum 1. November im Bundesanzeiger fest (§ 242a SGB V). Er ist aber nur eine Rechengröße: Was Sie zahlen, beschließt der Verwaltungsrat Ihrer Kasse, meist im Dezember. Heute liegen ${ueber} frei wählbare Kassen über und ${unter} unter ${DE.pz(w26.zb_durchschnitt, 1)}, der einfache Mittelwert aller Sätze beträgt ${DE.pz(st.mittel, 2)}. Jeder Zehntelpunkt mehr kostet Beschäftigte mit ${DE.eur(3800)} brutto rund ${DE.eur(mehr(3800, 0.1))} im Jahr.`,
    faqs: [
      { q: 'Wann erfahre ich den Zusatzbeitrag meiner Kasse für 2027?', a: 'Die Verwaltungsräte beschließen die neuen Sätze meist in ihrer Dezembersitzung, die Aufsicht genehmigt die Satzungsänderung. Viele Kassen informieren ihre Mitglieder per Brief oder auf ihrer Internetseite; eine Pflicht, jedes Mitglied einzeln anzuschreiben, enthält § 175 SGB V in der geltenden Fassung nicht. In der amtlichen Liste des GKV-Spitzenverbands erscheint der neue Satz erst am 1. Januar, dem Tag, an dem er gilt. Unser Rechner liest diese Liste täglich und zieht den neuen Satz am selben Tag nach.' },
      { q: 'Warum zahlen viele Kassen schon heute mehr als den Durchschnittssatz?', a: `Der Durchschnittssatz ist eine Prognose für das ganze System, kein Mittel der tatsächlich erhobenen Sätze. Viele Kassen mussten im laufenden Jahr Rücklagen auffüllen, die gesetzlich vorgeschrieben sind, und haben deshalb höher kalkuliert. Heute liegen ${ueber} der frei wählbaren Kassen über ${DE.pz(w26.zb_durchschnitt, 1)}; der einfache Mittelwert aller Sätze beträgt ${DE.pz(st.mittel, 2)}, ohne Gewichtung nach Mitgliederzahl.` },
      { q: 'Was kostet mich eine Erhöhung um 0,3 Punkte?', a: `Als Beschäftigter tragen Sie die Hälfte. Bei ${DE.eur(3800)} brutto sind das ${DE.eur(mittelBeispiel)} im Jahr mehr, der Arbeitgeber zahlt denselben Betrag. Wer an oder über der Beitragsbemessungsgrenze 2027 von ${DE.eur(w27.bbgKv)} verdient, zahlt höchstens ${DE.eur(mehr(w27.bbgKv, 0.3))} mehr. Rentner tragen ebenfalls die Hälfte, Selbstständige den vollen Aufschlag.` },
      { q: 'Kann der Durchschnittssatz für 2027 noch steigen?', a: 'Die Festlegung durch das Bundesgesundheitsministerium stützt sich auf die Schätzung vom Oktober und ist für das ganze Jahr verbindlich. Für die einzelnen Kassen gilt das nicht: Reicht das Geld im Laufe des Jahres nicht, müssen sie ihren Satz auch unterjährig anheben (§ 242 Abs. 2 SGB V). Auch dann gilt das Sonderkündigungsrecht, ab dem Monat der Erhöhung.' },
      { q: 'Gilt 2027 noch der Satz vom Dezember, wenn ich gerade wechsle?', a: 'Bis zum letzten Tag Ihrer alten Mitgliedschaft zahlen Sie den Satz der alten Kasse, auch wenn er zum Januar steigt. Wer im Dezember die neue Kasse wählt, ist ab dem 1. März dort und zahlt den höheren Satz zwei Monate lang. Bei der Rente wirkt eine Änderung ohnehin erst zwei Monate später, weil die Rentenversicherung die neuen Sätze verzögert übernimmt.' },
    ],
    body: (h) => `
<h2>Von der Schätzung zum Satz auf dem Lohnzettel</h2>
<p>Der Weg zum Beitrag 2027 hat vier Stationen, und nur die erste ist schon passiert. Am ${h.date(S.datum)} hat der Schätzerkreis, in dem Fachleute des Gesundheitsministeriums, des Bundesamts für Soziale Sicherung und des GKV-Spitzenverbands sitzen, Einnahmen und Ausgaben für 2027 vorausgesagt (${h.src('basTableau2027', 'Schätztableau')}). Bis zum 1. November gibt das Ministerium den durchschnittlichen Zusatzbeitragssatz im Bundesanzeiger bekannt. Im Dezember beschließen die Verwaltungsräte der Kassen ihre eigenen Sätze. Am 1. Januar gelten sie, und erst an diesem Tag stehen sie in der ${h.src('gkvListe', 'Liste des GKV-Spitzenverbands')}.</p>
${h.table(['Position im Schätztableau', '2027'], [
  ['Ausgaben der Krankenkassen', `${h.num(S.ausgaben_mrd, 1)} Mrd. €`],
  ['Zuweisungen aus dem Gesundheitsfonds', `${h.num(S.zuweisungen_mrd, 1)} Mrd. €`],
  ['Lücke, die Zusatzbeiträge decken müssen', `${h.num(S.luecke_mrd, 1)} Mrd. €`],
  ['Beitragspflichtige Einnahmen aller Mitglieder', `${h.num(S.bpe_mrd, 1)} Mrd. €`],
  ['Rechnerischer Satz (Lücke ÷ Einnahmen)', h.pz(rechnerisch, 2)],
], 'GKV-Schätzerkreis, Stand 14. Oktober 2026', ['l', 'r'])}
<p>Der rechnerische Wert von ${h.pz(rechnerisch, 2)} wird auf eine Stelle gerundet. Dass er 2027 bei ${h.pz(w27.zb_durchschnitt, 1)} bleibt, hat einen Grund im Gesetz: Das ${h.src('bgblStabG', 'GKV-Beitragssatzstabilisierungsgesetz')} vom Juli 2026 hebt unter anderem die Beitragsbemessungsgrenze 2027 zusätzlich an und erhöht die Pauschale, die Arbeitgeber für Minijobber zahlen. Beides bringt den Kassen Geld, ohne dass der Satz steigt.</p>
<h2>Durchschnitt ist nicht gleich Ihr Satz</h2>
<p>Der amtliche Durchschnitt ist eine Planungsgröße. Er bestimmt, was für Bezieher von Grundsicherungsgeld gezahlt wird, und er geht in die Berechnung für Midijobs ein. Ihr Lohnzettel richtet sich nach dem Satz Ihrer Kasse, und die Kassen weichen stark ab: Heute reicht die Spanne der frei wählbaren Kassen von ${h.pk(st.min)} bis ${h.pk(st.max)}. ${ueber} von ${st.n} liegen über ${h.pz(w26.zb_durchschnitt, 1)}, ${unter} darunter. Der einfache Mittelwert aller Sätze beträgt ${h.pz(st.mittel, 2)}; gewichtet nach Mitgliedern läge er anders, weil große Kassen mehr zählen würden, doch die Mitgliederzahlen je Kasse veröffentlicht die Liste nicht.</p>
<p>Für 2027 heißt das: Eine Kasse, die heute schon deutlich über dem Durchschnitt liegt, hat ihr Defizit vielleicht bereits eingepreist. Eine Kasse weit darunter kann Nachholbedarf haben. Eine verlässliche Vorhersage für einzelne Kassen gibt es nicht, und wir machen keine.</p>
<h2>Was jede Erhöhung in Euro bedeutet</h2>
<p>Der Rechner oben zeigt den Aufschlag für Ihr Einkommen. Die Tabelle gibt ein Gefühl für die Größenordnung, Anteil Beschäftigter mit einem Kind, Grenzen 2027:</p>
${h.table(['Bruttolohn im Monat', ...SCHRITTE.map((p) => `+${h.num(p, 1)} Punkte, im Jahr`)], LOEHNE.map((b) => [h.eur(b), ...SCHRITTE.map((p) => h.eur(mehr(b, p)))]), 'Mit dem Motor dieser Seite gerechnet', ['l', 'r', 'r'])}
<p>Über der Beitragsbemessungsgrenze von ${h.eur(w27.bbgKv)} im Monat wächst der Aufschlag nicht weiter. Rentner tragen die Hälfte wie Beschäftigte, allerdings zwei Monate später (§ 247 SGB V); freiwillig versicherte Selbstständige tragen den ganzen Aufschlag, für sie verdoppeln sich die Beträge der Tabelle.</p>
<p>Ganz so viel fehlt am Monatsende meist nicht. Kranken- und Pflegebeiträge mindern über die Vorsorgepauschale die Lohnsteuer, ein Teil des Aufschlags kommt also über eine etwas niedrigere Steuer zurück. Wie viel, hängt von Steuerklasse und Einkommen ab; unser Rechner zeigt bewusst den Beitrag vor dieser Wirkung, so wie er auf der Abrechnung in der Zeile Krankenversicherung steht. Für den Arbeitgeber ist jede Erhöhung eine echte Mehrausgabe in gleicher Höhe, was erklärt, warum Personalabteilungen im Dezember genau hinsehen.</p>
<h2>Was Sie jetzt schon tun können</h2>
<p>Nichts überstürzen, aber vorbereitet sein. Wer seit mindestens zwölf Monaten bei seiner Kasse ist, kann jederzeit wechseln; wer im Oktober wählt, ist ab Januar bei der neuen Kasse und muss die Entscheidung des alten Verwaltungsrats gar nicht abwarten. Wer kürzer dabei ist, wartet die Entscheidung ab: Erhöht die Kasse, entsteht das ${h.a('sonderkuendigungsrecht', 'Sonderkündigungsrecht')}, und Sie haben bis zum Ende des Monats Zeit, ab dem der höhere Satz gilt. Den genauen Termin rechnet die Seite ${h.a('krankenkasse-wechseln', 'Krankenkasse wechseln')}.</p>
<!--mini:vsdurchschnitt-->
<h2>Was niemand weiß</h2>
<p>Drei Dinge sind heute offen. Erstens der Satz jeder einzelnen Kasse für 2027. Zweitens die endgültigen Rechengrößen: Die Verordnung des Arbeitsministeriums ist vom Kabinett beschlossen, der Bundesrat muss noch zustimmen (${h.src('bmasRg2027', 'BMAS')}). Drittens das Pflegeneuordnungsgesetz, das den Zuschlag für Kinderlose anheben und die Grenze der Pflegeversicherung verschieben soll; es ist ein Entwurf und wird hier nicht gerechnet. Sobald etwas feststeht, rechnet diese Seite neu; die Kassenliste lesen wir jeden Morgen.</p>
<p>Wer jetzt Prognosen einzelner Portale liest, sollte nachsehen, worauf sie beruhen. Ein „erwarteter Durchschnitt“ für 2027 oberhalb des amtlichen Werts ist eine Vermutung über das Verhalten der Verwaltungsräte von ${nKassen} Kassen, keine amtliche Größe. Belastbar sind nur zwei Dinge: der amtliche Durchschnitt, den das Ministerium festlegt, und der Satz Ihrer Kasse, sobald er beschlossen und genehmigt ist. Alles dazwischen ist Spekulation, und auf Spekulation sollte niemand einen Kassenwechsel bauen, der zwölf Monate bindet.</p>`,
  },
  en: {
    slug: 'additional-contribution-forecast',
    nav: 'Additional rate 2027',
    card: `Estimating group: ${EN.pz(w27.zb_durchschnitt, 1)} on paper for 2027. What it means for your fund and when the real rates are known.`,
    title: 'Additional Contribution 2027 Germany: Forecast, Timeline',
    description: `German health insurance additional contribution 2027: the estimate is ${EN.pz(w27.zb_durchschnitt, 1)}, yet funds already charge more. The timeline to January and what each rise costs.`,
    h1: 'The 2027 additional contribution: what is known and what is not',
    intro: `On paper ${EN.pz(w27.zb_durchschnitt, 1)} on average, per the estimate of 14 October 2026; nobody yet knows your own fund’s rate for 2027.`,
    resume: `For 2027 the estimating group (Schätzerkreis) at the Federal Office for Social Security forecast on 14 October 2026 that health funds will spend ${EN.num(S.ausgaben_mrd, 1)} billion euros, ${EN.pz(ausgabenPlus, 1)} more than in 2026. Allocations from the central health fund cover ${EN.num(S.zuweisungen_mrd, 1)} billion of that; the gap of ${EN.num(S.luecke_mrd, 1)} billion, divided by members’ contributory income of ${EN.num(S.bpe_mrd, 1)} billion, gives ${EN.pz(rechnerisch, 2)} on paper, rounded to ${EN.pz(w27.zb_durchschnitt, 1)} as in 2026. The Federal Health Ministry sets this average in the Federal Gazette by 1 November (section 242a of Book V of the Social Code). It is only a benchmark: what you pay is decided by your fund’s board, usually in December. Today ${ueber} open funds charge more than ${EN.pz(w26.zb_durchschnitt, 1)} and ${unter} less, and the simple mean of all rates is ${EN.pz(st.mittel, 2)}. Each tenth of a point costs an employee on ${EN.eur(3800)} gross about ${EN.eur(mehr(3800, 0.1))} a year.`,
    faqs: [
      { q: 'When will I learn my fund’s additional rate for 2027?', a: 'Fund boards usually decide new rates at their December meeting, and the supervisory authority approves the change. Many funds tell members by letter or on their website; section 175 SGB V as currently in force contains no duty to write to each member individually. The official GKV-Spitzenverband list only shows the new rate on 1 January, the day it applies. Our calculator reads that list every day and updates on the same day.' },
      { q: 'Why do so many funds already charge more than the average rate?', a: `The average is a forecast for the whole system, not the mean of rates actually charged. Many funds had to rebuild legally required reserves during the year and priced higher as a result. Today ${ueber} of the open funds are above ${EN.pz(w26.zb_durchschnitt, 1)}; the simple mean of all rates is ${EN.pz(st.mittel, 2)}, not weighted by membership.` },
      { q: 'What does a rise of 0.3 points cost me?', a: `As an employee you carry half. On ${EN.eur(3800)} gross that is ${EN.eur(mittelBeispiel)} a year more, and your employer pays the same. If you earn at or above the 2027 ceiling of ${EN.eur(w27.bbgKv)} a month, the most you pay extra is ${EN.eur(mehr(w27.bbgKv, 0.3))}. Pensioners also carry half; self-employed members carry the whole rise.` },
      { q: 'Can the average rate for 2027 still go up?', a: 'The ministry’s figure rests on the October estimate and is binding for the whole year. Individual funds are different: if money runs short during the year they must raise their rate mid-year (section 242(2) SGB V). The special termination right then applies too, from the month of the increase.' },
      { q: 'Which rate do I pay in January if I am switching just then?', a: 'Until the last day with your old fund you pay its rate, even if it rises in January. Choose a new fund in December and you move there on 1 March, paying the higher rate for two months. For pensions a change always takes effect two months later, because the pension insurance applies new rates with a delay.' },
    ],
    body: (h) => `
<h2>From the estimate to the rate on your payslip</h2>
<p>The 2027 contribution goes through four stages, and only the first has happened. On ${h.date(S.datum)} the estimating group, made up of experts from the Health Ministry, the Federal Office for Social Security and the GKV-Spitzenverband (the funds’ umbrella body), forecast income and spending for 2027 (${h.src('basTableau2027', 'estimate table')}). By 1 November the ministry publishes the average additional rate in the Federal Gazette. In December each fund’s board sets its own rate. On 1 January those rates apply, and only on that day do they appear in the ${h.src('gkvListe', 'GKV-Spitzenverband list')}.</p>
${h.table(['Item in the estimate table', '2027'], [
  ['Spending by health funds', `€${h.num(S.ausgaben_mrd, 1)} bn`],
  ['Allocations from the central health fund', `€${h.num(S.zuweisungen_mrd, 1)} bn`],
  ['Gap to be covered by additional rates', `€${h.num(S.luecke_mrd, 1)} bn`],
  ['Contributory income of all members', `€${h.num(S.bpe_mrd, 1)} bn`],
  ['Rate on paper (gap ÷ income)', h.pz(rechnerisch, 2)],
], 'GKV estimating group, 14 October 2026', ['l', 'r'])}
<p>The paper figure of ${h.pz(rechnerisch, 2)} is rounded to one decimal. That it stays at ${h.pz(w27.zb_durchschnitt, 1)} in 2027 owes something to legislation: the ${h.src('bgblStabG', 'contribution stabilisation act')} of July 2026 raises the 2027 contribution ceiling by an extra amount and increases the flat contribution employers pay for minijobbers. Both bring the funds money without the rate going up.</p>
<h2>The average is not your rate</h2>
<p>The official average is a planning figure. It sets what is paid for people on basic income support and feeds into the formula for midijobs. Your payslip follows your own fund’s rate, and funds differ widely: open funds today range from ${h.pk(st.min)} to ${h.pk(st.max)}. ${ueber} of ${st.n} are above ${h.pz(w26.zb_durchschnitt, 1)} and ${unter} below. The simple mean of all rates is ${h.pz(st.mittel, 2)}; weighted by members it would differ, because big funds would count more, but the list does not publish membership numbers.</p>
<p>For 2027 that means a fund already well above average may have priced in its deficit, while one far below may have catching up to do. There is no reliable forecast for individual funds, and we do not make one.</p>
<h2>What each rise means in euros</h2>
<p>The calculator above shows the rise for your income. The table gives a sense of scale, employee share with one child, 2027 thresholds:</p>
${h.table(['Gross pay a month', ...SCHRITTE.map((p) => `+${h.num(p, 1)} points, a year`)], LOEHNE.map((b) => [h.eur(b), ...SCHRITTE.map((p) => h.eur(mehr(b, p)))]), 'Worked out with this site’s engine', ['l', 'r', 'r'])}
<p>Above the contribution ceiling of ${h.eur(w27.bbgKv)} a month the rise stops growing. Pensioners pay half, like employees, but two months later (section 247 SGB V); self-employed voluntary members carry the whole rise, so the table’s figures double for them.</p>
<p>Your take-home pay usually falls by a little less. Health and care contributions reduce wage tax through the so-called Vorsorgepauschale, the flat allowance payroll uses for insurance costs, so part of the rise comes back as slightly lower tax. How much depends on your tax class and income; our calculator deliberately shows the contribution before that effect, exactly as it appears on the payslip line for health insurance. For the employer every rise is a real extra cost of the same size, which is why payroll teams watch December closely.</p>
<h2>What you can do now</h2>
<p>No need to rush, but be ready. If you have been with your fund for at least twelve months you can switch at any time; choose a new fund in October and it covers you from January, without waiting for your old fund’s board. If you joined more recently, wait for the decision: once your fund raises its rate, the ${h.a('sonderkuendigungsrecht', 'special termination right')} applies and you have until the end of the month in which the higher rate starts. The page on ${h.a('krankenkasse-wechseln', 'switching fund')} works out the exact date.</p>
<!--mini:vsdurchschnitt-->
<h2>What nobody knows yet</h2>
<p>Three things are open today. First, each fund’s 2027 rate. Second, the final thresholds: the Labour Ministry’s ordinance has been adopted by the cabinet but still needs the Bundesrat (${h.src('bmasRg2027', 'BMAS')}). Third, the Care Reorganisation Act, which would raise the childless surcharge and move the care insurance ceiling; it is a draft and is not calculated here. As soon as anything is settled, this page recalculates; we read the fund list every morning.</p>
<p>If you read forecasts on comparison portals, check what they rest on. An “expected average” for 2027 above the official figure is a guess about how the boards of ${nKassen} funds will act, not an official number. Only two things are solid: the official average the ministry sets, and your own fund’s rate once it has been decided and approved. Everything in between is speculation, and nobody should base a switch that ties them for twelve months on speculation.</p>`,
  },
});
