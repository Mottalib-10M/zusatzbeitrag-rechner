import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { kasse } from '../../lib/engine/kassen';
import { angestellt } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** BARMER: Satz und Rang aus der Kassenliste, Beträge aus dem Motor. */
const p = profil('barmer');
const w = J(2026);
const tk = kostenZeile(kasse('techniker-krankenkasse')), dak = kostenZeile(kasse('dak-gesundheit')), hkk = kostenZeile(kasse('handelskrankenkasse-hkk'));
const jahr = (x: { lohn: number }) => Math.round((p.lohn - x.lohn) * 12);
const relDe = (z: number) => (z < p.zb ? 'günstiger als' : z > p.zb ? 'teurer als' : 'genauso teuer wie');
const relEn = (z: number) => (z < p.zb ? 'cheaper than' : z > p.zb ? 'dearer than' : 'as dear as');
// Gutverdiener: Unterschied zur TK an der Beitragsbemessungsgrenze.
const bbgDiff = Math.round((angestellt({ brutto: w.bbgKv, zb: p.zb, jahr: 2026, eltern: 'k1' }).selbst - angestellt({ brutto: w.bbgKv, zb: tk.k.zb!, jahr: 2026, eltern: 'k1' }).selbst) * 12);
const zbAnteil = Math.round(BEISPIEL.lohn * p.zb / 2) / 100;
const peers = [p.k, tk.k, dak.k, hkk.k].map(kostenZeile).sort((a, b) => a.k.zb! - b.k.zb!);

