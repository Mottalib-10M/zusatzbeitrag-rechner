import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN, kasse } from '../../lib/engine/kassen';

/** Baden-Württemberg: Rangliste aus der Liste des GKV-Spitzenverbands; AOK, eigene regionale BKKs, geschlossene Betriebskassen. */
const p = landProfil('BW');
const by = landProfil('BY');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const tk = kasse('techniker-krankenkasse');
const nurBw = p.nurHier.filter((k) => k.id !== aok.id);
const geschlossen = KASSEN.filter((k) => k.art === 'betrieblich' && k.zb !== null);
const gMin = Math.min(...geschlossen.map((k) => k.zb!)), gMax = Math.max(...geschlossen.map((k) => k.zb!));
const aokVsTkDe = aok.zb! < tk.zb! ? 'günstiger als die Techniker Krankenkasse' : aok.zb! > tk.zb! ? `teurer als die Techniker Krankenkasse (${DE.pk(tk.zb!)})` : 'gleichauf mit der Techniker Krankenkasse';
const aokVsTkEn = aok.zb! < tk.zb! ? 'cheaper than Techniker Krankenkasse' : aok.zb! > tk.zb! ? `dearer than Techniker Krankenkasse (${EN.pk(tk.zb!)})` : 'level with Techniker Krankenkasse';
const ulm = Math.round((kostenZeile(aok).lohn - kostenZeile(by.aok!).lohn) * 12);

