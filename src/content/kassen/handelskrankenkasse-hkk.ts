import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { KASSEN, offen, LAND_NAME } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** hkk: bundesweit geöffnete Ersatzkasse mit niedrigem Satz; welche Kassen davor liegen und ob sie überall wählbar sind. */
const ID = 'handelskrankenkasse-hkk';
const p = profil(ID);
const w = J(2026);
const me = kostenZeile(p.k);
const davor = offen().filter((k) => k.zb! < p.zb);
const davorBund = davor.filter((k) => k.art === 'bundesweit');
const davorRegional = davor.filter((k) => k.art !== 'bundesweit');
const eks = KASSEN.filter((k) => k.kassenart === 'EK' && k.zb !== null).sort((a, b) => a.zb! - b.zb!);
const billigsteEk = eks[0].id === ID;
const bestLand = [...p.raengeLand].sort((a, b) => a.rang - b.rang);
const besteRaenge = bestLand.filter((r) => r.rang === bestLand[0].rang).map((r) => r.l);
const j = (x: { lohn: number }) => Math.round((x.lohn - me.lohn) * 12);
const tab = [me, ...davor.map(kostenZeile)].sort((a, b) => a.k.zb! - b.k.zb!);

export default defineGuide({
  id: ID,
  group: 'kassen',
  order: 23,
  kasse: ID,
  tool: 'beitrag',
  toolPreset: { kasse: ID },
  related: ['techniker-krankenkasse', 'bkk-firmus', 'beste-krankenkasse', 'zusatzbeitrag-liste'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_175', 'sgb5_242a'],
  de: {
    slug: 'hkk-zusatzbeitrag',
    nav: 'hkk',
    card: `${DE.pk(p.zb)} Zusatzbeitrag, bundesweit wählbar; ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} im Jahr unter dem Durchschnittssatz bei ${DE.eur(BEISPIEL.lohn)} brutto.`,
    title: 'hkk Zusatzbeitrag 2027: Beitrag und Abstand zur Spitze',
    description: `hkk Handelskrankenkasse, Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Monatsbeitrag, welche Kassen noch günstiger sind und ob diese überall wählbar sind, Ausblick auf 2027.`,
    h1: 'hkk: Zusatzbeitrag und wer noch günstiger ist',
    intro: `Die hkk verlangt ${DE.pk(p.zb)}; nur ${davor.length} frei wählbare Kassen haben einen niedrigeren Satz, ${davorBund.length} davon bundesweit.`,
    resume: `Die Handelskrankenkasse, kurz hkk, ist eine Ersatzkasse und laut Liste des GKV-Spitzenverbands in allen Ländern wählbar. Mit ${DE.pk(p.zb)} Zusatzbeitrag gehört sie zu den günstigsten Kassen überhaupt: Nur ${davor.length} der ${p.nBund} frei wählbaren Kassen verlangen weniger, und von diesen ${davorRegional.length === 0 ? 'sind alle bundesweit geöffnet' : `${davorRegional.length === 1 ? 'ist eine' : `sind ${davorRegional.length}`} nur regional geöffnet`}. ${billigsteEk ? 'Unter den Ersatzkassen hat sie den niedrigsten Satz.' : `Unter den Ersatzkassen liegt ${eks[0].kurz} vor ihr.`} Ein Beschäftigter mit ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlt bei der hkk ${DE.eur(p.lohn)} im Monat für Kranken- und Pflegeversicherung, ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} im Jahr ${p.unterDurchschnitt ? 'weniger' : 'mehr'} als zum amtlichen Durchschnittssatz von ${DE.pz(w.zb_durchschnitt)}. Zur günstigsten Kasse, ${p.billigste.kurz}, fehlen bei diesem Lohn ${DE.eur(p.proJahrVsBilligste)} im Jahr. In ${besteRaenge.map((l) => LAND_NAME[l].de).join(', ')} steht die hkk in der Rangliste der wählbaren Kassen auf Platz ${bestLand[0].rang}, weil dort weniger regionale Kassen geöffnet sind.`,
    faqs: [
      { q: 'Ist die hkk die günstigste Krankenkasse?', a: `Nicht ganz. ${davor.length} frei wählbare Kassen haben einen niedrigeren Zusatzbeitrag, an der Spitze ${p.billigste.kurz} mit ${DE.pk(p.billigste.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie dort ${DE.eur(p.proJahrVsBilligste)} im Jahr weniger als bei der hkk. ${davorRegional.length ? 'Einige der günstigeren Kassen sind aber nicht in jedem Land wählbar.' : 'Alle günstigeren Kassen sind bundesweit wählbar.'}` },
      { q: 'Kann ich die hkk wählen, wenn ich ins Ausland ziehe oder oft umziehe?', a: `Innerhalb Deutschlands spielt der Wohnort für die hkk keine Rolle, weil sie in allen Ländern geöffnet ist; ein Umzug ändert nichts an der Mitgliedschaft. Wer ins Ausland zieht und dort arbeitet, ist meist dort versichert. Über eine Fortsetzung der Mitgliedschaft entscheidet dann das jeweilige Sozialversicherungsabkommen, nicht die Kasse.` },
      { q: 'Wie viel spare ich mit der hkk gegenüber der BARMER?', a: (() => { const b = KASSEN.find((k) => k.id === 'barmer')!; const x = kostenZeile(b); return `Die BARMER verlangt ${DE.pk(b.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie bei der hkk ${DE.eur(Math.abs(j(x)))} im Jahr ${j(x) > 0 ? 'weniger' : 'mehr'}, an der Bemessungsgrenze entsprechend mehr. Rentner mit ${DE.eur(BEISPIEL.rente)} Rente zahlen bei der hkk ${DE.eur(p.rente)} im Monat, weil die Rentenversicherung die Hälfte der Krankenversicherung trägt.`; })() },
      { q: 'Was kostet die hkk Studierende?', a: `${DE.eur(p.student)} im Monat unter 23 oder mit Kind, auf den gesetzlichen BAföG-Bedarf von ${DE.eur(w.bafoeg_bedarf)}. Weil die Grundlage bei allen Kassen gleich ist, unterscheidet sich nur der Zusatzbeitrag; zwischen der hkk und einer Kasse mit vier Prozent liegen für Studierende nur wenige Euro im Monat.` },
    ],
    body: (h) => `
<h2>Wer vor der hkk liegt, und wo man es wählen kann</h2>
<p>Ein niedriger Satz nützt nur, wenn man die Kasse auch wählen darf. Regional geöffnete Kassen stehen nur Menschen offen, die in einem bestimmten Land wohnen oder arbeiten; die hkk dagegen ist überall wählbar. Die Tabelle zeigt alle frei wählbaren Kassen mit einem niedrigeren Satz als die hkk und wo sie geöffnet sind.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'geöffnet', 'Ihr Beitrag im Monat', 'gegenüber hkk im Jahr'], tab.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`, h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'l', 'r', 'r'])}
<h2>Der hkk-Beitrag für verschiedene Gruppen</h2>
${h.table(['Gruppe', 'Bemessung', 'Ihr Anteil im Monat'], [
  ['Beschäftigt', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Beschäftigt', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Beschäftigt, Höchstbeitrag', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig ohne Krankengeld', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studium, unter 23', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, ein Kind', ['l', 'r', 'r'])}
<p>Wer heute bei einer Kasse mit hohem Satz ist, spart mit der hkk spürbar; wer schon bei einer günstigen Kasse ist, gewinnt mit einem weiteren Wechsel kaum noch etwas. Von der hkk zur günstigsten Kasse bleiben bei ${h.eur(BEISPIEL.lohn)} brutto ${h.eur(p.proJahrVsBilligste)} im Jahr, an der Bemessungsgrenze ${h.eur(p.proJahrVsBilligsteBbg)}. Für Selbstständige verdoppelt sich der Abstand, weil sie den Zusatzbeitrag ganz tragen. Für Rentner halbiert er sich ungefähr, weil die Rentenversicherung die Hälfte übernimmt und die Rente meist unter dem Gehalt liegt. Wie man über den Preis hinaus vergleicht, steht unter ${h.a('beste-krankenkasse', 'die beste Krankenkasse finden')}.</p>
<h2>2027: abwarten oder jetzt wechseln?</h2>
<p>Die Kassen beschließen ihre Sätze für 2027 im Dezember, und in der amtlichen Liste erscheinen sie erst am Tag ihrer Gültigkeit. Wer jetzt zur hkk wechselt, ist ab dem übernächsten Monat Mitglied und zwölf Monate gebunden, außer die hkk erhöht ihren Satz. Wer abwartet, verliert nichts, wenn die eigene Kasse zum Januar erhöht: Dann gilt das Sonderkündigungsrecht. Den Termin rechnet der ${h.a('krankenkasse-wechseln', 'Fristenrechner')}. Beschäftigte nennen dem Arbeitgeber danach die neue Kasse; Rentner und familienversicherte Angehörige müssen nichts weiter tun, die Kassen regeln die Meldungen untereinander.</p>`,
  },
  en: {
    slug: 'hkk-additional-contribution',
    nav: 'hkk',
    card: `${EN.pk(p.zb)} additional rate, open nationwide; ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} a year below the average rate on ${EN.eur(BEISPIEL.lohn)} gross.`,
    title: 'hkk Additional Contribution 2027: Cost, Gap to the Top',
    description: `hkk Handelskrankenkasse additional rate in 2026: ${EN.pk(p.zb)}. Monthly cost, which funds are cheaper still and whether you can join them everywhere, 2027 outlook.`,
    h1: 'hkk: additional rate and who is cheaper still',
    intro: `hkk charges ${EN.pk(p.zb)}; only ${davor.length} open funds have a lower rate, ${davorBund.length} of them nationwide.`,
    resume: `Handelskrankenkasse, known as hkk, is a substitute fund (Ersatzkasse) that the GKV-Spitzenverband list shows as open in every state. With an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)} it is among the cheapest funds of all: only ${davor.length} of the ${p.nBund} funds open to everyone charge less, and of those ${davorRegional.length === 0 ? 'all are open nationwide' : `${davorRegional.length === 1 ? 'one is' : `${davorRegional.length} are`} open only regionally`}. ${billigsteEk ? 'Among the substitute funds it has the lowest rate.' : `Among the substitute funds, ${eks[0].kurz} is ahead of it.`} An employee on ${EN.eur(BEISPIEL.lohn)} gross with one child pays ${EN.eur(p.lohn)} a month at hkk for health and care insurance, ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} a year ${p.unterDurchschnitt ? 'less' : 'more'} than at the official average rate of ${EN.pz(w.zb_durchschnitt)}. The cheapest fund, ${p.billigste.kurz}, would cost another ${EN.eur(p.proJahrVsBilligste)} a year less at that pay. In ${besteRaenge.map((l) => LAND_NAME[l].en).join(', ')} hkk ranks ${bestLand[0].rang} among the funds open to the public, because fewer regional funds are open there.`,
    faqs: [
      { q: 'Is hkk the cheapest health fund?', a: `Not quite. ${davor.length} open funds have a lower additional rate, led by ${p.billigste.kurz} at ${EN.pk(p.billigste.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.proJahrVsBilligste)} a year less there than at hkk. ${davorRegional.length ? 'Some of the cheaper funds, however, cannot be joined in every state.' : 'All the cheaper funds are open nationwide.'}` },
      { q: 'Can I keep hkk if I move a lot or go abroad?', a: `Within Germany your address does not matter for hkk, because it is open in every state; moving house leaves membership untouched. If you move abroad and work there, you are usually insured there. Whether membership can continue then depends on the relevant social security agreement, not on the fund.` },
      { q: 'How much do I save with hkk compared with BARMER?', a: (() => { const b = KASSEN.find((k) => k.id === 'barmer')!; const x = kostenZeile(b); return `BARMER charges ${EN.pk(b.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(Math.abs(j(x)))} a year ${j(x) > 0 ? 'less' : 'more'} at hkk, and correspondingly more at the ceiling. Pensioners on a ${EN.eur(BEISPIEL.rente)} pension pay ${EN.eur(p.rente)} a month at hkk, since the pension insurance covers half of their health contribution.`; })() },
      { q: 'What does hkk cost students?', a: `${EN.eur(p.student)} a month if under 23 or with a child, on the statutory BAföG need rate of ${EN.eur(w.bafoeg_bedarf)}. Since the base is the same at every fund, only the additional rate differs; between hkk and a fund charging four percent, students are only a few euros a month apart.` },
    ],
    body: (h) => `
<h2>Who is ahead of hkk, and where you can join them</h2>
<p>A low rate only helps if you are allowed to join. Regionally open funds accept only people living or working in certain states; hkk, by contrast, can be chosen anywhere. The table lists every open fund with a lower rate than hkk and where it is open.</p>
${h.table(['Fund', 'Additional rate', 'open in', 'You pay a month', 'vs hkk a year'], tab.map((x) => [x.k.id === ID ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`, h.eur(x.lohn), x.k.id === ID ? '·' : `${x.lohn > me.lohn ? '+' : '−'}${h.eur(Math.abs(j(x)))}`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'l', 'r', 'r'])}
<h2>hkk cost for different groups</h2>
${h.table(['Group', 'Base', 'Your share a month'], [
  ['Employed', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employed', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employed, maximum', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Retired', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed, no sick pay', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student under 23', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, one child', ['l', 'r', 'r'])}
<p>If you are at a fund with a high rate today, hkk saves you a noticeable amount; if you are already at a cheap fund, another switch gains you almost nothing. From hkk to the cheapest fund, ${h.eur(p.proJahrVsBilligste)} a year remains on ${h.eur(BEISPIEL.lohn)} gross, ${h.eur(p.proJahrVsBilligsteBbg)} at the ceiling. For the self-employed the gap doubles, because they carry the whole additional rate. For pensioners it roughly halves, since the pension insurance pays half and pensions are usually below salaries. How to compare beyond price is covered under ${h.a('beste-krankenkasse', 'finding the best health fund')}.</p>
<h2>2027: wait or switch now?</h2>
<p>Funds set their 2027 rates in December, and the official list shows them only from the day they apply. Switch to hkk now and you are a member from the month after next, tied for twelve months unless hkk raises its rate. Wait, and you lose nothing if your own fund raises its rate in January: the special termination right applies then. The ${h.a('krankenkasse-wechseln', 'deadline calculator')} works out the date. Employees then give their employer the new fund’s name; pensioners and family members covered free of charge need do nothing more, as the funds handle the notifications between themselves.</p>`,
  },
});