export default defineGuide({
  id: 'barmer',
  group: 'kassen',
  order: 11,
  kasse: 'barmer',
  tool: 'beitrag',
  toolPreset: { kasse: 'barmer' },
  related: ['techniker-krankenkasse', 'dak-gesundheit', 'sonderkuendigungsrecht', 'zusatzbeitrag-liste', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_241', 'sgb5_175'],
  de: {
    slug: 'barmer-zusatzbeitrag',
    nav: 'BARMER',
    card: `${DE.pk(p.zb)} Zusatzbeitrag; bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(p.lohn)} im Monat, ${DE.eur(jahr(tk))} im Jahr mehr als bei der TK.`,
    title: 'BARMER Zusatzbeitrag 2027: Monatsbeitrag und Vergleich',
    description: `BARMER-Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Ihr Monatsbeitrag als Beschäftigte, Rentner oder Selbstständige, der Abstand zu TK und DAK und was 2027 zu erwarten ist.`,
    h1: 'BARMER: Zusatzbeitrag und was Sie im Monat zahlen',
    intro: `Die BARMER nimmt ${DE.pk(p.zb)} Zusatzbeitrag; bei ${DE.eur(BEISPIEL.lohn)} brutto sind das ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung.`,
    resume: `Die BARMER, eine der großen Ersatzkassen, führt in der Liste des GKV-Spitzenverbands einen Zusatzbeitrag von ${DE.pk(p.zb)}. Auf das Bruttogehalt bis zur Bemessungsgrenze fallen damit ${DE.pz(w.kv_allgemein + p.zb)} Krankenversicherung an, je zur Hälfte von Ihnen und Ihrem Arbeitgeber bezahlt. Ein Mitglied mit ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind trägt so ${DE.eur(p.lohn)} im Monat selbst, Pflege eingeschlossen. Der Satz liegt ${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte ${p.unterDurchschnitt ? 'unter' : 'über'} dem amtlichen Durchschnitt von ${DE.pz(w.zb_durchschnitt)}; in Euro sind das bei diesem Gehalt ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} im Jahr. Unter den ${p.nBund} frei wählbaren Kassen steht die BARMER auf Platz ${p.rangBund}. Die Techniker Krankenkasse ist ${relDe(tk.k.zb!).replace(' als', '').replace(' wie', '')}, die DAK-Gesundheit ${relDe(dak.k.zb!).replace(' als', '').replace(' wie', '')}. Die BARMER ist in allen Ländern wählbar, ein Umzug ändert an der Mitgliedschaft also nichts. Ob sich ein Wechsel für Sie rechnet, zeigt der Rechner oben mit Ihrem eigenen Gehalt und Ihrem Bundesland.`,
    faqs: [
      { q: 'Wie hoch ist der BARMER-Beitrag für Beschäftigte genau?', a: `Ihr Anteil an der Krankenversicherung beträgt ${DE.pz((w.kv_allgemein + p.zb) / 2)} des Bruttos, dazu kommen ${DE.pz(w.pv_satz / 2)} Pflege. Bei ${DE.eur(BEISPIEL.lohnNiedrig)} brutto ergibt das ${DE.eur(p.lohnNiedrig)}, bei ${DE.eur(BEISPIEL.lohn)} ${DE.eur(p.lohn)} im Monat. Über ${DE.eur(w.bbgKv, 2)} steigt nichts mehr; dort zahlen Sie ${DE.eur(p.lohnBbg)}. Kinderlose ab 23 rechnen ${DE.pz(w.pv_kinderlos)} Pflegezuschlag hinzu.` },
      { q: 'Lohnt sich ein Wechsel von der BARMER zur TK?', a: `Beim Preis ist die TK ${relDe(tk.k.zb!)} die BARMER: Sie verlangt ${DE.pk(tk.k.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto macht das ${DE.eur(Math.abs(jahr(tk)))} im Jahr aus, an der Bemessungsgrenze ${DE.eur(Math.abs(bbgDiff))}. Ob sich das lohnt, hängt davon ab, wie wichtig Ihnen Leistungen sind, die der Satz nicht zeigt, etwa Bonusprogramme oder Geschäftsstellen vor Ort.` },
      { q: 'Was zahlen BARMER-Mitglieder in Rente?', a: `Bei einer gesetzlichen Rente von ${DE.eur(BEISPIEL.rente)} ziehen Rentenversicherung und Kasse zusammen ${DE.eur(p.rente)} im Monat ab: die Hälfte von ${DE.pz(w.kv_allgemein + p.zb)} Krankenversicherung und die volle Pflege. Die andere Hälfte der Krankenversicherung zahlt die Rentenversicherung. Ändert die BARMER ihren Satz, wirkt das bei der Rente erst zwei Monate später.` },
      { q: 'Muss ich die BARMER kündigen, wenn ich zu einer anderen Kasse gehe?', a: `Nein. Sie stellen den Antrag bei der neuen Kasse, die der BARMER Ihren Wechsel elektronisch meldet. Die BARMER bestätigt das Ende der Mitgliedschaft, die zum Ablauf des übernächsten Monats endet, wenn Sie mindestens zwölf Monate Mitglied waren oder die BARMER ihren Satz erhöht hat.` },
    ],
    body: (h) => `
<h2>Wo die BARMER im Preisgefüge der Ersatzkassen steht</h2>
<p>Ersatzkassen wie BARMER, TK, DAK-Gesundheit oder hkk waren früher Angestellten bestimmter Berufe vorbehalten; heute kann jede und jeder Versicherungspflichtige sie wählen, in jedem Bundesland. Weil die Leistungen zum größten Teil gesetzlich festgelegt sind, unterscheidet sich der Preis fast nur über den Zusatzbeitrag. Die BARMER liegt mit ${h.pk(p.zb)} im Mittelfeld der Liste: ${p.rangBund - 1} frei wählbare Kassen verlangen weniger, ${p.nBund - p.rangBund} gleich viel oder mehr. Wer bei einem Arbeitgeber mit eigener Betriebskrankenkasse arbeitet, sollte auch diese prüfen; sie fehlt in der öffentlichen Rangliste. Umgekehrt gilt: Eine teurere Kasse muss kein schlechtes Angebot sein, wenn ihre Satzung Leistungen enthält, die Sie tatsächlich nutzen. Der Zusatzbeitrag ist nur der Teil des Preises, der sich in Euro vergleichen lässt.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber BARMER im Jahr'], peers.map((x) => [x.k.id === 'barmer' ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === 'barmer' ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(Math.round((x.lohn - p.lohn) * 12)))}`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'r'])}
<h2>Beitrag bei der BARMER nach Lebenslage</h2>
${h.table(['Lage', 'Grundlage', 'Ihr Anteil im Monat'], [
  ['Angestellt', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Angestellt', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Angestellt, Bemessungsgrenze', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['In Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig, ohne Krankengeld', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studierend, unter 23', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, mit einem Kind', ['l', 'r', 'r'])}
<p>Vom Monatsbeitrag eines Beschäftigten mit ${h.eur(BEISPIEL.lohn)} entfallen ${h.eur(zbAnteil)} auf den Zusatzbeitrag der BARMER; alles andere ist bei jeder Kasse gleich. Selbstständige spüren den Satz doppelt, weil sie ihn ganz tragen. Für sie ist der Unterschied zur günstigsten frei wählbaren Kasse, ${p.billigste.kurz}, bei ${h.eur(BEISPIEL.gewinn)} Gewinn entsprechend größer als bei Angestellten.</p>
<h2>Erhöhung zum Jahreswechsel: was BARMER-Mitglieder tun können</h2>
<p>Die BARMER legt ihren Satz für 2027 im Dezember fest. Steigt er, dürfen Sie bis zum Ende des Monats, ab dem der neue Satz gilt, zu einer anderen Kasse gehen, auch wenn Sie noch keine zwölf Monate Mitglied sind (${h.a('sonderkuendigungsrecht', 'Sonderkündigungsrecht')}). Die Kasse muss Sie vorher anschreiben. Mit welchem Termin die neue Mitgliedschaft beginnt, rechnet der ${h.a('krankenkasse-wechseln', 'Fristenrechner')} aus; alle Sätze stehen in der ${h.a('zusatzbeitrag-liste', 'vollständigen Liste')}.</p>`,
  },
  en: {
    slug: 'barmer-additional-contribution',
    nav: 'BARMER',
    card: `${EN.pk(p.zb)} additional rate; on ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohn)} a month, ${EN.eur(jahr(tk))} a year more than at TK.`,
    title: 'BARMER Additional Contribution 2027: Monthly Cost, Compared',
    description: `BARMER additional rate in 2026: ${EN.pk(p.zb)}. Your monthly cost as an employee, pensioner or self-employed member, the gap to TK and DAK and the outlook for 2027.`,
    h1: 'BARMER: additional rate and what you pay each month',
    intro: `BARMER charges an additional rate of ${EN.pk(p.zb)}; on ${EN.eur(BEISPIEL.lohn)} gross that is ${EN.eur(p.lohn)} a month for health and care insurance.`,
    resume: `BARMER, one of Germany’s large substitute funds (Ersatzkassen), is listed by the GKV-Spitzenverband with an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)}. Gross pay up to the contribution ceiling therefore carries ${EN.pz(w.kv_allgemein + p.zb)} health insurance, half paid by you and half by your employer. A member earning ${EN.eur(BEISPIEL.lohn)} gross with one child pays ${EN.eur(p.lohn)} a month out of their own pay, care insurance included. The rate is ${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points ${p.unterDurchschnitt ? 'below' : 'above'} the official average of ${EN.pz(w.zb_durchschnitt)}, which at that salary means ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} a year. Of the ${p.nBund} funds anyone can join, BARMER ranks ${p.rangBund}. Techniker Krankenkasse is ${relEn(tk.k.zb!).replace(' than', '').replace(' as', '')}, DAK-Gesundheit ${relEn(dak.k.zb!).replace(' than', '').replace(' as', '')}. BARMER is open in every state, so moving house never affects your membership. Whether a switch pays off for you is shown by the calculator above, using your own salary and state.`,
    faqs: [
      { q: 'Exactly how much does BARMER cost an employee?', a: `Your share of health insurance is ${EN.pz((w.kv_allgemein + p.zb) / 2)} of gross pay, plus ${EN.pz(w.pv_satz / 2)} for care insurance. On ${EN.eur(BEISPIEL.lohnNiedrig)} gross that comes to ${EN.eur(p.lohnNiedrig)}, on ${EN.eur(BEISPIEL.lohn)} to ${EN.eur(p.lohn)} a month. Above ${EN.eur(w.bbgKv, 2)} nothing rises further; there you pay ${EN.eur(p.lohnBbg)}. Childless members aged 23 or over add a ${EN.pz(w.pv_kinderlos)} care surcharge.` },
      { q: 'Is it worth switching from BARMER to TK?', a: `On price TK is ${relEn(tk.k.zb!)} BARMER, charging ${EN.pk(tk.k.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross the difference is ${EN.eur(Math.abs(jahr(tk)))} a year, at the contribution ceiling ${EN.eur(Math.abs(bbgDiff))}. Whether that is worth it depends on how much you value things the rate does not show, such as bonus schemes or local branch offices.` },
      { q: 'What do BARMER members pay in retirement?', a: `On a ${EN.eur(BEISPIEL.rente)} state pension, ${EN.eur(p.rente)} a month is deducted: half of the ${EN.pz(w.kv_allgemein + p.zb)} health rate and the full care contribution. The pension insurance pays the other half of health insurance. When BARMER changes its rate, the pension deduction follows only two months later.` },
      { q: 'Do I have to cancel BARMER before joining another fund?', a: `No. You apply to the new fund, which notifies BARMER electronically. BARMER confirms the end of membership, which falls at the end of the month after next, provided you have been a member for at least twelve months or BARMER has just raised its rate.` },
    ],
    body: (h) => `
<h2>Where BARMER sits among the substitute funds</h2>
<p>Substitute funds such as BARMER, TK, DAK-Gesundheit and hkk were once reserved for salaried staff in certain trades; today anyone subject to compulsory insurance can join them, in any state. Because benefits are largely fixed by law, the price differs almost only through the additional rate. At ${h.pk(p.zb)} BARMER sits in the middle of the list: ${p.rangBund - 1} open funds charge less, ${p.nBund - p.rangBund} the same or more. If your employer has its own company fund (Betriebskrankenkasse), check that too; it is missing from the public ranking. Conversely, a dearer fund is not necessarily a bad deal if its statutes include benefits you really use. The additional rate is simply the part of the price that can be compared in euros.</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'vs BARMER a year'], peers.map((x) => [x.k.id === 'barmer' ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === 'barmer' ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(Math.round((x.lohn - p.lohn) * 12)))}`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'r'])}
<h2>BARMER cost by situation</h2>
${h.table(['Situation', 'Base', 'Your share a month'], [
  ['Employed', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employed', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employed, at the ceiling', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Retired', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed, no sick pay', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student under 23', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, with one child', ['l', 'r', 'r'])}
<p>Of the monthly contribution of an employee on ${h.eur(BEISPIEL.lohn)}, ${h.eur(zbAnteil)} is BARMER’s additional rate; everything else is identical at every fund. Self-employed members feel the rate twice as hard because they pay all of it, so for them the gap to the cheapest open fund, ${p.billigste.kurz}, is correspondingly larger on ${h.eur(BEISPIEL.gewinn)} of profit.</p>
<h2>A rise at the turn of the year: what BARMER members can do</h2>
<p>BARMER sets its 2027 rate in December. If it goes up, you may leave for another fund until the end of the month the new rate starts, even within your first twelve months (${h.a('sonderkuendigungsrecht', 'special termination right')}). The fund must write to you beforehand. The ${h.a('krankenkasse-wechseln', 'deadline calculator')} gives the start date of a new membership; every rate is in the ${h.a('zusatzbeitrag-liste', 'full list')}.</p>`,
  },
});
