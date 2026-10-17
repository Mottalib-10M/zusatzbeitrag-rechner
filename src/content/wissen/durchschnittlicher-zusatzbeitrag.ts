import { defineGuide } from '../../lib/guide-types';
import { angestellt } from '../../lib/engine/beitrag';
import { offen, statistik } from '../../lib/engine/kassen';
import { P, J, DE, EN } from '../../lib/fmt';

/** Durchschnittlicher Zusatzbeitragssatz (§ 242a SGB V): Herleitung, Verwendungen, Abstand der echten Sätze. */
const w26 = J(2026), w27 = J(2027);
const S = P.schaetzung_2027;
const st = statistik(offen());
const alle = offen();
const nahe = alle.filter((k) => Math.abs(k.zb! - w26.zb_durchschnitt) <= 0.25).length;
const darueber = alle.filter((k) => k.zb! > w26.zb_durchschnitt).length;
/** Höchster Arbeitgeberzuschuss zur privaten Krankenversicherung (§ 257 Abs. 2 SGB V): halber allgemeiner Satz plus halber Durchschnittssatz auf die BBG. */
const pkvZuschuss = (w: typeof w26) => Math.round(w.bbgKv * (w.kv_allgemein + w.zb_durchschnitt) / 2) / 100;
/** Minijob-Pauschale auf den Höchstbetrag eines Minijobs, aus dem Motor. */
const mj26 = angestellt({ brutto: w26.geringfuegigkeit, zb: w26.zb_durchschnitt, jahr: 2026, eltern: 'k1' }).kv.andere;
const mj27 = angestellt({ brutto: w27.geringfuegigkeit, zb: w27.zb_durchschnitt, jahr: 2027, eltern: 'k1' }).kv.andere;
const gesamtSv = w26.rv_satz + w26.pv_satz + w26.av_satz + w26.kv_allgemein + w26.zb_durchschnitt;
/** Was ein Beschäftigter mit 3.800 € bei der günstigsten und der teuersten Kasse gegenüber dem Durchschnitt im Jahr zahlt. */
const proJahr = (zb: number) => Math.round((angestellt({ brutto: 3800, zb, jahr: 2026, eltern: 'k1' }).selbst - angestellt({ brutto: 3800, zb: w26.zb_durchschnitt, jahr: 2026, eltern: 'k1' }).selbst) * 12);

