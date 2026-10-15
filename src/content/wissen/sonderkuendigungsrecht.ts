import { defineGuide } from '../../lib/guide-types';
import { wechsel, renteAb, type Monat } from '../../lib/engine/wechsel';
import { angestellt, rentner } from '../../lib/engine/beitrag';
import { P, J, DE, EN } from '../../lib/fmt';

/** Sonderkündigungsrecht nach § 175 Abs. 4 Satz 6 SGB V: Fristen aus wechsel(), Kosten des Abwartens aus dem Motor. */
const W = P.wechsel;
const w = J(2027);
const MDE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const MEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const de = (m: Monat) => `${MDE[m.m - 1]} ${m.y}`;
const en = (m: Monat) => `${MEN[m.m - 1]} ${m.y}`;
const prev = (m: Monat): Monat => (m.m === 1 ? { y: m.y - 1, m: 12 } : { y: m.y, m: m.m - 1 });
/** Mitglied seit vier Monaten vor der Erhöhung: ohne Erhöhung wäre ein Wechsel gesperrt. */
const seit = (e: Monat): Monat => { const i = e.y * 12 + e.m - 1 - 4; return { y: Math.floor(i / 12), m: (i % 12) + 1 }; };
const FAELLE: Monat[] = [{ y: 2027, m: 1 }, { y: 2027, m: 4 }, { y: 2027, m: 7 }];
const zeilen = FAELLE.flatMap((e) => [prev(e), e].map((x) => ({ e, x, r: wechsel(x, seit(e), e) })));
const jan = { y: 2027, m: 1 };
const frueh = wechsel(prev(jan), seit(jan), jan), spaet = wechsel(jan, seit(jan), jan);
const ohne = wechsel({ y: 2027, m: 2 }, seit(jan), jan);
const PUNKTE = 0.3;
/** Mehrkosten eines Monats mit dem erhöhten Satz, Anteil Beschäftigte (3.800 €) und Rentner (1.600 €). */
const mehrAn = angestellt({ brutto: 3800, zb: w.zb_durchschnitt + PUNKTE, jahr: 2027, eltern: 'k1' }).selbst - angestellt({ brutto: 3800, zb: w.zb_durchschnitt, jahr: 2027, eltern: 'k1' }).selbst;
const mehrRe = rentner({ rente: 1600, zb: w.zb_durchschnitt + PUNKTE, jahr: 2027, eltern: 'k1' }).selbst - rentner({ rente: 1600, zb: w.zb_durchschnitt, jahr: 2027, eltern: 'k1' }).selbst;
const rJan = renteAb(jan);

