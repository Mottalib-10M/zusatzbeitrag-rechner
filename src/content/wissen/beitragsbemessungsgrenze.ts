import { defineGuide } from '../../lib/guide-types';
import { angestellt, selbststaendig } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** Beitragsbemessungsgrenze KV/PV 2026 und 2027: Herkunft der Werte, Wirkung in Euro. Alles aus J() und dem Motor. */
const a = J(2026), b = J(2027);
const zb = a.zb_durchschnitt;
const extra = b.bbg_kv_jahr - b.bbg_pv_jahr; // § 223 Abs. 4 SGB V: Zuschlag auf die JAEG nach § 6 Abs. 7
const an = (brutto: number, j: 2026 | 2027) => angestellt({ brutto, zb, jahr: j, eltern: 'k1' });
const LOEHNE = [5000, a.bbgKv, b.bbgPv, b.bbgKv, 8000];
const maxDiffJahr = (an(b.bbgKv + 1000, 2027).selbst - an(b.bbgKv + 1000, 2026).selbst) * 12;
const kvMax26 = an(a.bbgKv, 2026).kv.mitglied, kvMax27 = an(b.bbgKv, 2027).kv.mitglied;
const selbstMax26 = selbststaendig({ einkommen: b.bbgKv + 1000, zb, jahr: 2026, krankengeld: true, eltern: 'k1' }).selbst;
const selbstMax27 = selbststaendig({ einkommen: b.bbgKv + 1000, zb, jahr: 2027, krankengeld: true, eltern: 'k1' }).selbst;
const anstieg = ((b.bbgKv - a.bbgKv) / a.bbgKv) * 100;