export default defineGuide({
  id: 'durchschnittlicher-zusatzbeitrag',
  group: 'wissen',
  order: 81,
  mini: 'vsdurchschnitt',
  related: ['zusatzbeitrag-2027', 'beitragssatz-krankenkasse', 'midijob-krankenversicherung', 'zusatzbeitrag-liste', 'hek-hanseatische-krankenkasse'],
  sources: ['sgb5_242a', 'sgb5_242', 'banzZb2026', 'basTableau2027', 'sgb5_257', 'sgb4_20'],
  de: {
    slug: 'durchschnittlicher-zusatzbeitrag',
    nav: 'Durchschnittlicher Zusatzbeitrag',
    card: `${DE.pz(w26.zb_durchschnitt, 1)} für 2026, rechnerisch ${DE.pz(w27.zb_durchschnitt, 1)} für 2027: wofür der amtliche Satz gilt und warum Ihre Kasse davon abweicht.`,
    title: 'Durchschnittlicher Zusatzbeitrag 2027: Wert und Zweck',
    description: `Durchschnittlicher Zusatzbeitrag 2026 und 2027: ${DE.pz(w26.zb_durchschnitt, 1)} laut Bundesanzeiger, wie das Ministerium ihn herleitet, wofür er gilt und was Sie bei Ihrer Kasse zahlen.`,
    h1: 'Der durchschnittliche Zusatzbeitragssatz: was er ist und was nicht',
    intro: `${DE.pz(w26.zb_durchschnitt, 1)} für 2026, laut Schätzung ebenso für 2027. Gezahlt wird er nur von wenigen Gruppen; alle anderen zahlen den Satz ihrer Kasse.`,
    resume: `Der durchschnittliche Zusatzbeitragssatz beträgt 2026 ${DE.pz(w26.zb_durchschnitt, 1)}; das Bundesgesundheitsministerium hat ihn am 10. November 2025 im Bundesanzeiger bekannt gemacht, und für 2027 ergibt die Schätzung vom 14. Oktober 2026 rechnerisch denselben Wert. Er entsteht nach § 242a SGB V aus einer einfachen Division: die erwarteten Ausgaben der Kassen minus das, was der Gesundheitsfonds ihnen zuweist, geteilt durch die beitragspflichtigen Einnahmen aller Mitglieder. Für 2027 sind das ${DE.num(S.luecke_mrd, 1)} durch ${DE.num(S.bpe_mrd, 1)} Milliarden Euro. Der Satz ist kein Mittelwert dessen, was die Kassen verlangen: Heute liegen ${darueber} von ${st.n} frei wählbaren Kassen darüber, der einfache Mittelwert aller Sätze beträgt ${DE.pz(st.mittel, 2)}. Direkt zahlen ihn nur Bezieher von Grundsicherungsgeld, Menschen in Werkstätten und einige andere Gruppen. Indirekt wirkt er überall: beim Zuschuss für Privatversicherte, bei Minijobs ab 2027 und bei Midijobs.`,
    faqs: [
      { q: 'Muss ich den durchschnittlichen Zusatzbeitrag zahlen oder den meiner Kasse?', a: `Als Beschäftigter, Rentner, Selbstständiger oder Student zahlen Sie den Satz Ihrer Kasse, wie er in der Liste des GKV-Spitzenverbands steht. Den Durchschnittssatz von ${DE.pz(w26.zb_durchschnitt, 1)} zahlen nur die Gruppen aus § 242 Abs. 3 SGB V, etwa Bezieher von Grundsicherungsgeld oder Auszubildende mit sehr geringer Vergütung, für die ohnehin jemand anderes den Beitrag trägt.` },
      { q: 'Wer legt den durchschnittlichen Zusatzbeitragssatz fest?', a: 'Das Bundesgesundheitsministerium, nach Auswertung der Prognose des Schätzerkreises, in dem das Ministerium, das Bundesamt für Soziale Sicherung und der GKV-Spitzenverband sitzen. Die Bekanntmachung im Bundesanzeiger muss bis zum 1. November erfolgen (§ 242a Abs. 2 SGB V). Danach gilt der Wert für das ganze folgende Jahr, auch wenn sich die Finanzlage ändert.' },
      { q: 'Spielt der Durchschnittssatz für Privatversicherte eine Rolle?', a: `Ja. Der Arbeitgeberzuschuss zur privaten Krankenversicherung ist auf die Hälfte dessen begrenzt, was ein gesetzlich Versicherter an der Beitragsbemessungsgrenze mit allgemeinem Satz und durchschnittlichem Zusatzbeitrag zahlen würde (§ 257 Abs. 2 SGB V). 2026 sind das höchstens ${DE.eur(pkvZuschuss(w26), 2)} im Monat, nach den vorläufigen Werten 2027 ${DE.eur(pkvZuschuss(w27), 2)}, und nie mehr als die Hälfte der tatsächlichen Prämie.` },
      { q: 'Warum ist der tatsächliche Durchschnitt höher als der amtliche Satz?', a: `Weil der amtliche Satz nur die erwartete Lücke eines Jahres deckt. Viele Kassen mussten zusätzlich ihre gesetzlich vorgeschriebenen Rücklagen auffüllen oder Defizite aus dem Vorjahr ausgleichen und verlangen deshalb mehr. Der einfache Mittelwert aller frei wählbaren Kassen liegt heute bei ${DE.pz(st.mittel, 2)}, gegenüber ${DE.pz(w26.zb_durchschnitt, 1)} amtlich.` },
      { q: 'Ändert sich der Durchschnittssatz, wenn eine große Kasse erhöht?', a: 'Nein. Er wird einmal im Jahr festgelegt und bleibt bis zum Jahresende unverändert, egal was einzelne Kassen beschließen. Erhöht eine Kasse, betrifft das nur ihre eigenen Mitglieder; sie erhalten ein Sonderkündigungsrecht. Für den Zuschuss an Privatversicherte oder die Minijob-Pauschale ändert sich dadurch nichts.' },
    ],
    body: (h) => `
<h2>Eine Division mit großen Zahlen</h2>
<p>§ 242a SGB V gibt die Formel vor: voraussichtliche Ausgaben aller Kassen, abzüglich der Mittel, die der Gesundheitsfonds für Zuweisungen zur Verfügung hat, geteilt durch die voraussichtlichen beitragspflichtigen Einnahmen der Mitglieder, mal hundert. Der Gesundheitsfonds bekommt den allgemeinen Beitragssatz von ${h.pz(w26.kv_allgemein, 1)} aller Versicherten und den Bundeszuschuss; was die Kassen darüber hinaus ausgeben, müssen sie über Zusatzbeiträge holen. Für 2027 hat der Schätzerkreis die Zutaten am ${h.date(S.datum)} geliefert (${h.src('basTableau2027', 'Schätztableau')}):</p>
${h.table(['', '2027'], [
  ['Ausgaben der Krankenkassen', `${h.num(S.ausgaben_mrd, 1)} Mrd. €`],
  ['minus Zuweisungen des Gesundheitsfonds', `${h.num(S.zuweisungen_mrd, 1)} Mrd. €`],
  ['= Lücke', `${h.num(S.luecke_mrd, 1)} Mrd. €`],
  ['÷ beitragspflichtige Einnahmen', `${h.num(S.bpe_mrd, 1)} Mrd. €`],
  ['= rechnerischer Satz', h.pz((S.luecke_mrd / S.bpe_mrd) * 100, 2)],
], undefined, ['l', 'r'])}
<p>Das Ministerium rundet und veröffentlicht das Ergebnis. Für 2026 war es ${h.pz(w26.zb_durchschnitt, 1)} (${h.src('banzZb2026', 'BAnz AT 10.11.2025 B7')}); die Bekanntmachung für 2027 steht bis zum 1. November aus.</p>
<h2>Wer genau diesen Satz zahlt</h2>
<p>Für eine kleine Gruppe ist der Durchschnitt tatsächlich der Satz auf dem Bescheid. § 242 Abs. 3 SGB V zählt sie auf: Bezieher von Grundsicherungsgeld, Menschen in Leistungen zur Teilhabe am Arbeitsleben, Beschäftigte in Werkstätten für behinderte Menschen, deren Entgelt den Mindestbetrag nicht übersteigt, Mitglieder, die Verletztengeld oder vergleichbare Leistungen beziehen, und Beschäftigte, für die der Arbeitgeber den Beitrag allein trägt, also Auszubildende mit sehr geringer Vergütung und Freiwillige im Jugend- oder Bundesfreiwilligendienst. Für sie spielt die Wahl der Kasse beim Preis keine Rolle, weil jede Kasse denselben Satz ansetzen muss.</p>
<h2>Wo er sonst steckt</h2>
${h.table(['Verwendung', '2026', '2027 (vorläufig)'], [
  ['Höchster Arbeitgeberzuschuss zur PKV im Monat (§ 257 Abs. 2)', h.eur(pkvZuschuss(w26), 2), h.eur(pkvZuschuss(w27), 2)],
  ['Minijob-Pauschale der Krankenversicherung, in Prozent', h.pz(w26.minijob_ag_kv, 1), h.pz(w27.minijob_ag_kv, 1)],
  ['Pauschale auf den höchsten Minijob-Verdienst', h.eur(mj26, 2), h.eur(mj27, 2)],
  ['Faktor F im Übergangsbereich (Midijob)', h.num(w26.faktor_f, 4), h.num(w27.faktor_f, 4)],
], 'Werte aus den Rechengrößen dieser Seite', ['l', 'r', 'r'])}
<p>Drei Stellen sind für viele Menschen wichtiger als der Satz selbst. Privat Versicherte Beschäftigte bekommen vom Arbeitgeber höchstens die Hälfte dessen, was ein gesetzlich Versicherter an der Beitragsbemessungsgrenze mit Durchschnittssatz zahlen würde (${h.src('sgb5_257', '§ 257 SGB V')}). Bei Minijobs zahlt der Arbeitgeber 2026 eine Pauschale von ${h.pz(w26.minijob_ag_kv, 1)}; ab 2027 ist sie nach dem neuen § 249b SGB V an den allgemeinen Satz plus den Durchschnitt gekoppelt, ${h.pz(w27.minijob_ag_kv, 1)}. Und im Übergangsbereich zwischen Minijob und ${h.eur(w26.uebergang_oben)} geht der Durchschnitt in den Gesamtsozialversicherungsbeitragssatz von ${h.pz(gesamtSv, 1)} ein, aus dem der Faktor F entsteht (${h.src('sgb4_20', '§ 20 SGB IV')}); mehr dazu im Ratgeber ${h.a('midijob-krankenversicherung', 'Midijob')}.</p>
<h2>Wie weit die echten Sätze abweichen</h2>
<p>Von ${st.n} frei wählbaren Kassen liegen ${nahe} innerhalb eines Viertelpunkts um den Durchschnitt, ${darueber} darüber. Die Spanne reicht von ${h.pk(st.min)} bis ${h.pk(st.max)}. In Euro sieht das bei ${h.eur(3800)} brutto so aus: Bei der günstigsten Kasse zahlen Sie ${h.eur(Math.abs(proJahr(st.min)))} im Jahr weniger als beim Durchschnittssatz, bei der teuersten ${h.eur(proJahr(st.max))} mehr. Der Mittelwert aller Sätze, ${h.pz(st.mittel, 2)}, ist ungewichtet; jede kleine Betriebskrankenkasse zählt so viel wie die größte Ersatzkasse. Einen nach Mitgliedern gewichteten Durchschnitt veröffentlicht der GKV-Spitzenverband in seiner Liste nicht.</p>
<h2>Drei Missverständnisse, die in jedem Herbst wiederkehren</h2>
<p>Das erste: „Der Zusatzbeitrag steigt 2027 nicht.“ Gemeint ist meist der amtliche Durchschnitt, und der sagt über Ihre Kasse wenig. Jede Kasse kalkuliert für sich; bleibt der Durchschnitt gleich, kann Ihre Kasse trotzdem erhöhen, weil sie Rücklagen auffüllen muss, oder senken, weil sie Überschüsse hat. Maßgeblich ist allein der Brief Ihrer Kasse im Dezember und der Eintrag in der Liste ab dem 1. Januar.</p>
<p>Das zweite: „Liegt meine Kasse unter dem Durchschnitt, bin ich gut aufgehoben.“ Beim Preis vielleicht, aber nicht unbedingt gut genug. Die Frage ist, wie viele Kassen in Ihrem Land noch günstiger sind und um wie viele Euro. Bei einem mittleren Lohn liegen zwischen einer Kasse knapp unter dem Durchschnitt und der günstigsten oft noch dreistellige Beträge im Jahr.</p>
<p>Das dritte: „Der Arbeitgeber zahlt die Hälfte, also ist mir der Satz egal.“ Der Arbeitgeber zahlt tatsächlich die Hälfte des Zusatzbeitrags, aber Ihre Hälfte geht vom Netto ab, jeden Monat, und sie wächst mit dem Lohn bis zur Beitragsbemessungsgrenze. Für Rentner gilt dasselbe mit der Rentenversicherung als zweitem Zahler, für Selbstständige gibt es keinen zweiten Zahler. Wer selbst zahlt, spürt jeden Zehntelpunkt doppelt.</p>
<p>Für Ihre Entscheidung ist der Durchschnitt deshalb nur ein Orientierungspunkt. Ob ein Wechsel lohnt, entscheidet der Abstand zwischen Ihrer Kasse und der günstigsten, die Sie in Ihrem Land wählen können; das rechnet der ${h.a('home', 'Beitragsrechner')} mit allen Kassen. Wann ein Wechsel frühestens wirkt, steht unter ${h.a('krankenkasse-wechseln', 'Krankenkasse wechseln')}.</p>`,
  },
  en: {
    slug: 'average-additional-contribution',
    nav: 'Average additional rate',
    card: `${EN.pz(w26.zb_durchschnitt, 1)} for 2026, ${EN.pz(w27.zb_durchschnitt, 1)} on paper for 2027: what the official rate is used for and why your fund differs.`,
    title: 'Average Additional Contribution 2027: Value and Purpose',
    description: `Average additional contribution in German health insurance 2026 and 2027: ${EN.pz(w26.zb_durchschnitt, 1)} per the Federal Gazette, how it is derived, what it applies to, what you pay.`,
    h1: 'The average additional contribution rate: what it is and is not',
    intro: `${EN.pz(w26.zb_durchschnitt, 1)} for 2026 and, per the estimate, for 2027 too. Only a few groups actually pay it; everyone else pays their own fund’s rate.`,
    resume: `The average additional contribution rate (durchschnittlicher Zusatzbeitragssatz) is ${EN.pz(w26.zb_durchschnitt, 1)} for 2026; the Federal Health Ministry announced it in the Federal Gazette on 10 November 2025, and the estimate of 14 October 2026 gives the same figure on paper for 2027. It comes from a simple division set out in section 242a of Book V of the Social Code: funds’ expected spending minus what the central health fund allocates to them, divided by all members’ contributory income. For 2027 that is ${EN.num(S.luecke_mrd, 1)} over ${EN.num(S.bpe_mrd, 1)} billion euros. It is not an average of what funds charge: today ${darueber} of ${st.n} open funds are above it, and the simple mean of all rates is ${EN.pz(st.mittel, 2)}. Only people on basic income support, workers in sheltered workshops and a few other groups pay it directly. It matters indirectly everywhere: for the employer subsidy to private insurance, for minijobs from 2027 and for midijobs.`,
    faqs: [
      { q: 'Do I pay the average additional rate or my fund’s rate?', a: `As an employee, pensioner, self-employed member or student you pay your own fund’s rate, as shown in the GKV-Spitzenverband list. The average of ${EN.pz(w26.zb_durchschnitt, 1)} is paid only by the groups in section 242(3) SGB V, such as people on basic income support or apprentices on very low pay, whose contributions someone else pays anyway.` },
      { q: 'Who sets the average additional rate?', a: 'The Federal Health Ministry, after reviewing the forecast of the estimating group made up of the ministry, the Federal Office for Social Security and the GKV-Spitzenverband. It must publish the figure in the Federal Gazette by 1 November (section 242a(2) SGB V). The value then applies for the whole following year, even if finances change.' },
      { q: 'Does the average rate matter if I am privately insured?', a: `Yes. Your employer’s subsidy to private health insurance is capped at half of what a statutory member at the contribution ceiling would pay at the general rate plus the average additional rate (section 257(2) SGB V). In 2026 that is at most ${EN.eur(pkvZuschuss(w26), 2)} a month, on the provisional 2027 values ${EN.eur(pkvZuschuss(w27), 2)}, and never more than half the actual premium.` },
      { q: 'Why is the real average higher than the official rate?', a: `Because the official rate only covers one year’s expected gap. Many funds also had to rebuild legally required reserves or make up deficits from the previous year, so they charge more. The simple mean of all open funds today is ${EN.pz(st.mittel, 2)}, against ${EN.pz(w26.zb_durchschnitt, 1)} officially.` },
      { q: 'Does the average change if a big fund raises its rate?', a: 'No. It is set once a year and stays put until the year ends, whatever individual funds decide. If a fund raises its rate, only its own members are affected, and they gain a special right to leave. Nothing changes for the private insurance subsidy or the minijob flat rate.' },
    ],
    body: (h) => `
<h2>A division with very large numbers</h2>
<p>Section 242a SGB V gives the formula: expected spending by all funds, minus what the central health fund (Gesundheitsfonds) has available for allocations, divided by members’ expected contributory income, times one hundred. The central fund collects the general rate of ${h.pz(w26.kv_allgemein, 1)} from everyone plus a federal grant; whatever funds spend beyond that, they must raise through additional rates. For 2027 the estimating group supplied the ingredients on ${h.date(S.datum)} (${h.src('basTableau2027', 'estimate table')}):</p>
${h.table(['', '2027'], [
  ['Spending by health funds', `€${h.num(S.ausgaben_mrd, 1)} bn`],
  ['minus allocations from the central fund', `€${h.num(S.zuweisungen_mrd, 1)} bn`],
  ['= gap', `€${h.num(S.luecke_mrd, 1)} bn`],
  ['÷ contributory income', `€${h.num(S.bpe_mrd, 1)} bn`],
  ['= rate on paper', h.pz((S.luecke_mrd / S.bpe_mrd) * 100, 2)],
], undefined, ['l', 'r'])}
<p>The ministry rounds and publishes the result. For 2026 it was ${h.pz(w26.zb_durchschnitt, 1)} (${h.src('banzZb2026', 'Federal Gazette, 10 November 2025')}); the 2027 notice is due by 1 November.</p>
<h2>Who pays exactly this rate</h2>
<p>For a small group the average really is the rate on the bill. Section 242(3) SGB V lists them: people on basic income support (Grundsicherungsgeld), people in vocational rehabilitation, workers in sheltered workshops whose pay does not exceed the minimum amount, members receiving injury benefit or similar payments, and employees whose contribution the employer pays alone, meaning apprentices on very low pay and volunteers in the youth or federal volunteer service. For them the choice of fund makes no difference on price, because every fund must apply the same rate.</p>
<h2>Where else it turns up</h2>
${h.table(['Use', '2026', '2027 (provisional)'], [
  ['Maximum employer subsidy to private insurance a month (section 257(2))', h.eur(pkvZuschuss(w26), 2), h.eur(pkvZuschuss(w27), 2)],
  ['Minijob flat rate for health insurance, percent', h.pz(w26.minijob_ag_kv, 1), h.pz(w27.minijob_ag_kv, 1)],
  ['Flat rate on the highest minijob pay', h.eur(mj26, 2), h.eur(mj27, 2)],
  ['Factor F in the transition zone (midijob)', h.num(w26.faktor_f, 4), h.num(w27.faktor_f, 4)],
], 'Values from this site’s parameters', ['l', 'r', 'r'])}
<p>Three uses matter more to many people than the rate itself. Privately insured employees get at most half of what a statutory member at the contribution ceiling would pay at the average rate (${h.src('sgb5_257', 'section 257 SGB V')}). For minijobs the employer pays a flat ${h.pz(w26.minijob_ag_kv, 1)} in 2026; from 2027 the new section 249b SGB V ties it to the general rate plus the average, ${h.pz(w27.minijob_ag_kv, 1)}. And in the transition zone between a minijob and ${h.eur(w26.uebergang_oben)} the average feeds into the total social insurance rate of ${h.pz(gesamtSv, 1)}, from which factor F is derived (${h.src('sgb4_20', 'section 20 SGB IV')}); more in the guide to ${h.a('midijob-krankenversicherung', 'midijobs')}.</p>
<h2>How far real rates stray</h2>
<p>Of ${st.n} open funds, ${nahe} sit within a quarter point of the average and ${darueber} above it. The range runs from ${h.pk(st.min)} to ${h.pk(st.max)}. In euros, on ${h.eur(3800)} gross: at the cheapest fund you pay ${h.eur(Math.abs(proJahr(st.min)))} a year less than at the average rate, at the most expensive ${h.eur(proJahr(st.max))} more. The mean of all rates, ${h.pz(st.mittel, 2)}, is unweighted; every small company fund counts as much as the largest substitute fund. The GKV-Spitzenverband list does not publish a membership-weighted average.</p>
<h2>Three misunderstandings that come back every autumn</h2>
<p>First: “The additional rate will not rise in 2027.” This usually means the official average, which says little about your fund. Each fund does its own sums; the average can stay flat while your fund raises its rate to rebuild reserves, or lowers it because it has a surplus. What counts is your fund’s letter in December and the entry in the list from 1 January.</p>
<p>Second: “My fund is below average, so I am fine.” On price, perhaps, but not necessarily fine enough. The real question is how many funds in your state are cheaper still, and by how many euros. On a middle income, a fund just below average and the cheapest one are often still three figures a year apart.</p>
<p>Third: “My employer pays half, so the rate does not matter to me.” Your employer does pay half the additional rate, but your half comes off your net pay every month and grows with your salary up to the contribution ceiling. Pensioners are in the same position with the pension insurance as the other payer; the self-employed have no other payer at all and feel every tenth of a point twice over.</p>
<p>For your own decision the average is therefore only a landmark. Whether switching pays depends on the gap between your fund and the cheapest one open in your state; the ${h.a('home', 'contribution calculator')} works it out for every fund. When a switch takes effect at the earliest is explained under ${h.a('krankenkasse-wechseln', 'switching fund')}.</p>`,
  },
});