export default defineGuide({
  id: 'guenstigste-krankenkasse-baden-wuerttemberg',
  group: 'laender',
  order: 51,
  land: 'BW',
  tool: 'beitrag',
  toolPreset: { land: 'BW', kasse: 'aok-baden-wurttemberg' },
  related: ['aok-baden-wurttemberg', 'guenstigste-krankenkasse-bayern', 'guenstigste-krankenkasse-hessen', 'guenstigste-krankenkasse-rheinland-pfalz', 'zusatzbeitrag-liste'],
  sources: ['gkvListe', 'gkvListePdf', 'sgb5_175', 'sgb5_242'],
  de: {
    slug: 'guenstigste-krankenkasse-baden-wuerttemberg',
    nav: 'Baden-Württemberg',
    card: `${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; die AOK Baden-Württemberg mit ${DE.pk(aok.zb!)} auf Platz ${p.aokRang}.`,
    title: 'Günstigste Krankenkasse Baden-Württemberg 2027 in Euro',
    description: `Baden-Württemberg 2026/2027: wählbare Krankenkassen ab ${DE.pk(p.billig.zb!)} Zusatzbeitrag, Ihr Beitrag in Euro, die AOK im Vergleich und was für Betriebskrankenkassen gilt.`,
    h1: 'Günstigste Krankenkasse in Baden-Württemberg',
    intro: `Im Südwesten sind ${p.n} Kassen für alle geöffnet, ab ${DE.pk(p.billig.zb!)}; die AOK Baden-Württemberg folgt mit ${DE.pk(aok.zb!)} auf Platz ${p.aokRang}.`,
    resume: `Baden-Württemberg ist ein Land der Betriebskrankenkassen: Neben ${p.n} Kassen, die laut Liste des GKV-Spitzenverbands jedem hier offenstehen, gibt es Betriebskrankenkassen großer Unternehmen, die nur deren Beschäftigte aufnehmen und deshalb in keiner Landesrangliste erscheinen. Unter den offenen Kassen reicht die Spanne von ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)} bis ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)} Zusatzbeitrag; bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind sind das ${DE.eur(p.spanneJahr)} im Jahr. Die AOK Baden-Württemberg verlangt ${DE.pk(aok.zb!)}, ${aokVsTkDe}, und hat unter den ${aoks.length} AOKs den ${aokPlatz}. niedrigsten Satz. ${nurBw.length ? `Nur für Baden-Württemberg geöffnet sind außerdem ${nurBw.map((k) => k.kurz).join(' und ')}.` : ''} Wer in Bayern, Hessen oder Rheinland-Pfalz arbeitet, darf auch deren Kassen wählen. Gerechnet wird mit dem hälftig geteilten Pflegebeitrag, die sächsische Sonderregel gilt im Südwesten nicht.`,
    faqs: [
      { q: 'Welche Krankenkasse ist in Baden-Württemberg am günstigsten?', a: `Unter den frei wählbaren ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, gefolgt von ${top.slice(1, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie dort ${DE.eur(p.lohnBillig)} im Monat für Kranken- und Pflegeversicherung. Leistungen und Service bewertet diese Reihenfolge nicht.` },
      { q: 'Kann ich die Betriebskrankenkasse meines Arbeitgebers wählen?', a: `Wenn sie für Beschäftigte Ihres Arbeitgebers geöffnet ist, ja, auch wenn sie in der Landesrangliste fehlt. Die geschlossenen Betriebskassen der Liste verlangen zwischen ${DE.pk(gMin)} und ${DE.pk(gMax)}. Sie können sie in der vollständigen Liste einblenden und mit den offenen Kassen vergleichen. Verlassen Sie das Unternehmen, bleiben Sie Mitglied, solange Sie nicht selbst wechseln.` },
      { q: 'Lohnt es sich in Ulm, die AOK Bayern zu wählen?', a: `Wenn Sie in Neu-Ulm oder anderswo in Bayern arbeiten, dürfen Sie es. Die AOK Bayern verlangt ${DE.pk(by.aok!.zb!)}, die AOK Baden-Württemberg ${DE.pk(aok.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto macht das ${DE.eur(Math.abs(ulm))} im Jahr ${ulm > 0 ? 'zugunsten der bayerischen' : ulm < 0 ? 'zugunsten der baden-württembergischen' : 'Unterschied, also keinen'}. Wer in Baden-Württemberg wohnt und arbeitet, kann die AOK Bayern nicht wählen.` },
      { q: 'Welche Kassen gibt es nur in Baden-Württemberg?', a: `Laut Liste ist neben der AOK Baden-Württemberg ${nurBw.length ? nurBw.map((k) => `${k.kurz} (${DE.pk(k.zb!)})`).join(' und ') : 'keine weitere Kasse'} ausschließlich für dieses Land geöffnet. Viele andere regionale Betriebskrankenkassen haben ihre Satzung für Baden-Württemberg und weitere Länder geöffnet und stehen deshalb ebenfalls in der Rangliste oben.` },
      { q: 'Was zahlen Rentner in Baden-Württemberg bei der AOK?', a: `Mit ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente und einem Kind ${DE.eur(kostenZeile(aok).rente)} im Monat, bei ${p.billig.kurz} ${DE.eur(kostenZeile(p.billig).rente)}. Die Rentenversicherung trägt die Hälfte der Krankenversicherung, die Pflege zahlen Rentner allein. Betriebsrenten tragen den vollen Satz abzüglich eines Freibetrags von ${DE.eur(w.vbFrei, 2)}.` },
    ],
    body: (h) => `
<h2>Offene und geschlossene Betriebskrankenkassen</h2>
<p>Eine Betriebskrankenkasse kann ihre Satzung für die Allgemeinheit öffnen, für ganze Länder oder bundesweit, oder sie bleibt den Beschäftigten des Trägerunternehmens vorbehalten. Die Liste des GKV-Spitzenverbands zeigt das in der Spalte „geöffnet in“. In der Rangliste oben stehen nur die offenen; ${geschlossen.length} geschlossene Betriebskassen aus ganz Deutschland lassen sich in der ${h.a('zusatzbeitrag-liste', 'vollständigen Liste')} einblenden. Arbeiten Sie bei einem solchen Unternehmen, lohnt der Vergleich mit den offenen Kassen besonders, denn auch deren Sätze reichen von ${h.pk(gMin)} bis ${h.pk(gMax)}.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `Die günstigsten offenen Kassen für Baden-Württemberg, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Die AOK Baden-Württemberg in Zahlen</h2>
<p>Mit ${h.pk(aok.zb!)} liegt die Ortskrankenkasse ${aok.zb! < w.zb_durchschnitt ? 'unter' : 'über'} dem amtlichen Durchschnitt von ${h.pz(w.zb_durchschnitt)} und auf Platz ${p.aokRang} von ${p.n}. Ein Mitglied mit ${h.eur(BEISPIEL.lohn)} brutto zahlt ${h.eur(kostenZeile(aok).lohn)} im Monat und damit ${h.eur(p.aokVsBillig)} im Jahr mehr als bei ${kLink(h, p.billig)}. An der Beitragsbemessungsgrenze von ${h.eur(w.bbgKv, 2)} wächst der Abstand mit, weil der Zusatzbeitrag prozentual auf den Lohn erhoben wird.</p>
<h2>Grenzlagen im Südwesten</h2>
<p>Baden-Württemberg grenzt an ${h.a('guenstigste-krankenkasse-bayern', 'Bayern')}, ${h.a('guenstigste-krankenkasse-hessen', 'Hessen')} und ${h.a('guenstigste-krankenkasse-rheinland-pfalz', 'Rheinland-Pfalz')}, jedes mit eigener AOK. Wer im Nachbarland arbeitet, darf dessen Kassen wählen; die Mitgliedschaft bleibt bestehen, wenn sich später der Arbeitsplatz ändert. Gewechselt wird mit einem Antrag bei der neuen Kasse, wirksam zum übernächsten Monatsersten (${h.a('krankenkasse-wechseln', 'Termin rechnen')}). Studierende in Tübingen, Freiburg oder Heidelberg zahlen auf den festen BAföG-Bedarf von ${h.eur(w.bafoeg_bedarf)}; auch für sie entscheidet allein der Zusatzbeitrag, den der Rechner oben in Euro umrechnet, sobald Sie „Student“ einstellen.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-baden-wuerttemberg',
    nav: 'Baden-Württemberg',
    card: `${p.n} funds from ${EN.pk(p.billig.zb!)}; AOK Baden-Württemberg ranks ${p.aokRang} at ${EN.pk(aok.zb!)}.`,
    title: 'Cheapest Health Insurance Baden-Württemberg 2027 in Euros',
    description: `Baden-Württemberg 2026/2027: health funds open to you from ${EN.pk(p.billig.zb!)} additional rate, your cost in euros, the AOK compared, and how company health funds fit in.`,
    h1: 'Cheapest health insurance in Baden-Württemberg',
    intro: `In the south-west ${p.n} funds are open to everyone, from ${EN.pk(p.billig.zb!)}; AOK Baden-Württemberg follows at ${EN.pk(aok.zb!)} in position ${p.aokRang}.`,
    resume: `Baden-Württemberg is company fund country: alongside ${p.n} funds that the GKV-Spitzenverband list shows as open to anyone here, there are company health funds (Betriebskrankenkassen) of large employers that take only their own staff and so appear in no state ranking. Among the open funds, additional rates run from ${p.billig.kurz} at ${EN.pk(p.billig.zb!)} to ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}; on ${EN.eur(BEISPIEL.lohn)} gross with one child that is ${EN.eur(p.spanneJahr)} a year. AOK Baden-Württemberg charges ${EN.pk(aok.zb!)}, ${aokVsTkEn}, and among the ${aoks.length} AOK funds its rate is number ${aokPlatz} from the bottom. ${nurBw.length ? `Also open to Baden-Württemberg only: ${nurBw.map((k) => k.kurz).join(' and ')}.` : ''} If you work in Bavaria, Hesse or Rhineland-Palatinate, their funds are open to you as well. Care insurance is split half and half here; the Saxon rule does not apply.`,
    faqs: [
      { q: 'Which health fund is cheapest in Baden-Württemberg?', a: `Among the open funds, ${p.billig.kurz} at ${EN.pk(p.billig.zb!)}, followed by ${top.slice(1, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohnBillig)} a month there for health and care insurance. The ranking does not rate benefits or service.` },
      { q: 'Can I join my employer’s company health fund?', a: `If it is open to your employer’s staff, yes, even though it is missing from the state ranking. The closed company funds on the list charge between ${EN.pk(gMin)} and ${EN.pk(gMax)}. You can show them in the full list and compare them with the open funds. If you leave the company, you stay a member unless you switch yourself.` },
      { q: 'Living in Ulm, is AOK Bayern worth choosing?', a: `If you work in Neu-Ulm or elsewhere in Bavaria, you may join it. AOK Bayern charges ${EN.pk(by.aok!.zb!)}, AOK Baden-Württemberg ${EN.pk(aok.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross that is ${EN.eur(Math.abs(ulm))} a year ${ulm > 0 ? 'in favour of the Bavarian fund' : ulm < 0 ? 'in favour of the Baden-Württemberg fund' : 'difference, so none'}. If you live and work in Baden-Württemberg, you cannot join AOK Bayern.` },
      { q: 'Which funds are open only in Baden-Württemberg?', a: `According to the list, besides AOK Baden-Württemberg ${nurBw.length ? nurBw.map((k) => `${k.kurz} (${EN.pk(k.zb!)})`).join(' and ') : 'no other fund'} is open to this state alone. Many other regional company funds have opened their statutes to Baden-Württemberg and further states, so they also appear in the ranking above.` },
      { q: 'What do pensioners in Baden-Württemberg pay at the AOK?', a: `With a ${EN.eur(BEISPIEL.rente)} state pension and one child, ${EN.eur(kostenZeile(aok).rente)} a month, against ${EN.eur(kostenZeile(p.billig).rente)} at ${p.billig.kurz}. The pension insurance pays half the health contribution; pensioners pay care insurance alone. Company pensions pay the full rate, less an allowance of ${EN.eur(w.vbFrei, 2)}.` },
    ],
    body: (h) => `
<h2>Open and closed company health funds</h2>
<p>A company health fund can open its statutes to the public, for whole states or nationwide, or it can stay reserved for the staff of its sponsoring company. The GKV-Spitzenverband list shows this in its “open in” column. The ranking above lists only open funds; ${geschlossen.length} closed company funds from across Germany can be shown in the ${h.a('zusatzbeitrag-liste', 'full list')}. If you work for such a company, comparing it with the open funds is especially worthwhile: their rates also range from ${h.pk(gMin)} to ${h.pk(gMax)}.</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `The cheapest open funds for Baden-Württemberg, ${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>AOK Baden-Württemberg in figures</h2>
<p>At ${h.pk(aok.zb!)} the regional fund is ${aok.zb! < w.zb_durchschnitt ? 'below' : 'above'} the official average of ${h.pz(w.zb_durchschnitt)} and ranks ${p.aokRang} of ${p.n}. A member on ${h.eur(BEISPIEL.lohn)} gross pays ${h.eur(kostenZeile(aok).lohn)} a month, ${h.eur(p.aokVsBillig)} a year more than at ${kLink(h, p.billig)}. Up to the contribution ceiling of ${h.eur(w.bbgKv, 2)} the gap grows with pay, because the additional rate is a percentage of earnings.</p>
<h2>Border areas in the south-west</h2>
<p>Baden-Württemberg borders ${h.a('guenstigste-krankenkasse-bayern', 'Bavaria')}, ${h.a('guenstigste-krankenkasse-hessen', 'Hesse')} and ${h.a('guenstigste-krankenkasse-rheinland-pfalz', 'Rhineland-Palatinate')}, each with its own AOK. If you work in a neighbouring state, you may join its funds; membership continues if your workplace changes later. You switch by applying to the new fund, effective from the first day of the month after next (${h.a('krankenkasse-wechseln', 'work out the date')}). Students in Tübingen, Freiburg or Heidelberg pay on the fixed BAföG need rate of ${h.eur(w.bafoeg_bedarf)}; for them too only the additional rate differs, and the calculator above turns it into euros once you select “student”.</p>`,
  },
});