export default defineGuide({
  id: 'beitragsbemessungsgrenze',
  group: 'wissen',
  order: 82,
  mini: 'bbg',
  related: ['versicherungspflichtgrenze', 'arbeitgeberanteil-krankenversicherung', 'freiwillig-versichert', 'zusatzbeitrag-2027'],
  sources: ['sgb5_223', 'bgblStabG', 'bmasRg2027', 'bmasRg2026', 'sgb11_55', 'sgb4_23a'],
  de: {
    slug: 'beitragsbemessungsgrenze',
    nav: 'Beitragsbemessungsgrenze',
    card: `${DE.eur(a.bbgKv, 2)} im Monat 2026, vorläufig ${DE.eur(b.bbgKv)} 2027, die Pflege nur bis ${DE.eur(b.bbgPv)}: was das für Gutverdiener kostet.`,
    title: 'Beitragsbemessungsgrenze 2027: Kranken- und Pflegekasse',
    description: 'Beitragsbemessungsgrenze 2027 für Kranken- und Pflegeversicherung: neue Monatswerte, der Sonderaufschlag des Stabilisierungsgesetzes und Ihre Mehrkosten.',
    h1: 'Beitragsbemessungsgrenze 2027: wer mehr zahlt und wie viel',
    intro: `Bis ${DE.eur(a.bbgKv, 2)} Monatslohn zählt 2026 für die Krankenkasse, 2027 vorläufig bis ${DE.eur(b.bbgKv)}; Gutverdiener zahlen bis zu ${DE.eur(maxDiffJahr)} im Jahr mehr.`,
    resume: `Die Beitragsbemessungsgrenze der gesetzlichen Krankenversicherung liegt 2026 bei ${DE.eur(a.bbg_kv_jahr)} im Jahr, ${DE.eur(a.bbgKv, 2)} im Monat; was Sie darüber verdienen, bleibt beitragsfrei. Für 2027 hat das Bundeskabinett am 7. Oktober 2026 ${DE.eur(b.bbg_kv_jahr)} im Jahr beschlossen, ${DE.eur(b.bbgKv)} im Monat, ein Plus von ${DE.pz(anstieg, 1)}; der Bundesrat muss der Verordnung noch zustimmen. Der Sprung ist größer als in anderen Jahren, weil das GKV-Beitragssatzstabilisierungsgesetz die Grenze für 2027 einmalig um ${DE.eur(extra)} im Jahr über die Lohnentwicklung hinaus anhebt (§ 223 Abs. 4 SGB V). Die Pflegeversicherung folgt diesem Aufschlag nach dem geltenden § 55 Abs. 2 SGB XI nicht und bleibt bei ${DE.eur(b.bbgPv)} im Monat, solange der Entwurf des Pflegeneuordnungsgesetzes nichts anderes regelt. Wer an oder über der neuen Grenze verdient, zahlt mit durchschnittlichem Zusatzbeitrag und einem Kind ${DE.eur(maxDiffJahr)} im Jahr mehr; der Arbeitgeber legt fast genauso viel drauf.`,
    faqs: [
      { q: 'Ab welchem Gehalt zahle ich den Höchstbeitrag zur Krankenkasse?', a: `2026 ab ${DE.eur(a.bbgKv, 2)} brutto im Monat, 2027 nach dem Kabinettsbeschluss ab ${DE.eur(b.bbgKv)}. Ab dort steigt Ihr Beitrag mit jedem weiteren Euro nicht mehr. Bei einem Zusatzbeitrag von ${DE.pz(zb, 1)} beträgt Ihr Anteil an der Krankenversicherung dann ${DE.eur(kvMax26)} im Monat 2026 und ${DE.eur(kvMax27)} im Monat 2027.` },
      { q: 'Woher kommt der Sonderaufschlag auf die Beitragsbemessungsgrenze 2027?', a: `Normalerweise folgt sie der Lohnentwicklung des Vorjahres. Für 2027 kommt ein Aufschlag von ${DE.eur(extra)} im Jahr hinzu, den das GKV-Beitragssatzstabilisierungsgesetz vom Juli 2026 eingeführt hat, damit Gutverdiener mehr zur Finanzierung beitragen und der Zusatzbeitrag nicht steigen muss. Das Gesetz schreibt den Aufschlag ausdrücklich nur für 2027 fest; danach wird wieder nach der Lohnentwicklung fortgeschrieben.` },
      { q: 'Gilt die höhere Grenze auch für die Pflegeversicherung?', a: `Nach geltendem Recht nicht. § 55 Abs. 2 SGB XI verweist auf die Jahresarbeitsentgeltgrenze nach § 6 Abs. 7 SGB V, die für 2027 bei ${DE.eur(b.bbg_pv_jahr)} liegt; das sind ${DE.eur(b.bbgPv)} im Monat. Der Regierungsentwurf zum Pflegeneuordnungsgesetz will die Pflege an die Grenze der Krankenversicherung angleichen. Bis er verkündet ist, rechnet diese Seite mit der niedrigeren Grenze.` },
      { q: 'Ist die Beitragsbemessungsgrenze dasselbe wie die Versicherungspflichtgrenze?', a: `Nein. Die Beitragsbemessungsgrenze bestimmt, bis zu welchem Lohn Beiträge berechnet werden. Die Versicherungspflichtgrenze bestimmt, ab welchem Jahreslohn Sie die gesetzliche Kasse verlassen dürfen: 2026 ${DE.eur(a.jaeg_jahr)}, 2027 vorläufig ${DE.eur(b.jaeg_jahr)}. Wer dazwischen verdient, zahlt den Höchstbeitrag und bleibt trotzdem pflichtversichert.` },
      { q: 'Was bedeutet die neue Grenze für freiwillig versicherte Selbstständige?', a: `Sie tragen den Beitrag allein und spüren die Erhöhung deshalb doppelt. Mit Krankengeld und durchschnittlichem Zusatzbeitrag liegt der Höchstbetrag für Kranken- und Pflegeversicherung 2026 bei ${DE.eur(selbstMax26)} im Monat, 2027 bei ${DE.eur(selbstMax27)}. Betroffen ist, wessen Gewinn laut Steuerbescheid über der jeweiligen Grenze liegt.` },
    ],
    body: (h) => `
<h2>Woher die neuen Zahlen kommen</h2>
<p>Die Grenze wird jedes Jahr per Verordnung des Bundesarbeitsministeriums fortgeschrieben, nach der Entwicklung der Bruttolöhne im vorvergangenen Jahr. Für 2027 hat das Kabinett die ${h.src('bmasRg2027', 'Sozialversicherungs-Rechengrößenverordnung')} am 7. Oktober 2026 beschlossen; die Zustimmung des Bundesrats steht aus, deshalb führt diese Seite die Werte als vorläufig. Neu ist der Aufbau: § 223 Abs. 4 SGB V sagt seit dem ${h.src('bgblStabG', 'GKV-Beitragssatzstabilisierungsgesetz')}, dass die Grenze 2027 der Jahresarbeitsentgeltgrenze nach § 6 Abs. 7 SGB V plus ${h.eur(extra)} entspricht. Bis 2026 waren beide Werte identisch.</p>
${h.table(['Grenze', '2026 im Monat', '2027 im Monat', '2027 im Jahr'], [
  ['Krankenversicherung (§ 223 SGB V)', h.eur(a.bbgKv, 2), h.eur(b.bbgKv), h.eur(b.bbg_kv_jahr)],
  ['Pflegeversicherung (§ 55 Abs. 2 SGB XI)', h.eur(a.bbgPv, 2), h.eur(b.bbgPv), h.eur(b.bbg_pv_jahr)],
  ['Versicherungspflichtgrenze (§ 6 Abs. 6 SGB V)', h.eur(a.jaegMonat), h.eur(b.jaegMonat, 2), h.eur(b.jaeg_jahr)],
], 'BMAS, Rechengrößen 2026 und Kabinettsbeschluss 2027', ['l', 'r', 'r', 'r'])}
<h2>Die Pflege bleibt 2027 zurück</h2>
<p>Bemerkenswert ist die zweite Zeile. Die Pflegeversicherung hat keine eigene Grenze, sondern übernimmt nach ${h.src('sgb11_55', '§ 55 Abs. 2 SGB XI')} die Jahresarbeitsentgeltgrenze nach § 6 Abs. 7 SGB V. Den Aufschlag aus dem Stabilisierungsgesetz bekommt nur die Krankenversicherung. Für 2027 heißt das: Zwischen ${h.eur(b.bbgPv)} und ${h.eur(b.bbgKv)} Monatslohn steigt Ihr Krankenkassenbeitrag noch, Ihr Pflegebeitrag nicht mehr. Der Entwurf des Pflegeneuordnungsgesetzes, vom Kabinett am 30. September 2026 beschlossen, will beide Grenzen gleichziehen. Er ist nicht verkündet, also rechnet diese Seite nach geltendem Recht; sollte er rechtzeitig in Kraft treten, ändern wir den Wert in der Parameterdatei und alle Seiten rechnen neu.</p>
<h2>Was das in Euro bedeutet</h2>
<p>Unter ${h.eur(a.bbgKv, 2)} Monatslohn ändert sich durch die Grenze nichts. Darüber zahlen Sie 2027 auf jeden Euro bis zur neuen Grenze den vollen Satz. Die Tabelle rechnet Ihren Anteil an Kranken- und Pflegeversicherung mit durchschnittlichem Zusatzbeitrag von ${h.pz(zb, 1)} und einem Kind:</p>
${h.table(['Bruttolohn im Monat', '2026', '2027', 'Mehr im Jahr'], LOEHNE.map((x) => { const u = an(x, 2026).selbst, v = an(x, 2027).selbst; return [h.eur(x, 2), h.eur(u), h.eur(v), h.eur((v - u) * 12)]; }), 'Beschäftigte, Ihr Anteil, Kranken- und Pflegeversicherung', ['l', 'r', 'r', 'r'])}
<p>Der Arbeitgeber zahlt auf dieselbe Spanne seinen Anteil, für ihn verteuert sich jede Stelle über der Grenze ebenfalls. Bei einem höheren Zusatzbeitrag Ihrer Kasse wird der Aufschlag etwas größer; der Rechner auf der ${h.a('home', 'Startseite')} setzt Ihre Kasse ein.</p>
<h2>Wer es merkt und wer nicht</h2>
<p>Die meisten Beschäftigten verdienen weniger als ${h.eur(a.bbgKv, 2)} im Monat und merken von der Grenze nichts. Wer knapp darüber liegt, zahlt 2027 auf den Teil seines Lohns zwischen der alten und der neuen Grenze erstmals Beiträge. Wer weit darüber liegt, zahlt den vollen Aufschlag von ${h.eur(maxDiffJahr)} im Jahr. Rentner sind kaum betroffen, weil Renten selten an die Grenze reichen; anders bei hohen Betriebsrenten, die zusammen mit der gesetzlichen Rente bis zur Grenze beitragspflichtig sind (${h.a('betriebsrente-krankenversicherung', 'Betriebsrente')}).</p>
<p>Freiwillig versicherte Selbstständige tragen beide Hälften selbst. Mit Krankengeld und Durchschnittssatz steigt ihr Höchstbeitrag von ${h.eur(selbstMax26)} auf ${h.eur(selbstMax27)} im Monat. Für sie lohnt der Blick auf den ${h.a('freiwillig-versichert', 'Beitrag als freiwilliges Mitglied')}, der nach dem letzten Steuerbescheid festgesetzt wird.</p>
<h2>Weihnachtsgeld, Boni und Monate mit schwankendem Lohn</h2>
<p>Die Grenze gilt nicht starr pro Monat. Einmalzahlungen wie Weihnachtsgeld, Urlaubsgeld oder ein Bonus werden der anteiligen Jahresgrenze gegenübergestellt: Wer bis Dezember noch nicht die volle Jahresgrenze ausgeschöpft hat, zahlt auf das Weihnachtsgeld Beiträge, bis sie erreicht ist (§ 23a Abs. 3 SGB IV). Wer mit dem Grundgehalt knapp unter der Monatsgrenze liegt, zahlt deshalb auf einen Bonus oft noch fast vollen Beitrag, während jemand weit darüber nichts mehr zahlt. Unser Rechner arbeitet mit dem laufenden Monatslohn ohne Einmalzahlungen; für einen Monat mit Bonus zeigt Ihre Gehaltsabrechnung die genaue Aufteilung.</p>
<p>Auch ein Arbeitsplatzwechsel mitten im Jahr ändert nichts an der Grenze, solange Sie durchgehend beschäftigt sind: Jeder Arbeitgeber rechnet für seine Monate. Bei zwei Beschäftigungen gleichzeitig werden die Löhne zusammengezählt und die Beiträge anteilig verteilt, bis die Grenze erreicht ist.</p>
<h2>Die Grenze und der Wechsel in die private Kasse</h2>
<p>Mit der Beitragsbemessungsgrenze nicht zu verwechseln ist die ${h.a('versicherungspflichtgrenze', 'Versicherungspflichtgrenze')}. Sie steigt 2027 ebenfalls um den Sonderaufschlag, auf ${h.eur(b.jaeg_jahr)} im Jahr. Wer heute knapp über der alten Grenze liegt und an einen Wechsel in die private Krankenversicherung denkt, kann 2027 unter die neue rutschen und damit wieder versicherungspflichtig werden. Für Beschäftigte, die schon vor 2027 privat versichert waren, gilt eine eigene, niedrigere Grenze, damit sie nicht zurück in die gesetzliche Kasse müssen.</p>`,
  },
  en: {
    slug: 'contribution-ceiling',
    nav: 'Contribution ceiling',
    card: `${EN.eur(a.bbgKv, 2)} a month in 2026, provisionally ${EN.eur(b.bbgKv)} in 2027, care insurance only up to ${EN.eur(b.bbgPv)}: the cost for higher earners.`,
    title: 'Contribution Ceiling Germany 2027: Health and Care Rates',
    description: 'German health insurance contribution ceiling 2027: the new monthly values, the one-off rise from the stabilisation act and what it costs you in euros each year.',
    h1: 'Contribution ceiling 2027: who pays more and how much',
    intro: `Up to ${EN.eur(a.bbgKv, 2)} of monthly pay counts for health insurance in 2026, provisionally ${EN.eur(b.bbgKv)} in 2027; higher earners pay up to ${EN.eur(maxDiffJahr)} more a year.`,
    resume: `The contribution ceiling (Beitragsbemessungsgrenze) of German statutory health insurance is ${EN.eur(a.bbg_kv_jahr)} a year in 2026, ${EN.eur(a.bbgKv, 2)} a month; whatever you earn above it is contribution-free. For 2027 the federal cabinet decided on 7 October 2026 to set it at ${EN.eur(b.bbg_kv_jahr)} a year, ${EN.eur(b.bbgKv)} a month, up ${EN.pz(anstieg, 1)}; the Bundesrat still has to approve the ordinance. The jump is larger than usual because the contribution stabilisation act raises the 2027 ceiling by a one-off ${EN.eur(extra)} a year on top of wage growth (section 223(4) of Book V of the Social Code). Long-term care insurance does not follow that extra step under the current section 55(2) of Book XI and stays at ${EN.eur(b.bbgPv)} a month, unless the draft Care Reorganisation Act changes it. If you earn at or above the new ceiling, you pay ${EN.eur(maxDiffJahr)} a year more at the average additional rate with one child; your employer adds almost the same again.`,
    faqs: [
      { q: 'From what salary do I pay the maximum health contribution?', a: `In 2026 from ${EN.eur(a.bbgKv, 2)} gross a month, in 2027, per the cabinet decision, from ${EN.eur(b.bbgKv)}. Beyond that point your contribution stops rising. At an additional rate of ${EN.pz(zb, 1)}, your share of health insurance is then ${EN.eur(kvMax26)} a month in 2026 and ${EN.eur(kvMax27)} a month in 2027.` },
      { q: 'Where does the extra step in the 2027 contribution ceiling come from?', a: `It normally follows wage growth in the year before last. For 2027 an extra ${EN.eur(extra)} a year is added, introduced by the contribution stabilisation act of July 2026 so that higher earners contribute more and additional rates need not rise. The act sets this step for 2027 only; afterwards the ceiling again follows wages.` },
      { q: 'Does the higher ceiling apply to long-term care insurance too?', a: `Not under current law. Section 55(2) of Book XI refers to the annual earnings threshold in section 6(7) of Book V, which is ${EN.eur(b.bbg_pv_jahr)} for 2027, or ${EN.eur(b.bbgPv)} a month. The government’s draft Care Reorganisation Act would align care insurance with the health ceiling. Until it is enacted, this site uses the lower figure.` },
      { q: 'Is the contribution ceiling the same as the threshold for private insurance?', a: `No. The contribution ceiling caps the pay on which contributions are charged. The compulsory insurance threshold (Versicherungspflichtgrenze) decides from which annual pay you may leave the statutory system: ${EN.eur(a.jaeg_jahr)} in 2026, provisionally ${EN.eur(b.jaeg_jahr)} in 2027. Earn between the two and you pay the maximum but stay compulsorily insured.` },
      { q: 'What does the new ceiling mean for self-employed voluntary members?', a: `They pay both halves themselves, so they feel the rise twice over. With sick pay and the average additional rate, the maximum for health and care insurance is ${EN.eur(selbstMax26)} a month in 2026 and ${EN.eur(selbstMax27)} in 2027. It affects anyone whose profit in the last tax assessment exceeds the ceiling.` },
    ],
    body: (h) => `
<h2>Where the new figures come from</h2>
<p>The ceiling is updated every year by an ordinance of the Federal Labour Ministry, following gross wage growth in the year before last. For 2027 the cabinet adopted the ${h.src('bmasRg2027', 'reference values ordinance')} on 7 October 2026; the Bundesrat has yet to approve it, so this site treats the values as provisional. What is new is the construction: since the ${h.src('bgblStabG', 'contribution stabilisation act')}, section 223(4) of Book V says the 2027 ceiling equals the annual earnings threshold in section 6(7) plus ${h.eur(extra)}. Until 2026 the two figures were identical.</p>
${h.table(['Threshold', '2026 a month', '2027 a month', '2027 a year'], [
  ['Health insurance (section 223 SGB V)', h.eur(a.bbgKv, 2), h.eur(b.bbgKv), h.eur(b.bbg_kv_jahr)],
  ['Care insurance (section 55(2) SGB XI)', h.eur(a.bbgPv, 2), h.eur(b.bbgPv), h.eur(b.bbg_pv_jahr)],
  ['Compulsory insurance threshold (section 6(6) SGB V)', h.eur(a.jaegMonat), h.eur(b.jaegMonat, 2), h.eur(b.jaeg_jahr)],
], 'Labour Ministry, 2026 values and 2027 cabinet decision', ['l', 'r', 'r', 'r'])}
<h2>Care insurance lags behind in 2027</h2>
<p>The second row stands out. Long-term care insurance has no ceiling of its own; under ${h.src('sgb11_55', 'section 55(2) of Book XI')} it borrows the annual earnings threshold of section 6(7) of Book V. Only health insurance gets the extra step from the stabilisation act. In 2027 that means: between ${h.eur(b.bbgPv)} and ${h.eur(b.bbgKv)} of monthly pay your health contribution still rises but your care contribution does not. The draft Care Reorganisation Act, adopted by the cabinet on 30 September 2026, would bring the two into line. It has not been enacted, so this site follows current law; should it take effect in time, we change one value in the parameter file and every page recalculates.</p>
<h2>What it means in euros</h2>
<p>Below ${h.eur(a.bbgKv, 2)} a month the ceiling changes nothing for you. Above it, in 2027 you pay the full rate on every euro up to the new ceiling. The table shows your share of health and care insurance at the average additional rate of ${h.pz(zb, 1)} with one child:</p>
${h.table(['Gross pay a month', '2026', '2027', 'Extra a year'], LOEHNE.map((x) => { const u = an(x, 2026).selbst, v = an(x, 2027).selbst; return [h.eur(x, 2), h.eur(u), h.eur(v), h.eur((v - u) * 12)]; }), 'Employees, your share, health and care insurance', ['l', 'r', 'r', 'r'])}
<p>Your employer pays its share on the same band, so every job above the ceiling costs more for the employer too. If your fund’s additional rate is higher, the rise is a little bigger; the calculator on the ${h.a('home', 'home page')} uses your own fund.</p>
<h2>Who notices and who does not</h2>
<p>Most employees earn less than ${h.eur(a.bbgKv, 2)} a month and never meet the ceiling. If you are just above it, in 2027 you pay contributions for the first time on the slice of pay between the old and new ceilings. Far above it, you pay the full extra ${h.eur(maxDiffJahr)} a year. Pensioners are rarely affected, as pensions seldom reach the ceiling; large company pensions are the exception, because they count together with the state pension up to the ceiling (${h.a('betriebsrente-krankenversicherung', 'company pensions')}).</p>
<p>Self-employed voluntary members pay both halves themselves. With sick pay and the average rate, their maximum rises from ${h.eur(selbstMax26)} to ${h.eur(selbstMax27)} a month. They should look at the ${h.a('freiwillig-versichert', 'contribution as a voluntary member')}, which is set from the last tax assessment.</p>
<h2>Christmas bonus, one-off payments and uneven months</h2>
<p>The ceiling is not applied rigidly month by month. One-off payments such as a Christmas bonus, holiday pay or a performance bonus are measured against the pro-rata annual ceiling: if your regular pay has not used up the full annual ceiling by December, the bonus is charged until it is reached (section 23a(3) of Book IV). Someone whose basic salary sits just below the monthly ceiling therefore often pays almost the full rate on a bonus, while someone far above pays nothing extra. Our calculator works with regular monthly pay without one-off payments; for a bonus month your payslip shows the exact split.</p>
<h2>The ceiling and moving to private insurance</h2>
<p>Do not confuse the contribution ceiling with the ${h.a('versicherungspflichtgrenze', 'compulsory insurance threshold')}. It also takes the extra step in 2027, to ${h.eur(b.jaeg_jahr)} a year. If you are just above the old threshold and thinking of private health insurance, you may fall below the new one in 2027 and become compulsorily insured again. Employees who were already privately insured before 2027 have their own lower threshold, so that they are not pushed back into the statutory system.</p>`,
  },
});
