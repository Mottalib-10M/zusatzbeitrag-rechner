import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { offen } from '../../lib/engine/kassen';
import { rentner } from '../../lib/engine/beitrag';
import { J, DE, EN } from '../../lib/fmt';

/** KNAPPSCHAFT: eigene Kassenart, Teil der Deutschen Rentenversicherung Knappschaft-Bahn-See. Zahlen aus Liste und Motor. */
const ID = 'knappschaft';
const p = profil(ID);
const w = J(2026);
const alle = offen();
const teurer = alle.filter((k) => k.zb! > p.zb);
const gleich = alle.filter((k) => k.zb! === p.zb && k.id !== ID);
const renten = [1200, 1600, 2000].map((r) => ({ r, k: rentner({ rente: r, zb: p.zb, jahr: 2026, eltern: 'k1' }).selbst, b: rentner({ rente: r, zb: p.billigste.zb!, jahr: 2026, eltern: 'k1' }).selbst }));
const median = p.st.median;

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 25,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID },
  related: ['krankenkassenbeitrag-rentner', 'krankenkasse-wechseln', 'sonderkuendigungsrecht', 'zusatzbeitrag-liste'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_247', 'minijob2027'],
  de: {
    slug: 'knappschaft-zusatzbeitrag',
    nav: 'KNAPPSCHAFT',
    card: `${DE.pk(p.zb)} Zusatzbeitrag, ${teurer.length === 0 ? 'der höchste' : `${teurer.length} Kasse${teurer.length === 1 ? '' : 'n'} teurer`}; bundesweit wählbar.`,
    title: 'KNAPPSCHAFT Zusatzbeitrag 2027: Beitrag und Alternativen',
    description: `KNAPPSCHAFT Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Was Beschäftigte und Rentner im Monat zahlen, was ein Wechsel bringt und was für 2027 bisher bekannt ist, in Euro.`,
    h1: 'KNAPPSCHAFT: Zusatzbeitrag, Beitrag und was ein Wechsel bringt',
    intro: `Die KNAPPSCHAFT verlangt ${DE.pk(p.zb)}, ${DE.num(p.zb - median, 2)} Punkte über dem Median aller frei wählbaren Kassen; bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie ${DE.eur(p.lohn)} im Monat.`,
    resume: `Die KNAPPSCHAFT ist die Krankenkasse der Deutschen Rentenversicherung Knappschaft-Bahn-See, die auch die Minijob-Zentrale betreibt. Sie bildet eine eigene Kassenart, ist aber heute für jeden bundesweit wählbar. Laut Liste des GKV-Spitzenverbands erhebt sie einen Zusatzbeitrag von ${DE.pk(p.zb)}; ${teurer.length === 0 ? 'keine frei wählbare Kasse ist teurer' : `nur ${teurer.length} frei wählbare Kasse${teurer.length === 1 ? ' ist' : 'n sind'} teurer`}, und der amtliche Durchschnitt von ${DE.pz(w.zb_durchschnitt)} wird um ${DE.num(p.zb - w.zb_durchschnitt, 2)} Punkte überschritten. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlen Beschäftigte ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung. Bei der günstigsten frei wählbaren Kasse, ${p.billigste.kurz}, wären es ${DE.eur(p.proJahrVsBilligste)} im Jahr weniger, an der Beitragsbemessungsgrenze ${DE.eur(p.proJahrVsBilligsteBbg)}. Rentner sparen die Hälfte davon, weil die Rentenversicherung die Hälfte des Zusatzbeitrags trägt. Wer bei der KNAPPSCHAFT bleibt, hat oft andere Gründe als den Preis; die Rechnung in Euro sollte man trotzdem kennen.`,
    faqs: [
      { q: 'Kann jeder Mitglied der KNAPPSCHAFT werden?', a: 'Ja. Früher war sie Bergleuten und ihren Familien vorbehalten, heute steht sie laut Liste des GKV-Spitzenverbands bundesweit jedem offen, der gesetzlich versichert ist oder wird. Wie bei jeder Kasse darf sie niemanden wegen Alter oder Gesundheit ablehnen. Der Antrag geht direkt an die KNAPPSCHAFT, die den Wechsel an die bisherige Kasse meldet.' },
      { q: 'Wie viel kostet mich die KNAPPSCHAFT im Vergleich zur günstigsten Kasse?', a: `Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind ${DE.eur(p.proJahrVsBilligste)} im Jahr mehr als bei ${p.billigste.kurz} (${DE.pk(p.billigste.zb!)}), wenn diese in Ihrem Land wählbar ist. Bei ${DE.eur(BEISPIEL.lohnNiedrig)} brutto ist der Abstand kleiner, an der Beitragsbemessungsgrenze mit ${DE.eur(p.proJahrVsBilligsteBbg)} am größten. Der Rechner oben zeigt die Rangliste Ihres Landes.` },
      { q: 'Ich bin Rentner bei der KNAPPSCHAFT. Lohnt sich ein Wechsel?', a: `Bei ${DE.eur(1600)} Rente zahlen Sie dort ${DE.eur(renten[1].k)} im Monat, bei ${p.billigste.kurz} ${DE.eur(renten[1].b)}; das sind ${DE.eur(Math.round((renten[1].k - renten[1].b) * 12))} im Jahr. Die Rentenversicherung zieht den neuen Satz zwei Monate nach Beginn der neuen Mitgliedschaft ab. Prüfen Sie vorher, ob Sie Leistungen nutzen, die nur die KNAPPSCHAFT in ihrer Satzung anbietet.` },
      { q: 'Erhöht die KNAPPSCHAFT 2027?', a: `Das entscheidet ihr Verwaltungsrat, in der Regel im Dezember; die amtliche Liste zeigt den neuen Satz am Tag, an dem er gilt. Der Schätzerkreis hat für 2027 einen rechnerischen Durchschnitt von ${DE.pz(J(2027).zb_durchschnitt)} ermittelt. Erhöht die KNAPPSCHAFT, können Mitglieder auch während der zwölf Monate Bindung wechseln.` },
    ],
    body: (h) => `
<h2>Eine Kasse mit eigener Geschichte</h2>
<p>Die KNAPPSCHAFT ist keine AOK, keine Ersatzkasse und keine Betriebskrankenkasse, sondern eine Kassenart für sich. Ihr Träger, die Deutsche Rentenversicherung Knappschaft-Bahn-See, führt außerdem die knappschaftliche Rentenversicherung und die Minijob-Zentrale. Für Ihren Beitrag spielt das keine Rolle: Allgemeiner Satz, Beitragsbemessungsgrenze und Pflegebeitrag sind dieselben wie überall, nur der Zusatzbeitrag von ${h.pk(p.zb)} ist ihr eigener.${gleich.length ? ` Denselben Satz verlangen ${gleich.map((k) => kLink(h, k)).join(', ')}.` : ''}</p>
<h2>Was der hohe Satz im Alltag bedeutet</h2>
<p>Ein Satz im oberen Teil der Liste heißt nicht, dass die KNAPPSCHAFT andere Leistungen bezahlt: Arztbesuch, Krankenhaus, Arzneimittel und Krankengeld sind im SGB V für alle Kassen gleich geregelt. Der höhere Zusatzbeitrag spiegelt die Ausgaben und Rücklagen der Kasse wider, nicht ein größeres Paket. Wer überlegt zu gehen, sollte deshalb zwei Fragen beantworten: Wie viel Euro im Jahr macht der Unterschied bei meinem Einkommen aus, und nutze ich eine Satzungsleistung oder ein Programm, das ich bei der neuen Kasse nicht hätte? Die erste Frage beantwortet der Rechner oben, die zweite nur die Satzung der Kasse. Wer chronisch krank ist, klärt laufende Genehmigungen für Hilfsmittel oder Therapien am besten vor dem Wechsel mit der neuen Kasse.</p>
<h2>Rente und Zusatzbeitrag</h2>
${h.table(['Rente brutto', 'bei der KNAPPSCHAFT', `bei ${p.billigste.kurz}`, 'Unterschied im Jahr'], renten.map((x) => [h.eur(x.r), h.eur(x.k), h.eur(x.b), h.eur(Math.round((x.k - x.b) * 12))]), '2026, Kranken- und Pflegeversicherung, mit Kind', ['r', 'r', 'r', 'r'])}
<p>Bei Rentnern trägt die Rentenversicherung die Hälfte des Zusatzbeitrags; deshalb fällt der Unterschied halb so groß aus wie bei Selbstständigen und genauso groß wie bei Beschäftigten mit gleichem Einkommen. Eine Betriebsrente zahlt den vollen Satz allein; dort wirkt der höhere Zusatzbeitrag doppelt (${h.a('krankenkassenbeitrag-rentner', 'Beitrag für Rentner')}).</p>
<h2>Beschäftigte und Selbstständige</h2>
${h.table(['Lage', 'Grundlage', 'Ihr Anteil im Monat'], [
  ['Beschäftigt', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Beschäftigt', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Beschäftigt an der Grenze', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Selbstständig, ohne Krankengeld', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studium', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, ein Kind; Studium unter 23', ['l', 'r', 'r'])}
<p>Wer wechseln möchte, findet die Fristen im ${h.a('krankenkasse-wechseln', 'Wechsel-Rechner')}; bei einer Erhöhung gilt das ${h.a('sonderkuendigungsrecht', 'Sonderkündigungsrecht')}. Alle Sätze stehen in der ${h.a('zusatzbeitrag-liste', 'vollständigen Liste')}.</p>`,
  },
  en: {
    slug: 'knappschaft-additional-contribution',
    nav: 'KNAPPSCHAFT',
    card: `${EN.pk(p.zb)} additional rate, ${teurer.length === 0 ? 'the highest' : `${teurer.length} fund${teurer.length === 1 ? '' : 's'} dearer`}; open nationwide.`,
    title: 'KNAPPSCHAFT Additional Contribution 2027: Cost, Options',
    description: `KNAPPSCHAFT additional rate in 2026: ${EN.pk(p.zb)}. What employees and pensioners pay each month, what switching would save, and what is known so far about 2027.`,
    h1: 'KNAPPSCHAFT: additional rate, cost and what switching saves',
    intro: `KNAPPSCHAFT charges ${EN.pk(p.zb)}, ${EN.num(p.zb - median, 2)} points above the median of all open funds; on ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohn)} a month.`,
    resume: `KNAPPSCHAFT is the health fund of the German pension insurance body Knappschaft-Bahn-See, which also runs the Minijob-Zentrale. It forms a type of fund of its own but today anyone in Germany can join it. According to the GKV-Spitzenverband list it charges an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)}; ${teurer.length === 0 ? 'no open fund is dearer' : `only ${teurer.length} open fund${teurer.length === 1 ? ' is' : 's are'} dearer`}, and it is ${EN.num(p.zb - w.zb_durchschnitt, 2)} points above the official average of ${EN.pz(w.zb_durchschnitt)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child, employees pay ${EN.eur(p.lohn)} a month for health and care insurance. At the cheapest open fund, ${p.billigste.kurz}, it would be ${EN.eur(p.proJahrVsBilligste)} a year less, and ${EN.eur(p.proJahrVsBilligsteBbg)} at the contribution ceiling. Pensioners save half of that, because the pension insurance pays half the additional rate. Members often stay for reasons other than price, but it is worth knowing the sum in euros.`,
    faqs: [
      { q: 'Can anyone join KNAPPSCHAFT?', a: 'Yes. It used to be reserved for miners and their families; today, according to the GKV-Spitzenverband list, it is open nationwide to anyone who is or becomes statutorily insured. Like every fund, it may not refuse anyone because of age or health. You apply directly to KNAPPSCHAFT, which informs your current fund of the switch.' },
      { q: 'How much more does KNAPPSCHAFT cost than the cheapest fund?', a: `On ${EN.eur(BEISPIEL.lohn)} gross with one child, ${EN.eur(p.proJahrVsBilligste)} a year more than ${p.billigste.kurz} (${EN.pk(p.billigste.zb!)}), if that fund is open in your state. On ${EN.eur(BEISPIEL.lohnNiedrig)} gross the gap is smaller, and largest at the contribution ceiling with ${EN.eur(p.proJahrVsBilligsteBbg)}. The calculator above shows the ranking for your state.` },
      { q: 'I am a pensioner with KNAPPSCHAFT. Is switching worth it?', a: `On a ${EN.eur(1600)} pension you pay ${EN.eur(renten[1].k)} a month there and ${EN.eur(renten[1].b)} at ${p.billigste.kurz}; that is ${EN.eur(Math.round((renten[1].k - renten[1].b) * 12))} a year. The pension insurance deducts the new rate two months after the new membership starts. Check first whether you use benefits that only KNAPPSCHAFT offers in its statutes.` },
      { q: 'Will KNAPPSCHAFT raise its rate in 2027?', a: `Its board decides, usually in December, and the official list shows the new rate on the day it applies. The estimating group arrived at an arithmetic average of ${EN.pz(J(2027).zb_durchschnitt)} for 2027. If KNAPPSCHAFT raises its rate, members can switch even during the twelve-month lock-in.` },
    ],
    body: (h) => `
<h2>A fund with its own history</h2>
<p>KNAPPSCHAFT is not an AOK, a substitute fund or a company fund but a type of fund of its own. Its parent body, Deutsche Rentenversicherung Knappschaft-Bahn-See, also runs the miners’ pension insurance and the Minijob-Zentrale. None of this changes your contribution: the general rate, the contribution ceiling and the care contribution are the same as everywhere, and only the additional rate of ${h.pk(p.zb)} is its own.${gleich.length ? ` The same rate is charged by ${gleich.map((k) => kLink(h, k)).join(', ')}.` : ''}</p>
<h2>What the higher rate means in practice</h2>
<p>A rate near the top of the list does not mean KNAPPSCHAFT pays for different care: doctors, hospital, medicines and sick pay are set out in Book V of the Social Code identically for every fund. The higher additional rate reflects the fund’s spending and reserves, not a bigger package. If you are thinking of leaving, answer two questions: how many euros a year does the gap make on my income, and do I use an extra benefit or programme that the new fund would not offer? The calculator above answers the first, only the fund’s statutes the second.</p>
<h2>Pensions and the additional rate</h2>
${h.table(['Gross pension', 'at KNAPPSCHAFT', `at ${p.billigste.kurz}`, 'Gap a year'], renten.map((x) => [h.eur(x.r), h.eur(x.k), h.eur(x.b), h.eur(Math.round((x.k - x.b) * 12))]), '2026, health and care insurance, with a child', ['r', 'r', 'r', 'r'])}
<p>For pensioners the pension insurance pays half the additional rate, so the gap is half what the self-employed see and the same as for employees on the same income. A company pension pays the full rate alone, so there the higher additional rate counts twice (${h.a('krankenkassenbeitrag-rentner', 'contributions for pensioners')}).</p>
<h2>Employees and the self-employed</h2>
${h.table(['Situation', 'Base', 'Your share a month'], [
  ['Employee', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employee', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employee at the ceiling', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Self-employed, no sick pay', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, one child; student under 23', ['l', 'r', 'r'])}
<p>If you want to switch, the deadlines are in the ${h.a('krankenkasse-wechseln', 'switching calculator')}; after a rate rise the ${h.a('sonderkuendigungsrecht', 'special termination right')} applies. Every rate is in the ${h.a('zusatzbeitrag-liste', 'full list')}.</p>`,
  },
});
