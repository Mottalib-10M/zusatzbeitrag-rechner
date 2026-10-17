import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { offen, statistik, KASSEN, STAND } from '../../lib/engine/kassen';
import { angestellt } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** HEK: bundesweite Ersatzkasse; Satz, Euro für jedes Gehalt, wo sie geöffnet ist, wie man wechselt (Suche „hek krankenkasse“ und „hek zusatzbeitrag“). */
const ID = 'hek-hanseatische-krankenkasse';
const p = profil(ID);
const w = J(2026), w27 = J(2027);
const me = kostenZeile(p.k);
const st = statistik(offen());
const vsMittelDe = p.zb < st.mittel ? 'unter' : p.zb > st.mittel ? 'über' : 'genau auf';
const vsMittelEn = p.zb < st.mittel ? 'below' : p.zb > st.mittel ? 'above' : 'exactly on';
const naheDurchschnitt = Math.abs(p.abstandDurchschnitt) <= 0.1;
const ueberall = p.laender.length === 16;
// Nachbarn im Preis: zwei darunter, zwei darüber.
const alle = offen(); const i = alle.findIndex((k) => k.id === ID);
const umfeld = alle.slice(Math.max(0, i - 2), i + 3).map(kostenZeile);
const j = (x: { lohn: number }) => Math.round((x.lohn - me.lohn) * 12);
// Ersatzkassen im Vergleich: die bundesweite Konkurrenz der HEK.
const eks = KASSEN.filter((k) => k.kassenart === 'EK' && k.zb !== null).sort((a, b) => a.zb! - b.zb!);
const ekRang = eks.findIndex((k) => k.id === ID) + 1;
// Monatsbeitrag für verschiedene Bruttolöhne, Beschäftigte mit einem Kind.
const LOEHNE = [2000, 3000, BEISPIEL.lohn, 4500, 5500, w.bbgKv];
const lohnZeilen = LOEHNE.map((b) => { const r = angestellt({ brutto: b, zb: p.zb, jahr: 2026, eltern: 'k1' }); return { b, selbst: r.selbst, zb: r.zbSelbst, ag: r.kv.andere + r.pv.andere }; });
const fuenfTsd = lohnZeilen.find((z) => z.b === 5500)!;

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 24,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID },
  related: ['techniker-krankenkasse', 'handelskrankenkasse-hkk', 'durchschnittlicher-zusatzbeitrag', 'krankenkasse-wechseln', 'zusatzbeitrag-2027'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_242a', 'banzZb2026', 'sgb5_173', 'sgb5_175'],
  de: {
    slug: 'hek-zusatzbeitrag',
    nav: 'HEK',
    card: `${DE.pk(p.zb)} Zusatzbeitrag, ${naheDurchschnitt ? 'fast genau der amtliche Durchschnitt' : `${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte vom amtlichen Durchschnitt`}; in allen Ländern wählbar.`,
    title: 'HEK Krankenkasse 2027: Zusatzbeitrag, Kosten, Wechsel',
    description: `HEK Krankenkasse: Zusatzbeitrag 2026 ${DE.pk(p.zb)}, Ihr Monatsbeitrag in Euro für jedes Gehalt, wo die HEK wählbar ist, wie Sie wechseln und was für 2027 ansteht.`,
    h1: 'HEK Krankenkasse: Zusatzbeitrag, Beitrag und Wechsel',
    intro: `Die HEK verlangt ${DE.pk(p.zb)} Zusatzbeitrag; bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung.`,
    resume: `Die HEK, Hanseatische Krankenkasse, ist eine Ersatzkasse mit Sitz in Hamburg und laut Liste des GKV-Spitzenverbands ${ueberall ? 'in allen 16 Ländern' : `in ${p.laender.length} Ländern`} wählbar. Ihr Zusatzbeitrag beträgt ${DE.pk(p.zb)}. Das liegt ${naheDurchschnitt ? 'nur knapp neben' : `${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte ${p.unterDurchschnitt ? 'unter' : 'über'}`} dem durchschnittlichen Zusatzbeitragssatz von ${DE.pz(w.zb_durchschnitt)}, den das Bundesgesundheitsministerium für 2026 im Bundesanzeiger bekannt gemacht hat. Dieser amtliche Wert ist eine Prognose der nötigen Einnahmen, kein Mittel der tatsächlich erhobenen Sätze; das einfache Mittel aller ${st.n} frei wählbaren Kassen liegt bei ${DE.pz(st.mittel)}, und die HEK steht ${vsMittelDe} diesem Wert. In der Rangliste aller frei wählbaren Kassen belegt sie Platz ${p.rangBund}, unter den ${eks.length} Ersatzkassen Platz ${ekRang}. Bei ${DE.eur(BEISPIEL.lohn)} brutto mit einem Kind zahlen Sie ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung, bei der günstigsten Kasse, ${p.billigste.kurz}, ${DE.eur(p.proJahrVsBilligste)} im Jahr weniger. Der Rechner oben ist auf die HEK eingestellt und rechnet mit Ihrem eigenen Gehalt.`,
    faqs: [
      { q: 'Wie hoch ist der Zusatzbeitrag der HEK?', a: `${DE.pk(p.zb)} im Jahr 2026, so steht es in der tagesaktuellen Liste des GKV-Spitzenverbands. Beschäftigte tragen davon die Hälfte, ${DE.num(p.zb / 2, 3)} Prozent ihres Bruttolohns bis zur Bemessungsgrenze; die andere Hälfte zahlt der Arbeitgeber. Dazu kommt der für alle Kassen gleiche allgemeine Satz von ${DE.pz(w.kv_allgemein)}.` },
      { q: `Wie viel zahle ich bei der HEK mit ${DE.eur(BEISPIEL.lohnNiedrig)} brutto?`, a: `Mit einem Kind ${DE.eur(p.lohnNiedrig)} im Monat für Kranken- und Pflegeversicherung, kinderlos ab 23 etwas mehr wegen des Pflegezuschlags von ${DE.pz(w.pv_kinderlos)}. An der Bemessungsgrenze von ${DE.eur(w.bbgKv, 2)} sind es ${DE.eur(p.lohnBbg)}. Der Arbeitgeber zahlt jeweils ungefähr den gleichen Anteil dazu.` },
      { q: 'In welchen Bundesländern ist die HEK geöffnet?', a: ueberall ? 'In allen 16 Ländern. Als Ersatzkasse ist sie an keine Region gebunden: Wer in Bayern wohnt, kann sie genauso wählen wie jemand in Hamburg, und ein Umzug innerhalb Deutschlands ändert nichts an der Mitgliedschaft. Regionale Kassen wie die AOK stehen dagegen nur Menschen offen, die in ihrem Gebiet wohnen oder arbeiten.' : `In ${p.laender.length} Ländern, laut amtlicher Liste. Maßgeblich ist, ob Sie in einem davon wohnen oder arbeiten.` },
      { q: 'Wie wechsle ich zur HEK?', a: 'Sie stellen bei der HEK einen Mitgliedsantrag; eine Kündigung bei der bisherigen Kasse ist nicht nötig, die Kassen melden den Wechsel untereinander. Voraussetzung sind zwölf Monate bei der bisherigen Kasse, außer diese hat ihren Zusatzbeitrag erhöht. Die Mitgliedschaft beginnt mit dem übernächsten Monatsersten. Beschäftigte nennen danach dem Arbeitgeber die neue Kasse.' },
      { q: 'Liegt die HEK über oder unter dem Durchschnitt?', a: `Gemessen am amtlichen durchschnittlichen Zusatzbeitrag von ${DE.pz(w.zb_durchschnitt)} ${naheDurchschnitt ? 'liegt sie fast genau darauf' : `${p.unterDurchschnitt ? 'darunter' : 'darüber'}, um ${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte`}. Gemessen am tatsächlichen Mittel der frei wählbaren Kassen von ${DE.pz(st.mittel)} liegt sie ${vsMittelDe} dem Mittel. Beides sind Vergleichswerte; zahlen müssen Sie den Satz Ihrer eigenen Kasse.` },
      { q: 'Was ist für 2027 bei der HEK zu erwarten?', a: `Den Satz für 2027 beschließt der Verwaltungsrat der HEK selbst, meist im Dezember. Der Schätzerkreis hat für 2027 rechnerisch einen Durchschnitt von ${DE.pz(w27.zb_durchschnitt)} ermittelt, die endgültige Festlegung durch das Ministerium steht aus. Steigt der HEK-Satz, können Mitglieder mit dem Sonderkündigungsrecht zu einer anderen Kasse wechseln.` },
    ],
    body: (h) => `
<h2>Die HEK in Kürze</h2>
${h.table(['', 'HEK'], [
  ['Kassenart', 'Ersatzkasse, Sitz Hamburg'],
  ['Zusatzbeitrag 2026', h.pk(p.zb)],
  ['Gesamtsatz Krankenversicherung', h.pz(w.kv_allgemein + p.zb, 2)],
  ['Geöffnet', ueberall ? 'in allen 16 Ländern' : `in ${p.laender.length} Ländern`],
  ['Platz unter allen frei wählbaren Kassen', `${p.rangBund} von ${p.nBund}`],
  ['Platz unter den Ersatzkassen', `${ekRang} von ${eks.length}`],
], `Liste des GKV-Spitzenverbands, Stand ${h.date(STAND)}`, ['l', 'r'])}
<p>Der Zusatzbeitrag ist der einzige Teil des Krankenkassenbeitrags, der sich zwischen den Kassen unterscheidet. Allgemeiner Satz, Beitragsbemessungsgrenze und Pflegebeitrag sind bei der HEK dieselben wie bei der TK, der BARMER oder einer AOK. Was eine Mitgliedschaft bei der HEK kostet, hängt deshalb nur von ihrem Satz und Ihrem Einkommen ab; Leistungen nach dem SGB V sind bei allen Kassen gleich, Unterschiede gibt es bei Satzungsleistungen und Bonusprogrammen.</p>
<h2>Was die HEK Sie bei Ihrem Gehalt kostet</h2>
${h.table(['Bruttolohn im Monat', 'Ihr Anteil KV + PV', 'davon Zusatzbeitrag', 'Arbeitgeber zahlt'], lohnZeilen.map((z) => [h.eur(z.b, z.b === w.bbgKv ? 2 : 0), h.eur(z.selbst), h.eur(z.zb), h.eur(z.ag)]), '2026, Beschäftigte mit einem Kind, außerhalb Sachsens', ['r', 'r', 'r', 'r'])}
<p>Ab der Bemessungsgrenze von ${h.eur(w.bbgKv, 2)} steigt der Beitrag nicht weiter, auch wenn das Gehalt höher ist. Wer ${h.eur(5500)} verdient, zahlt bei der HEK ${h.eur(fuenfTsd.selbst)} im Monat, davon ${h.eur(fuenfTsd.zb)} Zusatzbeitrag. Für Kinderlose ab 23 kommt der Zuschlag zur Pflegeversicherung hinzu, in Sachsen ein höherer Pflegeanteil. Für Rente, Selbstständigkeit und Studium:</p>
${h.table(['Lage', 'Grundlage', 'Ihr Anteil im Monat'], [
  ['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studium', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, ein Kind; selbstständig ohne Krankengeld, Studium unter 23', ['l', 'r', 'r'])}
<h2>Wo die HEK wählbar ist</h2>
<p>Als Ersatzkasse ist die HEK nicht an ein Land oder einen Betrieb gebunden. ${ueberall ? 'Die amtliche Liste führt sie in allen 16 Ländern als geöffnet' : `Die amtliche Liste führt sie in ${p.laender.length} Ländern als geöffnet`}: Wer in Kiel wohnt, kann sie genauso wählen wie jemand in Passau, und die Rangliste im Rechner zeigt sie in jedem Land. Anders als bei einer AOK oder einer regionalen Betriebskrankenkasse spielt der Wohnort keine Rolle, ein Umzug innerhalb Deutschlands ändert nichts. Für die Entscheidung zählt neben dem Satz, ob Sie Geschäftsstellen vor Ort brauchen oder alles online erledigen; das lässt sich nicht in Euro umrechnen und bleibt Ihre eigene Abwägung. Prüfen Sie vor einem Wechsel auch laufende Wahltarife, denn ein Selbstbehalt bindet Sie länger als die üblichen zwölf Monate.</p>
<h2>So wechseln Sie zur HEK</h2>
<p>Erstens: Prüfen Sie, ob Sie wechseln dürfen. Das ist der Fall, wenn Sie zwölf Monate bei Ihrer bisherigen Kasse sind oder diese ihren Zusatzbeitrag erhöht hat. Zweitens: Stellen Sie den Mitgliedsantrag bei der HEK; die bisherige Kasse müssen Sie nicht selbst kündigen, die HEK meldet den Wechsel. Drittens: Die Mitgliedschaft beginnt mit dem übernächsten Monatsersten. Viertens: Beschäftigte nennen dem Arbeitgeber die neue Kasse; Rentner und familienversicherte Angehörige müssen nichts weiter tun. Den genauen Termin rechnet der ${h.a('krankenkasse-wechseln', 'Fristenrechner')}. Wer die HEK verlassen will, geht umgekehrt vor, und eine spätere Rückkehr ist nach weiteren zwölf Monaten bei der neuen Kasse ebenso möglich.</p>
<h2>2027: was eine Erhöhung kosten würde</h2>
<p>Die HEK beschließt ihren Satz für 2027 im Dezember; in der amtlichen Liste erscheint er erst am Tag seiner Gültigkeit. Was der Ausblick auf das nächste Jahr hergibt, steht unter ${h.a('zusatzbeitrag-2027', 'Zusatzbeitrag 2027')}. Erhöht die HEK zum Januar, gilt für ihre Mitglieder das ${h.a('sonderkuendigungsrecht', 'Sonderkündigungsrecht')}, auch während der zwölf Monate Bindung. Wie viel eine Erhöhung um einige Zehntelpunkte Sie im Jahr kosten würde, rechnet dieser kleine Rechner:</p>
<!--mini:erhoehung-->
<h2>Zwei Durchschnitte, die man nicht verwechseln sollte</h2>
<p>Wenn von „dem Durchschnitt“ die Rede ist, sind zwei verschiedene Zahlen gemeint. Der amtliche durchschnittliche Zusatzbeitragssatz nach § 242a SGB V wird jedes Jahr im Herbst aus der Schätzung der Einnahmen und Ausgaben der gesetzlichen Krankenversicherung abgeleitet und im Bundesanzeiger bekannt gemacht. Das tatsächliche Mittel ergibt sich dagegen aus den Sätzen, die die Kassen wirklich erheben, und liegt derzeit bei ${h.pz(st.mittel)}, der Median bei ${h.pz(st.median)}. Die HEK steht mit ${h.pk(p.zb)} zwischen diesen Werten und ihren Nachbarn in der Rangliste:</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber HEK im Jahr'], umfeld.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `Kassen um die HEK herum, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind`, ['l', 'r', 'r', 'r'])}
<p>Mehr zur Rolle des amtlichen Wertes und zu seiner Höhe in den letzten Jahren steht unter ${h.a('durchschnittlicher-zusatzbeitrag', 'durchschnittlicher Zusatzbeitrag')}.</p>`,
  },
  en: {
    slug: 'hek-additional-contribution',
    nav: 'HEK',
    card: `${EN.pk(p.zb)} additional rate, ${naheDurchschnitt ? 'almost exactly the official average' : `${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points from the official average`}; open in every state.`,
    title: 'HEK Health Insurance 2027: Additional Rate, Cost, Switching',
    description: `HEK health insurance: additional rate 2026 ${EN.pk(p.zb)}, your monthly cost in euros for any salary, where HEK is open, how to switch to it and what 2027 may bring.`,
    h1: 'HEK health insurance: additional rate, cost and switching',
    intro: `HEK charges an additional rate of ${EN.pk(p.zb)}; on ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohn)} a month for health and care insurance.`,
    resume: `HEK, Hanseatische Krankenkasse, is a substitute fund (Ersatzkasse) based in Hamburg that the GKV-Spitzenverband list shows as open ${ueberall ? 'in all 16 states' : `in ${p.laender.length} states`}. Its additional contribution (Zusatzbeitrag) is ${EN.pk(p.zb)}. That is ${naheDurchschnitt ? 'only a hair away from' : `${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points ${p.unterDurchschnitt ? 'below' : 'above'}`} the average additional rate of ${EN.pz(w.zb_durchschnitt)} that the Federal Health Ministry published for 2026 in the Federal Gazette. That official figure is a forecast of the revenue needed, not an average of the rates funds actually charge; the simple mean of all ${st.n} open funds is ${EN.pz(st.mittel)}, and HEK sits ${vsMittelEn} it. In the ranking of all funds open to everyone it is number ${p.rangBund}, and number ${ekRang} of the ${eks.length} substitute funds. On ${EN.eur(BEISPIEL.lohn)} gross with one child you pay ${EN.eur(p.lohn)} a month for health and care insurance, and at the cheapest fund, ${p.billigste.kurz}, ${EN.eur(p.proJahrVsBilligste)} a year less. The calculator above is set to HEK and works with your own salary.`,
    faqs: [
      { q: 'What is the HEK additional rate?', a: `${EN.pk(p.zb)} in 2026, as shown in the GKV-Spitzenverband’s daily list. Employees pay half of it, ${EN.num(p.zb / 2, 3)} percent of gross pay up to the ceiling; the employer pays the other half. On top comes the general rate of ${EN.pz(w.kv_allgemein)}, the same at every fund.` },
      { q: `How much do I pay at HEK on ${EN.eur(BEISPIEL.lohnNiedrig)} gross?`, a: `With one child, ${EN.eur(p.lohnNiedrig)} a month for health and care insurance; a little more if you are childless and 23 or over, because of the ${EN.pz(w.pv_kinderlos)} care surcharge. At the ceiling of ${EN.eur(w.bbgKv, 2)} it is ${EN.eur(p.lohnBbg)}. Your employer pays roughly the same share on top each time.` },
      { q: 'In which states is HEK open?', a: ueberall ? 'In all 16. As a substitute fund it is not tied to a region: someone in Bavaria can join just as well as someone in Hamburg, and moving within Germany leaves membership untouched. Regional funds such as an AOK, by contrast, accept only people who live or work in their area.' : `In ${p.laender.length} states, according to the official list. What counts is whether you live or work in one of them.` },
      { q: 'How do I switch to HEK?', a: 'Apply for membership at HEK; you do not need to cancel at your current fund, as the funds notify each other. You need twelve months at your current fund, unless it has raised its additional rate. Membership starts on the first day of the month after next. Employees then tell their employer the new fund.' },
      { q: 'Is HEK above or below the average?', a: `Against the official average additional rate of ${EN.pz(w.zb_durchschnitt)} ${naheDurchschnitt ? 'it sits almost exactly on it' : `it is ${p.unterDurchschnitt ? 'below' : 'above'}, by ${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points`}. Against the actual mean of the open funds, ${EN.pz(st.mittel)}, it sits ${vsMittelEn} the mean. Both are benchmarks only; what you pay is your own fund’s rate.` },
      { q: 'What can HEK members expect for 2027?', a: `HEK’s board sets its 2027 rate itself, usually in December. The official estimating group arrived at an average of ${EN.pz(w27.zb_durchschnitt)} for 2027; the ministry’s final decision is still pending. If HEK’s rate rises, members can switch under the special termination right.` },
    ],
    body: (h) => `
<h2>HEK at a glance</h2>
${h.table(['', 'HEK'], [
  ['Type of fund', 'substitute fund, based in Hamburg'],
  ['Additional rate 2026', h.pk(p.zb)],
  ['Total health insurance rate', h.pz(w.kv_allgemein + p.zb, 2)],
  ['Open in', ueberall ? 'all 16 states' : `${p.laender.length} states`],
  ['Rank among all open funds', `${p.rangBund} of ${p.nBund}`],
  ['Rank among substitute funds', `${ekRang} of ${eks.length}`],
], `GKV-Spitzenverband list, as of ${h.date(STAND)}`, ['l', 'r'])}
<p>The additional rate is the only part of the health contribution that differs between funds. The general rate, the contribution ceiling and the care contribution are the same at HEK as at TK, BARMER or an AOK. What HEK membership costs therefore depends only on its rate and your income; statutory benefits under SGB V are identical at every fund, while extra benefits in the statutes and bonus schemes differ.</p>
<h2>What HEK costs on your salary</h2>
${h.table(['Gross pay a month', 'Your share, health + care', 'of which additional rate', 'Employer pays'], lohnZeilen.map((z) => [h.eur(z.b, z.b === w.bbgKv ? 2 : 0), h.eur(z.selbst), h.eur(z.zb), h.eur(z.ag)]), '2026, employees with one child, outside Saxony', ['r', 'r', 'r', 'r'])}
<p>Above the ceiling of ${h.eur(w.bbgKv, 2)} the contribution stops rising, however high the salary. On ${h.eur(5500)} you pay ${h.eur(fuenfTsd.selbst)} a month at HEK, ${h.eur(fuenfTsd.zb)} of it additional rate. Childless people aged 23 and over add the care surcharge, and in Saxony the employee care share is higher. For pensions, self-employment and students:</p>
${h.table(['Situation', 'Base', 'Your share a month'], [
  ['Pension', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, one child; self-employed without sick pay, student under 23', ['l', 'r', 'r'])}
<h2>Where you can join HEK</h2>
<p>As a substitute fund, HEK is not tied to a state or an employer. ${ueberall ? 'The official list shows it as open in all 16 states' : `The official list shows it as open in ${p.laender.length} states`}: someone living in Kiel can choose it just as well as someone in Passau, and the calculator ranking lists it in every state. Unlike an AOK or a regional company fund, your address does not matter, and moving within Germany changes nothing. Besides the rate, what matters is whether you need local branch offices or handle everything online; that cannot be priced in euros, so it stays your own judgement. Before switching, also check any optional tariff, since a deductible ties you longer than the usual twelve months.</p>
<h2>How to switch to HEK</h2>
<p>First, check that you may switch: you can if you have been with your current fund for twelve months or it has raised its additional rate. Second, apply for membership at HEK; you do not cancel at your old fund yourself, HEK reports the switch. Third, membership starts on the first day of the month after next. Fourth, employees tell their employer the new fund; pensioners and family members covered free of charge need do nothing more. The ${h.a('krankenkasse-wechseln', 'deadline calculator')} works out the exact date. Leaving HEK works the same way in reverse, and coming back later is possible after another twelve months at the new fund.</p>
<h2>2027: what a rate rise would cost</h2>
<p>HEK sets its 2027 rate in December; the official list shows it only from the day it applies. What the outlook for next year holds is under ${h.a('zusatzbeitrag-2027', 'additional rate 2027')}. If HEK raises its rate in January, its members have the ${h.a('sonderkuendigungsrecht', 'special termination right')}, even within the twelve-month tie-in. This small calculator shows what a rise of a few tenths of a point would cost you a year:</p>
<!--mini:erhoehung-->
<h2>Two averages that are easily confused</h2>
<p>“The average” can mean two different numbers. The official average additional rate under section 242a SGB V is derived each autumn from the estimate of statutory health insurance income and spending and published in the Federal Gazette. The actual mean, by contrast, comes from the rates funds really charge and currently stands at ${h.pz(st.mittel)}, with the median at ${h.pz(st.median)}. At ${h.pk(p.zb)}, HEK sits between these values and its neighbours in the ranking:</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'vs HEK a year'], umfeld.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `Funds around HEK, ${h.eur(BEISPIEL.lohn)} gross, one child`, ['l', 'r', 'r', 'r'])}
<p>More on the role of the official figure and its level in recent years is under ${h.a('durchschnittlicher-zusatzbeitrag', 'average additional rate')}.</p>`,
  },
});
