import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { offen, KASSEN } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** SBK: ursprünglich Betriebskasse von Siemens, heute bundesweit geöffnet. Vergleich mit den anderen bundesweiten Betriebskrankenkassen. */
const ID = 'siemens-betriebskrankenkasse-sbk';
const p = profil(ID);
const w = J(2026);
const me = kostenZeile(p.k);
const bkkBund = offen().filter((k) => k.kassenart === 'BKK' && k.art === 'bundesweit');
const rangBkk = bkkBund.filter((k) => k.zb! < p.zb).length + 1;
const geschlossen = KASSEN.filter((k) => k.kassenart === 'BKK' && k.art === 'betrieblich' && k.zb !== null);
const nachbarnBkk = bkkBund.slice(0, 3).concat(bkkBund.slice(-2)).filter((k, i, a) => a.indexOf(k) === i).map(kostenZeile);
const brutto = [2500, 3800, 5000, Math.round(w.bbgKv)];
const diffJahr = (b: number, zb: number) => Math.round(Math.min(b, w.bbgKv) * (p.zb - zb) / 200 * 12);

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 26,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID },
  related: ['bkk-firmus', 'beste-krankenkasse', 'zusatzbeitrag-liste', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_249'],
  de: {
    slug: 'sbk-zusatzbeitrag',
    nav: 'SBK',
    card: `${DE.pk(p.zb)} Zusatzbeitrag, Platz ${rangBkk} unter ${bkkBund.length} bundesweit geöffneten Betriebskrankenkassen.`,
    title: 'SBK Zusatzbeitrag 2027: Beitrag in Euro und BKK-Vergleich',
    description: `SBK Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Was Sie bei der Siemens-Betriebskrankenkasse im Monat zahlen und wie sie unter den bundesweit offenen BKK steht, Ausblick 2027.`,
    h1: 'SBK: Zusatzbeitrag der Siemens-Betriebskrankenkasse in Euro',
    intro: `Die SBK verlangt ${DE.pk(p.zb)}; bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlen Sie ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung.`,
    resume: `Die SBK, die Siemens-Betriebskrankenkasse, ist aus der Betriebskasse des Siemens-Konzerns hervorgegangen, steht heute aber laut Liste des GKV-Spitzenverbands bundesweit jedem offen, unabhängig vom Arbeitgeber. Ihr Zusatzbeitrag beträgt ${DE.pk(p.zb)}, ${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte ${p.unterDurchschnitt ? 'unter' : 'über'} dem amtlichen Durchschnitt von ${DE.pz(w.zb_durchschnitt)}. Unter den ${bkkBund.length} Betriebskrankenkassen, die bundesweit geöffnet sind, steht sie auf Platz ${rangBkk}; unter allen ${p.nBund} frei wählbaren Kassen auf Rang ${p.rangBund}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlen Beschäftigte ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung, Rentner mit ${DE.eur(BEISPIEL.rente)} Rente ${DE.eur(p.rente)}. Bei der günstigsten frei wählbaren Kasse wären es für Beschäftigte ${DE.eur(p.proJahrVsBilligste)} im Jahr weniger. Neben der SBK gibt es ${geschlossen.length} Betriebskrankenkassen, die ihre Satzung nicht geöffnet haben und nur die Beschäftigten ihres Trägers aufnehmen; für sie gilt die Rangliste dieser Seite nicht.`,
    faqs: [
      { q: 'Muss ich bei Siemens arbeiten, um in die SBK zu kommen?', a: 'Nein. Die SBK ist laut Liste des GKV-Spitzenverbands bundesweit geöffnet und muss jeden aufnehmen, der gesetzlich versichert ist und sie wählt, unabhängig von Arbeitgeber, Alter oder Gesundheit (§ 175 Abs. 1 SGB V). Der Name erinnert nur an ihre Herkunft als Betriebskasse des Konzerns.' },
      { q: 'Ist eine Betriebskrankenkasse schlechter versichert als eine Ersatzkasse?', a: 'Nein. Die Pflichtleistungen sind im SGB V für alle Kassenarten gleich geregelt; Unterschiede gibt es nur bei Satzungsleistungen, Bonusprogrammen, Wahltarifen und beim Service. Ob eine Kasse eine AOK, eine Ersatzkasse oder eine Betriebskrankenkasse ist, sagt über Ihren Versicherungsschutz nichts aus.' },
      { q: 'Was zahle ich bei der SBK an der Beitragsbemessungsgrenze?', a: `Mit einem Kind ${DE.eur(p.lohnBbg)} im Monat für Kranken- und Pflegeversicherung, ab einem Bruttolohn von ${DE.eur(w.bbgKv, 2)}. Darüber steigt der Beitrag nicht weiter. 2027 hebt die Grenze sich auf ${DE.eur(J(2027).bbgKv)} im Monat, der Beitrag steigt dann auch bei gleichem Satz.` },
      { q: 'Wie hoch wird der SBK-Zusatzbeitrag 2027?', a: `Das beschließt der Verwaltungsrat der SBK, meist im Dezember; die amtliche Liste zeigt den neuen Satz ab dem Tag seiner Gültigkeit. Der Schätzerkreis hat für 2027 einen rechnerischen Durchschnitt von ${DE.pz(J(2027).zb_durchschnitt)} ermittelt. Bei einer Erhöhung können Mitglieder sofort wechseln.` },
    ],
    body: (h) => `
<h2>Die SBK unter den bundesweiten Betriebskrankenkassen</h2>
<p>Betriebskrankenkassen sind die zahlenmäßig größte Gruppe in der Liste, aber die meisten sind klein oder geschlossen. ${bkkBund.length} von ihnen sind bundesweit geöffnet, darunter die SBK. Die Tabelle zeigt die günstigsten und die teuersten davon neben der SBK, gerechnet mit ${h.eur(BEISPIEL.lohn)} brutto und einem Kind:</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber SBK im Jahr'], [...nachbarnBkk.filter((x) => x.k.id !== ID), me].sort((a, b) => a.k.zb! - b.k.zb!).map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(Math.round((x.lohn - me.lohn) * 12)))}`]), 'Bundesweit geöffnete Betriebskrankenkassen, Liste des GKV-Spitzenverbands', ['l', 'r', 'r', 'r'])}
<h2>Was ein Wechsel weg von der SBK bringt</h2>
${h.table(['Bruttolohn', `bis ${p.billigste.kurz} (${h.pk(p.billigste.zb!)})`, `bis zum Durchschnitt (${h.pz(w.zb_durchschnitt)})`], brutto.map((b) => [h.eur(b), h.eur(diffJahr(b, p.billigste.zb!)), h.eur(diffJahr(b, w.zb_durchschnitt))]), 'Ersparnis im Jahr für Beschäftigte, nur Zusatzbeitrag, halber Anteil', ['r', 'r', 'r'])}
<p>Die Ersparnis wächst mit dem Lohn bis zur Beitragsbemessungsgrenze und bleibt danach gleich, weil Einkommen oberhalb dieser Grenze keinen Beitrag mehr auslöst. Ob die günstigste Kasse in Ihrem Land wählbar ist, zeigt die Rangliste im Rechner oben; regionale Kassen fehlen dort, wo sie nicht geöffnet sind.</p>
<h2>Rentner, Selbstständige und Studierende bei der SBK</h2>
${h.table(['Lage', 'Grundlage', 'Ihr Anteil im Monat'], [['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)], ['Selbstständig, ohne Krankengeld', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)], ['Studium, unter 23', h.eur(w.bafoeg_bedarf), h.eur(p.student)]], '2026, mit Kind', ['l', 'r', 'r'])}
<p>Wer seinen Beitrag allein trägt, spürt den Zusatzbeitrag am stärksten. Selbstständige zahlen ihn vollständig auf den Gewinn, Studierende vollständig auf den festen BAföG-Bedarf, Rentner nur zur Hälfte, weil die Rentenversicherung die andere Hälfte übernimmt. Für eine selbstständige Grafikerin mit ${h.eur(BEISPIEL.gewinn)} Gewinn macht jeder Zehntelpunkt Unterschied ${h.eur(BEISPIEL.gewinn * 0.1 / 100 * 12)} im Jahr aus, für einen Beschäftigten mit gleichem Brutto nur die Hälfte. Das sollte man beim Vergleich der Kassen im Kopf behalten, gerade wenn die Erhöhungen zum Jahreswechsel kommen.</p>
<h2>Geschlossene Betriebskassen: ein Sonderfall</h2>
<p>${geschlossen.length} Betriebskrankenkassen nehmen nur Beschäftigte ihres Trägerunternehmens auf, oft zu einem günstigen Satz. Arbeiten Sie bei einem solchen Unternehmen, lohnt der Blick in die ${h.a('zusatzbeitrag-liste', 'vollständige Liste')}, in der sich diese Kassen einblenden lassen. Für alle anderen kommt nur eine geöffnete Kasse wie die SBK in Frage. Wer das Unternehmen verlässt, bleibt übrigens Mitglied der geschlossenen Kasse, bis er selbst wechselt; ausgeschlossen wird niemand. Fristen und Sonderkündigungsrecht: ${h.a('krankenkasse-wechseln', 'Wechsel rechnen')}.</p>`,
  },
  en: {
    slug: 'sbk-additional-contribution',
    nav: 'SBK',
    card: `${EN.pk(p.zb)} additional rate, number ${rangBkk} of ${bkkBund.length} company funds open nationwide.`,
    title: 'SBK Additional Contribution 2027: Cost and BKK Comparison',
    description: `SBK additional rate in 2026: ${EN.pk(p.zb)}. What you pay each month at Siemens-Betriebskrankenkasse and how it ranks among company funds open to all, 2027 outlook.`,
    h1: 'SBK: the Siemens company fund’s additional rate in euros',
    intro: `SBK charges ${EN.pk(p.zb)}; on ${EN.eur(BEISPIEL.lohn)} gross with one child you pay ${EN.eur(p.lohn)} a month for health and care insurance.`,
    resume: `SBK, Siemens-Betriebskrankenkasse, grew out of the company health fund of the Siemens group but, according to the GKV-Spitzenverband list, is now open nationwide to anyone, whoever their employer. Its additional contribution (Zusatzbeitrag) is ${EN.pk(p.zb)}, ${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points ${p.unterDurchschnitt ? 'below' : 'above'} the official average of ${EN.pz(w.zb_durchschnitt)}. Among the ${bkkBund.length} company funds (Betriebskrankenkassen) open nationwide it ranks ${rangBkk}; among all ${p.nBund} open funds, ${p.rangBund}. On ${EN.eur(BEISPIEL.lohn)} gross with one child, employees pay ${EN.eur(p.lohn)} a month for health and care insurance, and pensioners with a ${EN.eur(BEISPIEL.rente)} pension ${EN.eur(p.rente)}. At the cheapest open fund an employee would pay ${EN.eur(p.proJahrVsBilligste)} a year less. Alongside SBK there are ${geschlossen.length} company funds that have not opened their statutes and accept only their sponsor’s staff; the ranking on this page does not cover them.`,
    faqs: [
      { q: 'Do I have to work for Siemens to join SBK?', a: 'No. According to the GKV-Spitzenverband list SBK is open nationwide and must accept anyone with statutory cover who chooses it, regardless of employer, age or health (section 175(1) SGB V). The name only recalls its origin as the group’s company fund.' },
      { q: 'Is a company fund worse cover than a substitute fund?', a: 'No. Statutory benefits are set out in Book V of the Social Code identically for every type of fund; differences exist only in extra benefits, bonus schemes, optional tariffs and service. Whether a fund is an AOK, a substitute fund or a company fund says nothing about your cover.' },
      { q: 'What do I pay at SBK at the contribution ceiling?', a: `With one child, ${EN.eur(p.lohnBbg)} a month for health and care insurance, from gross pay of ${EN.eur(w.bbgKv, 2)}. Above that the contribution stops rising. In 2027 the ceiling rises to ${EN.eur(J(2027).bbgKv)} a month, so the contribution rises too even at the same rate.` },
      { q: 'How high will the SBK additional rate be in 2027?', a: `SBK’s board decides, usually in December, and the official list shows the new rate from the day it applies. The estimating group arrived at an arithmetic average of ${EN.pz(J(2027).zb_durchschnitt)} for 2027. If the rate rises, members can switch straight away.` },
    ],
    body: (h) => `
<h2>SBK among the nationwide company funds</h2>
<p>Company funds are the largest group in the list by number, but most are small or closed. ${bkkBund.length} of them are open nationwide, SBK among them. The table sets the cheapest and dearest of these beside SBK, using ${h.eur(BEISPIEL.lohn)} gross and one child:</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'vs SBK a year'], [...nachbarnBkk.filter((x) => x.k.id !== ID), me].sort((a, b) => a.k.zb! - b.k.zb!).map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(Math.round((x.lohn - me.lohn) * 12)))}`]), 'Company funds open nationwide, GKV-Spitzenverband list', ['l', 'r', 'r', 'r'])}
<h2>What leaving SBK would save</h2>
${h.table(['Gross pay', `to ${p.billigste.kurz} (${h.pk(p.billigste.zb!)})`, `to the average (${h.pz(w.zb_durchschnitt)})`], brutto.map((b) => [h.eur(b), h.eur(diffJahr(b, p.billigste.zb!)), h.eur(diffJahr(b, w.zb_durchschnitt))]), 'Saving a year for employees, additional rate only, half share', ['r', 'r', 'r'])}
<p>The saving grows with pay up to the contribution ceiling and stays flat above it. Whether the cheapest fund is open in your state is shown by the ranking in the calculator above; regional funds drop out where they are not open.</p>
<h2>Pensioners, the self-employed and students at SBK</h2>
${h.table(['Situation', 'Base', 'Your share a month'], [['Pensioner', h.eur(BEISPIEL.rente), h.eur(p.rente)], ['Self-employed, no sick pay', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)], ['Student under 23', h.eur(w.bafoeg_bedarf), h.eur(p.student)]], '2026, with a child', ['l', 'r', 'r'])}
<p>Those who pay their contribution alone feel the additional rate most. The self-employed pay all of it on profit, students all of it on the fixed BAföG need rate, pensioners only half, because the pension insurance covers the other half. For a self-employed designer with ${h.eur(BEISPIEL.gewinn)} profit, each tenth of a point makes ${h.eur(BEISPIEL.gewinn * 0.1 / 100 * 12)} a year, for an employee on the same gross only half that. Keep this in mind when comparing funds, especially when rises arrive at the turn of the year.</p>
<h2>Closed company funds: a special case</h2>
<p>${geschlossen.length} company funds accept only their sponsor’s employees, often at a low rate. If you work for such a company, look at the ${h.a('zusatzbeitrag-liste', 'full list')}, where these funds can be shown. Everyone else can only choose an open fund such as SBK. Anyone who leaves the company stays a member of the closed fund until they switch themselves; nobody is thrown out. Deadlines and the special termination right: ${h.a('krankenkasse-wechseln', 'work out the dates')}.</p>`,
  },
});
