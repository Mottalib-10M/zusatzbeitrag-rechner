import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { offen, statistik } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** HEK: bundesweite Ersatzkasse; ihr Satz im Verhältnis zum amtlichen Durchschnitt und zum tatsächlichen Mittel der Liste. */
const ID = 'hek-hanseatische-krankenkasse';
const p = profil(ID);
const w = J(2026), w27 = J(2027);
const me = kostenZeile(p.k);
const st = statistik(offen());
const vsMittelDe = p.zb < st.mittel ? 'unter' : p.zb > st.mittel ? 'über' : 'genau auf';
const vsMittelEn = p.zb < st.mittel ? 'below' : p.zb > st.mittel ? 'above' : 'exactly on';
const naheDurchschnitt = Math.abs(p.abstandDurchschnitt) <= 0.1;
// Nachbarn im Preis: zwei darunter, zwei darüber.
const alle = offen(); const i = alle.findIndex((k) => k.id === ID);
const umfeld = alle.slice(Math.max(0, i - 2), i + 3).map(kostenZeile);
const j = (x: { lohn: number }) => Math.round((x.lohn - me.lohn) * 12);

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 24,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID },
  related: ['durchschnittlicher-zusatzbeitrag', 'handelskrankenkasse-hkk', 'techniker-krankenkasse', 'zusatzbeitrag-2027'],
  sources: ['gkvListe', 'sgb5_242a', 'banzZb2026', 'sgb5_242'],
  de: {
    slug: 'hek-zusatzbeitrag',
    nav: 'HEK',
    card: `${DE.pk(p.zb)} Zusatzbeitrag, ${naheDurchschnitt ? 'fast genau der amtliche Durchschnitt' : `${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte vom amtlichen Durchschnitt`}; bundesweit wählbar.`,
    title: 'HEK Zusatzbeitrag 2027: Beitrag und Durchschnitt im Blick',
    description: `HEK Hanseatische Krankenkasse, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Monatsbeitrag in Euro, Lage zum amtlichen Durchschnitt und zum Mittel aller Kassen, Ausblick 2027.`,
    h1: 'HEK: Zusatzbeitrag im Vergleich zum Durchschnitt',
    intro: `Die HEK verlangt ${DE.pk(p.zb)}; der amtliche durchschnittliche Zusatzbeitrag liegt bei ${DE.pz(w.zb_durchschnitt)}, das Mittel aller frei wählbaren Kassen bei ${DE.pz(st.mittel)}.`,
    resume: `Die HEK, Hanseatische Krankenkasse, ist eine bundesweit geöffnete Ersatzkasse. Die Liste des GKV-Spitzenverbands nennt für sie einen Zusatzbeitrag von ${DE.pk(p.zb)}. Das liegt ${naheDurchschnitt ? 'nur knapp neben' : `${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte ${p.unterDurchschnitt ? 'unter' : 'über'}`} dem durchschnittlichen Zusatzbeitragssatz von ${DE.pz(w.zb_durchschnitt)}, den das Bundesgesundheitsministerium für 2026 im Bundesanzeiger bekannt gemacht hat. Dieser amtliche Wert ist allerdings eine Prognose der nötigen Einnahmen, kein Mittel der tatsächlich erhobenen Sätze; das einfache Mittel aller ${st.n} frei wählbaren Kassen liegt bei ${DE.pz(st.mittel)}, und die HEK steht ${vsMittelDe} diesem Wert. In der Rangliste aller frei wählbaren Kassen belegt sie Platz ${p.rangBund}. Bei ${DE.eur(BEISPIEL.lohn)} brutto mit einem Kind zahlen Sie ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung, bei der günstigsten Kasse, ${p.billigste.kurz}, ${DE.eur(p.proJahrVsBilligste)} im Jahr weniger. Wählbar ist die HEK in jedem Bundesland.`,
    faqs: [
      { q: 'Liegt die HEK über oder unter dem Durchschnitt?', a: `Gemessen am amtlichen durchschnittlichen Zusatzbeitrag von ${DE.pz(w.zb_durchschnitt)} ${naheDurchschnitt ? 'liegt sie fast genau darauf' : `${p.unterDurchschnitt ? 'darunter' : 'darüber'}, um ${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte`}. Gemessen am tatsächlichen Mittel der frei wählbaren Kassen von ${DE.pz(st.mittel)} liegt sie ${vsMittelDe} dem Mittel. Beides sind Vergleichswerte; zahlen müssen Sie den Satz Ihrer eigenen Kasse.` },
      { q: 'Wofür wird der amtliche Durchschnittssatz überhaupt gebraucht?', a: `Er gilt für Versicherte, deren Zusatzbeitrag nicht nach dem Satz der eigenen Kasse berechnet wird, etwa Bezieher von Grundsicherung und weitere Gruppen nach § 242 Abs. 3 SGB V, und er fließt in den Faktor für den Übergangsbereich ein. Für ein HEK-Mitglied mit Gehalt ist er nur ein Maßstab, kein eigener Beitragssatz.` },
      { q: `Wie viel zahle ich bei der HEK mit ${DE.eur(BEISPIEL.lohnNiedrig)} brutto?`, a: `Mit einem Kind ${DE.eur(p.lohnNiedrig)} im Monat für Kranken- und Pflegeversicherung, kinderlos ab 23 etwas mehr wegen des Pflegezuschlags von ${DE.pz(w.pv_kinderlos)}. An der Bemessungsgrenze von ${DE.eur(w.bbgKv, 2)} sind es ${DE.eur(p.lohnBbg)}. Der Arbeitgeber zahlt jeweils den gleichen Anteil dazu.` },
      { q: 'Was ist für 2027 bei der HEK zu erwarten?', a: `Den Satz für 2027 beschließt die HEK selbst, meist im Dezember. Der Schätzerkreis hat für 2027 rechnerisch einen Durchschnitt von ${DE.pz(w27.zb_durchschnitt)} ermittelt, die endgültige Festlegung durch das Ministerium steht aus. Steigt der HEK-Satz, können Mitglieder mit Sonderkündigungsrecht zu einer anderen Kasse wechseln.` },
    ],
    body: (h) => `
<h2>Zwei Durchschnitte, die man nicht verwechseln sollte</h2>
<p>Wenn von „dem Durchschnitt“ die Rede ist, sind zwei verschiedene Zahlen gemeint. Der amtliche durchschnittliche Zusatzbeitragssatz nach § 242a SGB V wird jedes Jahr im Herbst aus der Schätzung der Einnahmen und Ausgaben der gesetzlichen Krankenversicherung abgeleitet und im Bundesanzeiger bekannt gemacht. Das tatsächliche Mittel ergibt sich dagegen aus den Sätzen, die die Kassen wirklich erheben, und liegt derzeit bei ${h.pz(st.mittel)}, der Median bei ${h.pz(st.median)}. Die HEK steht mit ${h.pk(p.zb)} zwischen diesen Werten und ihren Nachbarn in der Rangliste:</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber HEK im Jahr'], umfeld.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `Kassen um die HEK herum, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind`, ['l', 'r', 'r', 'r'])}
<h2>Der HEK-Beitrag in Euro</h2>
${h.table(['Lage', 'Grundlage', 'Ihr Anteil im Monat'], [
  ['Angestellt', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Angestellt', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Angestellt, Höchstbetrag', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studium', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, ein Kind; selbstständig ohne Krankengeld, Studium unter 23', ['l', 'r', 'r'])}
<p>Mehr zur Rolle des amtlichen Wertes und zu seiner Höhe in den letzten Jahren steht unter ${h.a('durchschnittlicher-zusatzbeitrag', 'durchschnittlicher Zusatzbeitrag')}; was für 2027 bekannt ist, unter ${h.a('zusatzbeitrag-2027', 'Zusatzbeitrag 2027')}.</p>
<h2>Warum die HEK für jeden wählbar ist</h2>
<p>Als Ersatzkasse ist die HEK nicht an ein Land oder einen Betrieb gebunden. Wer in Kiel wohnt, kann sie genauso wählen wie jemand in Passau; die Rangliste im Rechner zeigt sie deshalb in allen 16 Ländern. Für die Entscheidung zählt neben dem Satz, ob Sie Geschäftsstellen vor Ort brauchen oder alles online erledigen; beides lässt sich nicht in Euro umrechnen und bleibt Ihre eigene Abwägung. Prüfen Sie vor einem Wechsel auch laufende Wahltarife, denn ein Selbstbehalt bindet Sie länger als die üblichen zwölf Monate.</p>
<h2>Bleiben, wechseln, zurückkommen</h2>
<p>Die HEK ist in allen Ländern geöffnet; wer zu ihr wechseln will, stellt dort den Antrag, und die bisherige Kasse wird benachrichtigt. Wer sie verlassen will, geht umgekehrt vor. In beiden Fällen gilt die Frist bis zum Ende des übernächsten Monats, nach zwölf Monaten Mitgliedschaft oder sofort nach einer Erhöhung. Eine spätere Rückkehr zur HEK ist nach weiteren zwölf Monaten bei der neuen Kasse ebenso möglich (${h.a('krankenkasse-wechseln', 'Fristen rechnen')}).</p>`,
  },
  en: {
    slug: 'hek-additional-contribution',
    nav: 'HEK',
    card: `${EN.pk(p.zb)} additional rate, ${naheDurchschnitt ? 'almost exactly the official average' : `${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points from the official average`}; open nationwide.`,
    title: 'HEK Additional Contribution 2027: Cost and the Average',
    description: `HEK additional rate in 2026: ${EN.pk(p.zb)}. Monthly cost in euros, its position against the official average and against the mean of all funds, plus the 2027 outlook.`,
    h1: 'HEK: additional rate compared with the average',
    intro: `HEK charges ${EN.pk(p.zb)}; the official average additional rate is ${EN.pz(w.zb_durchschnitt)} and the mean of all open funds ${EN.pz(st.mittel)}.`,
    resume: `HEK, Hanseatische Krankenkasse, is a substitute fund (Ersatzkasse) open nationwide. The GKV-Spitzenverband list gives it an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)}. That is ${naheDurchschnitt ? 'only a hair away from' : `${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points ${p.unterDurchschnitt ? 'below' : 'above'}`} the average additional rate of ${EN.pz(w.zb_durchschnitt)} that the Federal Health Ministry published for 2026 in the Federal Gazette. That official figure, however, is a forecast of the revenue needed, not an average of the rates funds actually charge; the simple mean of all ${st.n} open funds is ${EN.pz(st.mittel)}, and HEK sits ${vsMittelEn} it. In the ranking of all funds open to everyone it is number ${p.rangBund}. On ${EN.eur(BEISPIEL.lohn)} gross with one child you pay ${EN.eur(p.lohn)} a month for health and care insurance, and at the cheapest fund, ${p.billigste.kurz}, ${EN.eur(p.proJahrVsBilligste)} a year less.`,
    faqs: [
      { q: 'Is HEK above or below the average?', a: `Against the official average additional rate of ${EN.pz(w.zb_durchschnitt)} ${naheDurchschnitt ? 'it sits almost exactly on it' : `it is ${p.unterDurchschnitt ? 'below' : 'above'}, by ${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points`}. Against the actual mean of the open funds, ${EN.pz(st.mittel)}, it sits ${vsMittelEn} the mean. Both are benchmarks only; what you pay is your own fund’s rate.` },
      { q: 'What is the official average rate actually used for?', a: `It applies to insured people whose additional contribution is not based on their own fund’s rate, such as recipients of basic income support and other groups under section 242(3) SGB V, and it feeds into the factor used for the transition zone. For an HEK member with a salary it is only a yardstick, not a rate of its own.` },
      { q: `How much do I pay at HEK on ${EN.eur(BEISPIEL.lohnNiedrig)} gross?`, a: `With one child, ${EN.eur(p.lohnNiedrig)} a month for health and care insurance; a little more if you are childless and 23 or over, because of the ${EN.pz(w.pv_kinderlos)} care surcharge. At the ceiling of ${EN.eur(w.bbgKv, 2)} it is ${EN.eur(p.lohnBbg)}. Your employer pays the same share on top each time.` },
      { q: 'What can HEK members expect for 2027?', a: `HEK sets its 2027 rate itself, usually in December. The official estimating group arrived at an average of ${EN.pz(w27.zb_durchschnitt)} for 2027; the ministry’s final decision is still pending. If HEK’s rate rises, members can switch under the special termination right.` },
    ],
    body: (h) => `
<h2>Two averages that are easily confused</h2>
<p>“The average” can mean two different numbers. The official average additional rate under section 242a SGB V is derived each autumn from the estimate of statutory health insurance income and spending and published in the Federal Gazette. The actual mean, by contrast, comes from the rates funds really charge and currently stands at ${h.pz(st.mittel)}, with the median at ${h.pz(st.median)}. At ${h.pk(p.zb)}, HEK sits between these values and its neighbours in the ranking:</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'vs HEK a year'], umfeld.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `Funds around HEK, ${h.eur(BEISPIEL.lohn)} gross, one child`, ['l', 'r', 'r', 'r'])}
<h2>HEK contributions in euros</h2>
${h.table(['Situation', 'Base', 'Your share a month'], [
  ['Employed', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employed', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employed, maximum', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Pension', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, one child; self-employed without sick pay, student under 23', ['l', 'r', 'r'])}
<p>More on the role of the official figure and its level in recent years is under ${h.a('durchschnittlicher-zusatzbeitrag', 'average additional rate')}; what is known for 2027 under ${h.a('zusatzbeitrag-2027', 'additional rate 2027')}.</p>
<h2>Why anyone can join HEK</h2>
<p>As a substitute fund, HEK is not tied to a state or an employer. Someone living in Kiel can choose it just as well as someone in Passau, which is why the calculator lists it in all 16 states. Besides the rate, what matters is whether you need local branch offices or handle everything online; neither can be priced in euros, so it stays your own judgement. Before switching, also check any optional tariff, since a deductible ties you longer than the usual twelve months.</p>
<h2>Stay, switch, come back</h2>
<p>HEK is open in every state; to join, apply there and your current fund is notified. To leave, do the reverse. Either way notice runs to the end of the month after next, after twelve months of membership or straight after a rate rise. Coming back to HEK later is just as possible after another twelve months at the new fund (${h.a('krankenkasse-wechseln', 'work out the dates')}).</p>`,
  },
});