export default defineGuide({
  id: 'sonderkuendigungsrecht',
  group: 'wissen',
  order: 83,
  mini: 'sonderfrist',
  miniHref: 'krankenkasse-wechseln',
  related: ['krankenkasse-wechseln', 'zusatzbeitrag-2027', 'krankenkassenbeitrag-rentner', 'beste-krankenkasse'],
  sources: ['sgb5_175', 'sgb5_53', 'sgb5_247', 'sgb5_242'],
  de: {
    slug: 'sonderkuendigungsrecht',
    nav: 'Sonderkündigungsrecht',
    card: `Bei jeder Erhöhung des Zusatzbeitrags: wechseln trotz ${W.bindung_monate} Monaten Bindung, Wahl bis Ende des Erhöhungsmonats, neue Kasse zwei Monate später.`,
    title: 'Sonderkündigungsrecht Krankenkasse 2027: Frist und Ablauf',
    description: 'Sonderkündigungsrecht der Krankenkasse 2027 bei höherem Zusatzbeitrag: bis wann Sie wählen müssen, ab wann die neue Kasse gilt und was die Wartezeit kostet.',
    h1: 'Sonderkündigungsrecht: wechseln, wenn die Kasse erhöht',
    intro: `Erhöht Ihre Kasse zum Januar, können Sie bis Ende Januar eine neue wählen, auch ohne ${W.bindung_monate} Monate Mitgliedschaft; sie gilt dann ab 1. ${de(spaet.beginn)}.`,
    resume: `Erhebt eine Krankenkasse erstmals einen Zusatzbeitrag oder erhöht sie ihren Satz, dürfen ihre Mitglieder die Kasse verlassen, ohne die übliche Bindung von ${W.bindung_monate} Monaten abzuwarten (§ 175 Abs. 4 Satz 6 SGB V). Die Wahl der neuen Kasse muss bis zum Ende des Monats erklärt sein, ab dem der höhere Satz gilt; bei einer Erhöhung zum 1. Januar 2027 also bis zum 31. Januar. Die Kündigungsfrist selbst verkürzt sich dadurch nicht: Die alte Mitgliedschaft endet mit Ablauf des übernächsten Monats. Wer im Januar wählt, ist bis Ende ${MDE[spaet.letzterMonat.m - 1]} bei der alten Kasse und zahlt den höheren Satz ${spaet.monateErhoeht} Monate lang, wer schon im Dezember wählt, nur ${frueh.monateErhoeht}. Bei ${PUNKTE.toLocaleString('de-DE')} Punkten Erhöhung kostet jeder dieser Monate Beschäftigte mit ${DE.eur(3800)} brutto ${DE.eur(mehrAn, 2)}. Eine eigene Kündigung ist nicht nötig, die neue Kasse meldet den Wechsel. Ausgenommen sind nur Mitglieder im Wahltarif Krankengeld.`,
    faqs: [
      { q: 'Muss ich der alten Kasse wegen der Erhöhung schriftlich kündigen?', a: 'Nein. Auch beim Sonderkündigungsrecht genügt es, Mitglied der neuen Kasse zu werden; deren Meldung an die alte Kasse ersetzt die Kündigung (§ 175 Abs. 4 Satz 4 SGB V). Wichtig ist nur der Zeitpunkt: Ihre Wahl muss der neuen Kasse spätestens am letzten Tag des Monats vorliegen, ab dem der höhere Satz gilt.' },
      { q: 'Gilt das Sonderkündigungsrecht auch bei einer Erhöhung mitten im Jahr?', a: `Ja. Das Gesetz knüpft an jede Erhöhung an, nicht an den Jahreswechsel. Erhöht eine Kasse zum 1. Juli, können Sie bis zum 31. Juli eine neue Kasse wählen und sind ab dem 1. Oktober dort. Unterjährige Erhöhungen kommen vor, wenn das Geld einer Kasse nicht reicht (§ 242 Abs. 2 SGB V).` },
      { q: 'Was ist, wenn ich die Frist verpasse?', a: `Dann gilt wieder die normale Bindung. Wer etwa erst im Februar wählt, obwohl seine Kasse zum Januar erhöht hat, kann nur wechseln, wenn er zum Wechseltermin ${W.bindung_monate} Monate Mitglied ist. Für ein Mitglied seit ${de(seit(jan))} wäre das erst Ende ${de(ohne.letzterMonat)}; die neue Kasse gälte ab 1. ${de(ohne.beginn)}.` },
      { q: 'Haben Rentner ein Sonderkündigungsrecht, und wann wirkt die Erhöhung bei ihnen?', a: `Ja, das Recht gilt für alle Mitglieder. Bei der Rente zieht die Rentenversicherung einen neuen Zusatzbeitrag aber erst ab dem zweiten Folgemonat ab (§ 247 Satz 3 SGB V): Eine Erhöhung zum Januar 2027 trifft die Rente ab ${de(rJan)}. Bei ${PUNKTE.toLocaleString('de-DE')} Punkten und ${DE.eur(1600)} Rente sind das ${DE.eur(mehrRe, 2)} im Monat.` },
      { q: 'Gilt das Sonderkündigungsrecht auch, wenn ich einen Wahltarif habe?', a: 'Grundsätzlich ja, auch bei Selbstbehalt oder Prämie für nicht genutzte Leistungen, obwohl diese Tarife sonst ein bis drei Jahre binden. Die einzige Ausnahme nennt § 53 Abs. 8 SGB V: Mitglieder in einem Wahltarif Krankengeld, den vor allem Selbstständige abschließen, können wegen einer Erhöhung nicht vorzeitig gehen.' },
    ],
    body: (h) => `
<h2>Zwei Fristen, die oft verwechselt werden</h2>
<p>Das Sonderkündigungsrecht verschiebt nur eine von zwei Fristen. Die erste ist die Bindung: Normalerweise bleiben Sie ${W.bindung_monate} Monate bei einer Kasse, bevor Sie gehen dürfen. Diese Bindung fällt weg, sobald die Kasse ihren Zusatzbeitrag erhöht. Die zweite ist die Kündigungsfrist: Die Mitgliedschaft endet mit Ablauf des übernächsten Kalendermonats nach Ihrer Wahl. Diese Frist bleibt. Deshalb zahlt jeder, der wegen einer Erhöhung wechselt, den höheren Satz noch einige Monate.</p>
<p>Wie viele, hängt allein davon ab, wann Sie handeln. Die Tabelle rechnet mit einem Mitglied, das erst seit vier Monaten bei seiner Kasse ist und ohne Erhöhung also gar nicht wechseln dürfte:</p>
${h.table(['Erhöhung ab', 'Wahl im', 'Letzter Monat alt', 'Neue Kasse ab', 'Monate erhöht'], zeilen.map(({ e, x, r }) => [de(e), de(x), de(r.letzterMonat), `1. ${de(r.beginn)}`, String(r.monateErhoeht)]), 'Berechnet nach § 175 Abs. 4 SGB V', ['l', 'l', 'l', 'l', 'r'])}
<p>Die Regel dahinter: Wer im Monat vor der Erhöhung wählt, zahlt den höheren Satz zwei Monate, wer im Erhöhungsmonat wählt, drei. Noch früher geht es nur, wenn die Erhöhung dann schon beschlossen ist: Wer sie zwei Monate vorher kennt und sofort wählt, zahlt den höheren Satz nur einen Monat. In der Praxis beschließen die Verwaltungsräte die Sätze für Januar aber meist erst im Dezember, sodass Dezember und Januar die realistischen Monate sind.</p>
<h2>Was in der Gehaltsabrechnung passiert</h2>
<p>Für Beschäftigte zieht der Arbeitgeber den Beitrag ab und überweist ihn an die Kasse, die Sie ihm genannt haben. Er rechnet bis zum Wechseltermin mit dem höheren Satz der alten Kasse und ab dem Ersten des neuen Monats mit dem Satz der neuen. Sie sehen den Wechsel also in der Abrechnung des Monats, in dem die neue Mitgliedschaft beginnt, in der Zeile Krankenversicherung und meist auch im Namen der Kasse. Steht dort nach dem Termin noch die alte Kasse, haben Sie dem Arbeitgeber die neue vermutlich nicht gemeldet; die Beiträge werden dann nachträglich umgebucht, verloren geht nichts.</p>
<p>Wer freiwillig versichert ist und selbst überweist, ändert seinen Dauerauftrag oder die Einzugsermächtigung zum Wechseltermin. Die neue Kasse schickt dafür einen eigenen Beitragsbescheid, der auf dem letzten Einkommensnachweis beruht.</p>
<h2>Was das Warten kostet</h2>
<p>Ein Monat mehr beim alten Satz ist meist kein großer Betrag, aber er summiert sich. Bei einer Erhöhung um ${h.num(PUNKTE, 1)} Punkte zahlen Beschäftigte mit ${h.eur(3800)} brutto ${h.eur(mehrAn, 2)} im Monat mehr, Rentner mit ${h.eur(1600)} gesetzlicher Rente ${h.eur(mehrRe, 2)}. Wichtiger als der Monat ist oft der Abstand zur günstigsten Kasse, den Sie danach dauerhaft sparen; den zeigt der ${h.a('home', 'Beitragsrechner')} für Ihr Land.</p>
<h2>So gehen Sie vor</h2>
<p>Erstens: Satz der eigenen Kasse prüfen. Steht im Dezember fest, dass sie zum Januar erhöht, können Sie sofort handeln. Zweitens: neue Kasse aussuchen und dort den Mitgliedsantrag stellen, online oder auf Papier. Die neue Kasse fragt nach Ihrer bisherigen Kasse und meldet den Wechsel elektronisch; die alte bestätigt das Ende innerhalb von zwei Wochen. Drittens: Arbeitgeber informieren, damit die Beiträge ab dem Wechseltermin an die richtige Kasse gehen. Rentner müssen nichts tun, die Rentenversicherung erfährt es von den Kassen.</p>
<p>Ein Fehler, der jedes Jahr vorkommt: Mitglieder schreiben ihrer alten Kasse eine Kündigung und vergessen, rechtzeitig eine neue zu wählen. Die Kündigung allein wirkt nur, wenn Sie innerhalb der Frist eine andere Absicherung nachweisen; der Antrag bei der neuen Kasse ist der eigentliche Schritt. Datum und Eingang sollten Sie sich bestätigen lassen, am einfachsten über die Eingangsbestätigung, die fast jede Kasse beim Online-Antrag sofort per E-Mail verschickt. Hat die neue Kasse Ihren Antrag rechtzeitig, kommt es auf den Postlauf zur alten Kasse nicht mehr an.</p>
<h2>Wann es kein Sonderkündigungsrecht gibt</h2>
<p>Senkt eine Kasse ihren Satz oder bleibt er gleich, gilt die normale Bindung. Dasselbe, wenn eine andere Kasse billiger wird: Das Recht knüpft an die Erhöhung der eigenen Kasse an, nicht an den Abstand zur Konkurrenz. Wer im Wahltarif Krankengeld versichert ist, bleibt trotz Erhöhung gebunden (§ 53 Abs. 8 SGB V).</p>
<p>Den eigenen Termin rechnet der Rechner unter ${h.a('krankenkasse-wechseln', 'Krankenkasse wechseln')}, mit Ihrem Eintrittsmonat und dem Monat der Erhöhung. Welche Kassen gerade erhöht haben, sehen Sie ab dem Tag der Gültigkeit in der ${h.a('zusatzbeitrag-liste', 'Liste aller Zusatzbeiträge')}.</p>`,
  },
  en: {
    slug: 'special-termination-right',
    nav: 'Special termination right',
    card: `After any rise in the additional rate: switch despite the ${W.bindung_monate}-month lock-in, join by the end of the rise month, new fund two months later.`,
    title: 'Special Termination Right Germany 2027: Health Fund Rules',
    description: 'Special termination right for German health funds in 2027 after a higher additional rate: when you must join a new fund, when it starts, what the waiting costs.',
    h1: 'Special termination right: switching when your fund raises its rate',
    intro: `If your fund raises its rate in January, you can join another fund until the end of January, even within the ${W.bindung_monate}-month lock-in; it starts on 1 ${en(spaet.beginn)}.`,
    resume: `When a German health fund introduces an additional contribution (Zusatzbeitrag) or raises it, its members may leave without waiting out the usual ${W.bindung_monate}-month lock-in (section 175(4), sentence 6 of Book V of the Social Code). You must join the new fund by the end of the month in which the higher rate starts; for a rise on 1 January 2027, that means by 31 January. The notice period itself does not shorten: the old membership ends at the close of the month after next. Join in January and you stay with the old fund until the end of ${MEN[spaet.letzterMonat.m - 1]}, paying the higher rate for ${spaet.monateErhoeht} months; join in December and it is only ${frueh.monateErhoeht}. For a rise of ${PUNKTE} points each of those months costs an employee on ${EN.eur(3800)} gross ${EN.eur(mehrAn, 2)}. You do not need to cancel yourself; the new fund reports the switch. The only members excluded are those in an optional sick-pay tariff.`,
    faqs: [
      { q: 'Do I need to send my old fund a written cancellation because of the rise?', a: 'No. With the special right too, joining the new fund is enough; its notice to the old fund replaces your cancellation (section 175(4), sentence 4 SGB V). Only the timing matters: your choice must reach the new fund by the last day of the month in which the higher rate starts.' },
      { q: 'Does the special right apply to a rise in the middle of the year?', a: 'Yes. The law ties it to any increase, not to the turn of the year. If a fund raises its rate on 1 July, you can join another fund until 31 July and move there on 1 October. Mid-year rises do happen when a fund runs short of money (section 242(2) SGB V).' },
      { q: 'What if I miss the deadline?', a: `Then the ordinary lock-in applies again. Join only in February although your fund raised its rate in January, and you can switch only if you have been a member for ${W.bindung_monate} months by the switch date. For someone who joined in ${en(seit(jan))} that would be the end of ${en(ohne.letzterMonat)}, with the new fund from 1 ${en(ohne.beginn)}.` },
      { q: 'Do pensioners have the special right, and when does a rise hit them?', a: `Yes, the right applies to every member. On pensions, though, the pension insurance deducts a new additional rate only from the second month after it changes (section 247, sentence 3 SGB V): a rise in January 2027 reaches the pension from ${en(rJan)}. For ${PUNKTE} points on a ${EN.eur(1600)} pension that is ${EN.eur(mehrRe, 2)} a month.` },
      { q: 'Does the special right apply if I have an optional tariff?', a: 'In principle yes, including deductible tariffs and bonuses for unused benefits, even though those otherwise tie you for one to three years. Section 53(8) SGB V names one exception: members in an optional sick-pay tariff, which mainly self-employed people take out, cannot leave early because of a rise.' },
    ],
    body: (h) => `
<h2>Two deadlines people mix up</h2>
<p>The special right moves only one of two deadlines. The first is the lock-in: normally you stay with a fund for ${W.bindung_monate} months before you may leave. That lock-in falls away as soon as the fund raises its additional rate. The second is the notice period: membership ends at the close of the month after next following your choice. That period stays. So anyone switching because of a rise still pays the higher rate for a few months.</p>
<p>How many depends only on when you act. The table assumes a member who joined their fund just four months earlier and so could not switch at all without the rise:</p>
${h.table(['Rise from', 'Join in', 'Last month old', 'New fund from', 'Months higher'], zeilen.map(({ e, x, r }) => [en(e), en(x), en(r.letzterMonat), `1 ${en(r.beginn)}`, String(r.monateErhoeht)]), 'Worked out under section 175(4) SGB V', ['l', 'l', 'l', 'l', 'r'])}
<p>The rule behind it: join in the month before the rise and you pay the higher rate for two months; join in the month of the rise and it is three. Earlier still only works if the rise has already been decided by then: know it two months ahead, join at once, and you pay the higher rate for just one month. In practice fund boards usually set January rates only in December, so December and January are the realistic months.</p>
<h2>What happens on your payslip</h2>
<p>For employees the employer deducts the contribution and pays it to the fund you named. Up to the switch date it uses the old fund’s higher rate, and from the first day of the new month the new fund’s rate. You see the switch on the payslip for the month the new membership starts, in the health insurance line and usually in the fund’s name. If the old fund still appears after the date, you probably did not tell your employer; contributions are then rebooked afterwards and nothing is lost. Voluntary members who pay themselves change their standing order or direct debit for the switch date; the new fund sends its own contribution notice based on the latest income evidence.</p>
<h2>What waiting costs</h2>
<p>One extra month at the old fund is usually not much, but it adds up. For a rise of ${h.num(PUNKTE, 1)} points an employee on ${h.eur(3800)} gross pays ${h.eur(mehrAn, 2)} more a month, a pensioner with a ${h.eur(1600)} state pension ${h.eur(mehrRe, 2)}. The gap to the cheapest fund, which you save every month afterwards, often matters more; the ${h.a('home', 'contribution calculator')} shows it for your state.</p>
<h2>How to go about it</h2>
<p>First, check your own fund’s rate. Once it is clear in December that it rises in January, you can act. Second, pick a new fund and apply for membership there, online or on paper. The new fund asks for your current fund and reports the switch electronically; the old one confirms the end within two weeks. Third, tell your employer so that contributions go to the right fund from the switch date. Pensioners do nothing; the funds inform the pension insurance.</p>
<p>A mistake that happens every year: members send their old fund a cancellation and forget to join a new one in time. A cancellation on its own only takes effect if you prove other cover within the notice period; the application to the new fund is the step that counts. Ask for confirmation of the date it was received.</p>
<h2>When there is no special right</h2>
<p>If a fund lowers its rate or keeps it unchanged, the ordinary lock-in applies. The same if another fund becomes cheaper: the right depends on your own fund’s increase, not on the gap to competitors. Members in an optional sick-pay tariff stay bound despite a rise (section 53(8) SGB V).</p>
<p>The calculator on the page about ${h.a('krankenkasse-wechseln', 'switching fund')} works out your own date from your joining month and the month of the rise. Which funds have just raised their rate shows up from the day it applies in the ${h.a('zusatzbeitrag-liste', 'list of all additional rates')}.</p>`,
  },
});
