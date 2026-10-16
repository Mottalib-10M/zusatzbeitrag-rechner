import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { kasse, KASSEN } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** AOK NordWest: Westfalen-Lippe und Schleswig-Holstein. In NRW teilt sie sich das Land mit der AOK Rheinland/Hamburg. */
const ID = 'aok-nordwest-die-gesundheitskasse';
const p = profil(ID);
const w = J(2026);
const rh = kostenZeile(kasse('aok-rheinland-hamburg-die-gesundheitskasse'));
const me = kostenZeile(p.k);
const vsRh = Math.round((rh.lohn - me.lohn) * 12);
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < p.zb).length + 1;
const rNW = p.raengeLand.find((r) => r.l === 'NW')!, rSH = p.raengeLand.find((r) => r.l === 'SH')!;
const relDe = rh.k.zb! > p.zb ? 'teurer' : rh.k.zb! < p.zb ? 'günstiger' : 'gleich teuer';
const relEn = rh.k.zb! > p.zb ? 'dearer' : rh.k.zb! < p.zb ? 'cheaper' : 'the same price';
const nordAok = ['aok-die-gesundheitskasse-fur-niedersachsen', 'aok-bremen-bremerhaven', 'aok-rheinland-hamburg-die-gesundheitskasse'].map((id) => kostenZeile(kasse(id)));
const tab = [me, ...nordAok].sort((a, b) => a.k.zb! - b.k.zb!);
const d = (x: { lohn: number }) => Math.round((x.lohn - p.lohn) * 12);
const ordEn = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 16,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID, land: 'NW' },
  related: ['aok-rheinland-hamburg-die-gesundheitskasse', 'zusatzbeitrag-liste', 'krankenkasse-wechseln', 'techniker-krankenkasse'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_175', 'sgb5_247'],
  de: {
    slug: 'aok-nordwest-zusatzbeitrag',
    nav: 'AOK NordWest',
    card: `${DE.pk(p.zb)} Zusatzbeitrag in Westfalen-Lippe und Schleswig-Holstein; die AOK Rheinland/Hamburg ist ${relDe}.`,
    title: 'AOK NordWest Zusatzbeitrag 2027: Westfalen und Norden',
    description: `AOK NordWest, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Beitrag in Westfalen-Lippe und Schleswig-Holstein, Unterschied zur AOK Rheinland/Hamburg und den Nachbar-AOKs.`,
    h1: 'AOK NordWest: Zusatzbeitrag zwischen Münsterland und Ostsee',
    intro: `Die AOK NordWest verlangt ${DE.pk(p.zb)}; bei ${DE.eur(BEISPIEL.lohn)} brutto sind das ${DE.eur(p.lohn)} im Monat für Ihren Anteil an Kranken- und Pflegeversicherung.`,
    resume: `Die AOK NordWest ist die Ortskrankenkasse für Westfalen-Lippe und Schleswig-Holstein, zwei Regionen ohne gemeinsame Grenze. In der Liste des GKV-Spitzenverbands erscheint sie mit ${DE.pk(p.zb)} Zusatzbeitrag und geöffnet für Nordrhein-Westfalen und Schleswig-Holstein, denn die Liste unterscheidet nicht nach Landesteilen. Nordrhein-Westfalen hat damit zwei AOKs: Im Rheinland ist die AOK Rheinland/Hamburg zuständig, die mit ${DE.pk(rh.k.zb!)} ${relDe} ist; bei ${DE.eur(BEISPIEL.lohn)} brutto liegen ${DE.eur(Math.abs(vsRh))} im Jahr dazwischen. Ein Beschäftigter mit diesem Gehalt und einem Kind zahlt bei der AOK NordWest ${DE.eur(p.lohn)} im Monat, ein Rentner mit ${DE.eur(BEISPIEL.rente)} ${DE.eur(p.rente)}. Unter den ${aoks.length} AOKs hat sie den ${aokPlatz}. niedrigsten Satz; in Nordrhein-Westfalen sind ${rNW.rang - 1} wählbare Kassen günstiger, in Schleswig-Holstein ${rSH.rang - 1}. Zum amtlichen Durchschnittssatz von ${DE.pz(w.zb_durchschnitt)} beträgt der Abstand bei diesem Lohn ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} im Jahr.`,
    faqs: [
      { q: 'Bin ich in Köln oder Düsseldorf bei der AOK NordWest richtig?', a: `Für die Ortskrankenkasse ist im Rheinland die AOK Rheinland/Hamburg zuständig, in Westfalen-Lippe die AOK NordWest. Die amtliche Liste führt beide als für Nordrhein-Westfalen geöffnet; welche Ortskrankenkasse Sie konkret aufnimmt, richtet sich nach ihrem Bezirk. Bei allen bundesweit geöffneten Kassen spielt der Landesteil keine Rolle.` },
      { q: 'Was zahle ich bei der AOK NordWest in Schleswig-Holstein?', a: `Denselben Satz wie in Westfalen: ${DE.pk(p.zb)} Zusatzbeitrag, bei ${DE.eur(BEISPIEL.lohnNiedrig)} brutto mit einem Kind ${DE.eur(p.lohnNiedrig)} im Monat. In Schleswig-Holstein stehen ${rSH.n} Kassen zur Wahl; die AOK NordWest liegt dort auf Rang ${rSH.rang}. Pflege teilen Beschäftigte und Arbeitgeber hälftig, wie überall außer in Sachsen.` },
      { q: 'Wann zieht die Rentenversicherung eine neue AOK-NordWest-Rate von der Rente ab?', a: `Erst ab dem ersten Tag des zweiten Monats nach der Änderung (§ 247 Satz 3 SGB V). Eine Erhöhung zum Januar erscheint also ab März auf der Rentenabrechnung, eine Senkung ebenso. Bei ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente beträgt Ihr Anteil heute ${DE.eur(p.rente)} im Monat, Pflege eingeschlossen.` },
      { q: 'Wie viel spart ein Wechsel von der AOK NordWest zur günstigsten Kasse?', a: `Bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(p.proJahrVsBilligste)} im Jahr, wenn Sie zu ${p.billigste.kurz} gehen, sofern diese in Ihrem Land geöffnet ist. Selbstständige sparen mehr, weil sie den Zusatzbeitrag allein tragen. Die tatsächlich wählbaren Kassen für Ihr Land zeigt der Rechner oben in der Rangliste.` },
    ],
    body: (h) => `
<h2>Westfalen-Lippe und Schleswig-Holstein: ein ungewöhnliches Gebiet</h2>
<p>Zwischen dem Sauerland und Flensburg liegen Niedersachsen, Bremen und Hamburg mit eigenen Ortskrankenkassen. Die AOK NordWest verbindet trotzdem beide Regionen und erhebt in beiden denselben Satz. Für Mitglieder heißt das zweierlei: Ein Umzug von Bielefeld nach Kiel ändert nichts an der Kasse, ein Umzug von Dortmund nach Bonn aber führt ins Gebiet der AOK Rheinland/Hamburg. Die Mitgliedschaft endet dadurch nicht; sie können bleiben, bis Sie selbst wechseln.</p>
${h.table(['AOK im Norden', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber AOK NordWest im Jahr'], tab.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'r'])}
<h2>Beitrag bei der AOK NordWest</h2>
${h.table(['Versichert als', 'Grundlage', 'Ihr Anteil im Monat'], [
  ['Beschäftigt', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Beschäftigt', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Beschäftigt, Höchstbetrag', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studium', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, ein Kind; selbstständig ohne Krankengeld, Studium unter 23', ['l', 'r', 'r'])}
<p>Nordrhein-Westfalen ist das Land mit den meisten wählbaren Kassen: ${rNW.n} stehen jedem offen, ${rNW.rang - 1} davon günstiger als die AOK NordWest. Die Rangliste in Euro für Nordrhein-Westfalen und für Schleswig-Holstein, mit allen dort geöffneten Kassen, steht in der ${h.a('zusatzbeitrag-liste', 'Tabelle nach Bundesland')}.</p>
<h2>Wechsel in beide Richtungen</h2>
<p>Ein Wechsel zur AOK NordWest setzt einen Wohnsitz oder Arbeitsplatz in ihrem Gebiet voraus; weg von ihr geht es zu jeder Kasse, die in Ihrem Land geöffnet ist. Die neue Mitgliedschaft beginnt am Ersten des dritten Monats nach Ihrem Antrag, wenn Sie zwölf Monate Mitglied waren oder die Kasse erhöht hat. Familienversicherte Angehörige ziehen mit um.</p>
<p>Wer bei der AOK NordWest selbstständig versichert ist, merkt einen Wechsel am stärksten: Ohne Arbeitgeber trägt er den Zusatzbeitrag ganz, bei ${h.eur(BEISPIEL.gewinn)} Gewinn zahlt er heute ${h.eur(p.selbst)} im Monat. Studierende dagegen zahlen auf den festen BAföG-Bedarf von ${h.eur(w.bafoeg_bedarf)} und sparen mit einem Wechsel nur wenige Euro im Jahr. Für Beschäftigte, die über der Versicherungspflichtgrenze verdienen und freiwillig gesetzlich bleiben, gilt der Höchstbeitrag von ${h.eur(p.lohnBbg)}; der Arbeitgeberzuschuss deckt dieselbe Hälfte wie bei Pflichtversicherten.</p>`,
  },
  en: {
    slug: 'aok-nordwest-additional-contribution',
    nav: 'AOK NordWest',
    card: `${EN.pk(p.zb)} additional rate in Westphalia-Lippe and Schleswig-Holstein; AOK Rheinland/Hamburg is ${relEn}.`,
    title: 'AOK NordWest Additional Contribution 2027: Westphalia, North',
    description: `AOK NordWest additional rate in 2026: ${EN.pk(p.zb)}. Cost in Westphalia-Lippe and Schleswig-Holstein, the gap to AOK Rheinland/Hamburg and the neighbouring AOKs.`,
    h1: 'AOK NordWest: additional rate from Münsterland to the Baltic',
    intro: `AOK NordWest charges ${EN.pk(p.zb)}; on ${EN.eur(BEISPIEL.lohn)} gross your share of health and care insurance is ${EN.eur(p.lohn)} a month.`,
    resume: `AOK NordWest is the regional health fund (Allgemeine Ortskrankenkasse) for Westphalia-Lippe and Schleswig-Holstein, two regions that do not share a border. The GKV-Spitzenverband list shows it with an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)} and open in North Rhine-Westphalia and Schleswig-Holstein, because the list does not split states into regions. North Rhine-Westphalia therefore has two AOKs: in the Rhineland the competent one is AOK Rheinland/Hamburg, which is ${relEn} at ${EN.pk(rh.k.zb!)}; on ${EN.eur(BEISPIEL.lohn)} gross the gap is ${EN.eur(Math.abs(vsRh))} a year. An employee on that salary with one child pays ${EN.eur(p.lohn)} a month at AOK NordWest, a pensioner on ${EN.eur(BEISPIEL.rente)} pays ${EN.eur(p.rente)}. It has the ${ordEn(aokPlatz)} lowest rate of the ${aoks.length} AOKs; in North Rhine-Westphalia ${rNW.rang - 1} open funds are cheaper, in Schleswig-Holstein ${rSH.rang - 1}. The gap to the official average of ${EN.pz(w.zb_durchschnitt)} is ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} a year at that pay.`,
    faqs: [
      { q: 'Is AOK NordWest the right AOK in Cologne or Düsseldorf?', a: `In the Rhineland the regional AOK is AOK Rheinland/Hamburg; in Westphalia-Lippe it is AOK NordWest. The official list shows both as open in North Rhine-Westphalia, and which regional fund takes you depends on its district. For every nationwide fund the part of the state makes no difference at all.` },
      { q: 'What does AOK NordWest cost in Schleswig-Holstein?', a: `The same rate as in Westphalia: ${EN.pk(p.zb)} additional rate, ${EN.eur(p.lohnNiedrig)} a month on ${EN.eur(BEISPIEL.lohnNiedrig)} gross with one child. Schleswig-Holstein offers ${rSH.n} funds; AOK NordWest ranks ${rSH.rang} there. Employees and employers split care insurance equally there, as they do everywhere except Saxony.` },
      { q: 'When is a new AOK NordWest rate deducted from my pension?', a: `Only from the first day of the second month after the change (section 247, sentence 3 SGB V). A January rise therefore appears on the pension statement from March, and a cut likewise. On a ${EN.eur(BEISPIEL.rente)} state pension your share today is ${EN.eur(p.rente)} a month, care included.` },
      { q: 'How much does switching from AOK NordWest to the cheapest fund save?', a: `On ${EN.eur(BEISPIEL.lohn)} gross, ${EN.eur(p.proJahrVsBilligste)} a year if you move to ${p.billigste.kurz}, provided it is open in your state. The self-employed save more because they carry the additional rate alone. The ranking in the calculator above shows which funds are actually open to you.` },
    ],
    body: (h) => `
<h2>Westphalia-Lippe and Schleswig-Holstein: an unusual territory</h2>
<p>Between the Sauerland and Flensburg lie Lower Saxony, Bremen and Hamburg with regional funds of their own. AOK NordWest still links both regions and charges the same rate in each. For members that means two things: moving from Bielefeld to Kiel leaves your fund unchanged, but moving from Dortmund to Bonn takes you into AOK Rheinland/Hamburg territory. Membership does not end because of the move; you can stay until you switch yourself.</p>
${h.table(['Northern AOK', 'Additional rate', 'You pay a month', 'vs AOK NordWest a year'], tab.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(d(x)))}`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'r'])}
<h2>AOK NordWest contributions</h2>
${h.table(['Insured as', 'Base', 'Your share a month'], [
  ['Employee', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employee', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employee, maximum', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Pensioner', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, one child; self-employed without sick pay, student under 23', ['l', 'r', 'r'])}
<p>North Rhine-Westphalia offers more funds than any other state: ${rNW.n} are open to anyone, ${rNW.rang - 1} of them cheaper than AOK NordWest. The ranking in euros for North Rhine-Westphalia and for Schleswig-Holstein is in the ${h.a('zusatzbeitrag-liste', 'table by state')}.</p>
<h2>Switching either way</h2>
<p>Joining AOK NordWest requires a home or workplace in its area; leaving it is possible to any fund open in your state. The new membership starts on the first day of the third month after your application, provided you have been a member for twelve months or the fund has raised its rate. Family members covered free of charge move with you.</p>
<p>Self-employed AOK NordWest members feel a switch most: with no employer they carry the additional rate in full, paying ${h.eur(p.selbst)} a month today on ${h.eur(BEISPIEL.gewinn)} of profit. Students, by contrast, pay on the fixed BAföG need rate of ${h.eur(w.bafoeg_bedarf)} and save only a few euros a year by switching. Employees earning above the compulsory insurance threshold who stay in statutory insurance voluntarily pay the maximum of ${h.eur(p.lohnBbg)}; the employer subsidy covers the same half as for compulsory members.</p>`,
  },
});
