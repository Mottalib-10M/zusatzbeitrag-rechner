import { defineGuide } from '../../lib/guide-types';
import { profil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { kasse } from '../../lib/engine/kassen';
import { J, DE, EN } from '../../lib/fmt';

/** Techniker Krankenkasse: Satz und Rang aus der Kassenliste, Beträge aus dem Motor. */
const p = profil('techniker-krankenkasse');
const w = J(2026);
const ek = ['techniker-krankenkasse', 'barmer', 'dak-gesundheit', 'kaufmannische-krankenkasse-kkh', 'handelskrankenkasse-hkk', 'hek-hanseatische-krankenkasse'].map((id) => kostenZeile(kasse(id))).sort((a, b) => a.k.zb! - b.k.zb!);
const barmer = kostenZeile(kasse('barmer')), dak = kostenZeile(kasse('dak-gesundheit'));
const vsBarmer = Math.round((barmer.lohn - p.lohn) * 12), vsDak = Math.round((dak.lohn - p.lohn) * 12);
const guenstigerEk = ek.filter((x) => x.k.zb! < p.zb);

export default defineGuide({
  id: 'techniker-krankenkasse',
  group: 'kassen',
  order: 10,
  kasse: 'techniker-krankenkasse',
  tool: 'beitrag',
  toolPreset: { kasse: 'techniker-krankenkasse' },
  related: ['barmer', 'dak-gesundheit', 'handelskrankenkasse-hkk', 'zusatzbeitrag-liste', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_242', 'sgb5_175', 'sgb5_249'],
  de: {
    slug: 'tk-zusatzbeitrag',
    nav: 'Techniker Krankenkasse (TK)',
    card: `${DE.pk(p.zb)} Zusatzbeitrag, Rang ${p.rangBund} von ${p.nBund}; bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(p.lohn)} im Monat für Sie.`,
    title: 'TK Zusatzbeitrag 2027: Beitrag in Euro und Vergleich',
    description: `TK-Zusatzbeitrag 2026: ${DE.pk(p.zb)}. Was Beschäftigte, Rentner, Selbstständige und Studierende im Monat zahlen, Ausblick 2027 und Vergleich mit BARMER und DAK.`,
    h1: 'Techniker Krankenkasse: Zusatzbeitrag und Beitrag in Euro',
    intro: `Die TK verlangt ${DE.pk(p.zb)} Zusatzbeitrag, ${DE.num(Math.abs(p.abstandDurchschnitt), 2)} Punkte ${p.unterDurchschnitt ? "unter" : "über"} dem amtlichen Durchschnitt; bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie ${DE.eur(p.lohn)} im Monat.`,
    resume: `Die Techniker Krankenkasse erhebt laut Liste des GKV-Spitzenverbands einen Zusatzbeitrag von ${DE.pk(p.zb)}. Zusammen mit dem allgemeinen Beitragssatz von ${DE.pz(w.kv_allgemein)} ergibt das ${DE.pz(w.kv_allgemein + p.zb)} des Bruttolohns bis zur Beitragsbemessungsgrenze, die sich Beschäftigte und Arbeitgeber teilen. Bei ${DE.eur(BEISPIEL.lohn)} brutto im Monat und einem Kind zahlen Sie für Kranken- und Pflegeversicherung zusammen ${DE.eur(p.lohn)}, der Arbeitgeber legt fast genauso viel dazu. Unter den ${p.nBund} Kassen, die in mindestens einem Land jedem offenstehen, liegt die TK auf Rang ${p.rangBund}. Gegenüber dem durchschnittlichen Zusatzbeitragssatz von ${DE.pz(w.zb_durchschnitt)} sparen Sie bei diesem Lohn ${DE.eur(Math.abs(p.proJahrVsDurchschnitt))} im Jahr; die günstigste frei wählbare Kasse, ${p.billigste.kurz} mit ${DE.pk(p.billigste.zb!)}, wäre noch ${DE.eur(p.proJahrVsBilligste)} im Jahr billiger. Die TK ist eine Ersatzkasse und in allen 16 Ländern wählbar.`,
    faqs: [
      { q: 'Erhöht die TK den Zusatzbeitrag 2027?', a: `Das entscheidet der Verwaltungsrat der TK im Dezember; die Liste des GKV-Spitzenverbands zeigt einen neuen Satz erst ab dem Tag, an dem er gilt. Heute stehen dort ${DE.pk(p.zb)}. Der Schätzerkreis hat am 14. Oktober 2026 einen rechnerischen Durchschnitt von ${DE.pz(J(2027).zb_durchschnitt)} für 2027 ermittelt. Erhöht die TK, haben Mitglieder ein Sonderkündigungsrecht bis zum Ende des Monats, ab dem der höhere Satz gilt.` },
      { q: `Wie viel zahle ich bei der TK mit ${DE.eur(BEISPIEL.lohnNiedrig)} brutto?`, a: `Mit einem Kind ${DE.eur(p.lohnNiedrig)} im Monat für Kranken- und Pflegeversicherung zusammen, davon Krankenversicherung ${DE.pz((w.kv_allgemein + p.zb) / 2)} Ihres Bruttos und Pflege ${DE.pz(w.pv_satz / 2)}. Kinderlose ab 23 zahlen ${DE.pz(w.pv_kinderlos)} Pflegezuschlag zusätzlich. Ab ${DE.eur(w.bbgKv, 2)} brutto steigt der Beitrag nicht weiter: dort zahlen Sie ${DE.eur(p.lohnBbg)}.` },
      { q: 'Ist die TK günstiger als BARMER und DAK?', a: `Beim Preis ja. BARMER verlangt ${DE.pk(barmer.k.zb!)}, die DAK-Gesundheit ${DE.pk(dak.k.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie bei der TK ${DE.eur(vsBarmer)} im Jahr weniger als bei BARMER und ${DE.eur(vsDak)} weniger als bei der DAK. Über Bonusprogramme und Zusatzleistungen sagt der Satz nichts; die stehen in der Satzung der jeweiligen Kasse.` },
      { q: 'Was zahlen Rentner und Studierende bei der TK?', a: `Rentner mit ${DE.eur(BEISPIEL.rente)} gesetzlicher Rente zahlen ${DE.eur(p.rente)} im Monat (halber Krankenversicherungssatz, Pflege voll), Studierende ${DE.eur(p.student)} auf den gesetzlich festen BAföG-Bedarf von ${DE.eur(w.bafoeg_bedarf)}. Freiwillig versicherte Selbstständige mit ${DE.eur(BEISPIEL.gewinn)} Gewinn zahlen ${DE.eur(p.selbst)}, weil kein Arbeitgeber die Hälfte trägt.` },
    ],
    body: (h) => `
<h2>Die TK unter den großen Ersatzkassen</h2>
<p>${guenstigerEk.length === 0 ? 'Unter den sechs großen Ersatzkassen hat die TK den niedrigsten Satz.' : `Günstiger als die TK ${guenstigerEk.length === 1 ? 'ist unter den sechs großen Ersatzkassen nur' : 'sind unter den sechs großen Ersatzkassen'} ${guenstigerEk.map((x) => x.k.kurz).join(' und ')}.`} Ersatzkassen sind traditionell bundesweit geöffnet; anders als eine AOK oder eine regionale Betriebskrankenkasse können Sie die TK also wählen, egal in welchem Land Sie wohnen oder arbeiten. Die Tabelle rechnet mit ${h.eur(BEISPIEL.lohn)} brutto und einem Kind, Ihr Anteil an Kranken- und Pflegeversicherung.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'gegenüber TK im Jahr'], ek.map((x) => [x.k.id === 'techniker-krankenkasse' ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === 'techniker-krankenkasse' ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(Math.round((x.lohn - p.lohn) * 12)))}`]), 'Liste des GKV-Spitzenverbands, Beträge mit dem Rechner oben', ['l', 'r', 'r', 'r'])}
<h2>Was Sie bei der TK im Monat zahlen</h2>
${h.table(['Lage', 'Grundlage', 'Ihr Anteil im Monat'], [
  ['Beschäftigt', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Beschäftigt', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Beschäftigt an der Grenze', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Rente', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Selbstständig, ohne Krankengeld', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Studium', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], `2026, mit einem Kind; Studium unter 23`, ['l', 'r', 'r'])}
<p>Der Zusatzbeitrag macht bei der TK nur einen kleinen Teil des Gesamtbeitrags aus: Bei ${h.eur(BEISPIEL.lohn)} brutto sind es ${h.eur(BEISPIEL.lohn * p.zb / 200)} von Ihrem Anteil, der Rest ist der für alle Kassen gleiche allgemeine Satz und die Pflege. Deshalb liegen zwischen der TK und der teuersten bundesweit wählbaren Kasse bei diesem Lohn ${h.eur(Math.round((kostenZeile(p.teuerste).lohn - p.lohn) * 12))} im Jahr, nicht mehr. Wer viel verdient, spürt den Unterschied stärker, weil der Zusatzbeitrag bis zur Beitragsbemessungsgrenze mitwächst.</p>
<h2>Wechseln zur TK oder von der TK weg</h2>
<p>Zur TK wechseln Sie mit einem Mitgliedsantrag bei der TK; sie meldet den Wechsel an Ihre bisherige Kasse. Neue Mitgliedschaft ab dem übernächsten Monatsersten, wenn Sie zwölf Monate gebunden waren oder Ihre Kasse erhöht (${h.a('krankenkasse-wechseln', 'Fristen rechnen')}). Wer schon bei der TK ist und eine günstigere Kasse sucht, findet die Rangliste seines Landes im Rechner oben; die ${h.a('zusatzbeitrag-liste', 'Liste aller Zusatzbeiträge')} zeigt auch die regionalen Kassen und die kleineren Ersatzkassen wie die HEK. Ein Wechsel kostet nichts, Behandlungen laufen weiter. Erhöht die TK zum Januar, gilt das ${h.a('sonderkuendigungsrecht', 'Sonderkündigungsrecht')} auch während der zwölf Monate Bindung.</p>`,
  },
  en: {
    slug: 'tk-additional-contribution',
    nav: 'Techniker Krankenkasse (TK)',
    card: `${EN.pk(p.zb)} additional rate, rank ${p.rangBund} of ${p.nBund}; on ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohn)} a month.`,
    title: 'TK Additional Contribution 2027: Cost in Euros, Compared',
    description: `TK additional rate 2026: ${EN.pk(p.zb)}. What employees, pensioners, self-employed members and students pay a month, the 2027 outlook, TK against BARMER, DAK.`,
    h1: 'Techniker Krankenkasse: additional rate and cost in euros',
    intro: `TK charges an additional rate of ${EN.pk(p.zb)}, ${EN.num(Math.abs(p.abstandDurchschnitt), 2)} points ${p.unterDurchschnitt ? 'below' : 'above'} the official average; on ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohn)} a month.`,
    resume: `Techniker Krankenkasse (TK) charges an additional contribution (Zusatzbeitrag) of ${EN.pk(p.zb)}, according to the list kept by the GKV-Spitzenverband, the umbrella body of Germany’s statutory health funds. Added to the general rate of ${EN.pz(w.kv_allgemein)}, that is ${EN.pz(w.kv_allgemein + p.zb)} of gross pay up to the contribution ceiling, shared between employee and employer. On ${EN.eur(BEISPIEL.lohn)} gross a month with one child, your share of health and long-term care insurance together is ${EN.eur(p.lohn)}; your employer adds almost as much. Among the ${p.nBund} funds open to anyone in at least one state, TK ranks ${p.rangBund}. Compared with the official average additional rate of ${EN.pz(w.zb_durchschnitt)} you save ${EN.eur(Math.abs(p.proJahrVsDurchschnitt))} a year at that pay; the cheapest open fund, ${p.billigste.kurz} at ${EN.pk(p.billigste.zb!)}, would cost another ${EN.eur(p.proJahrVsBilligste)} a year less. TK is a substitute fund (Ersatzkasse) and can be chosen in all 16 states.`,
    faqs: [
      { q: 'Will TK raise its additional rate in 2027?', a: `TK’s board decides in December, and the GKV-Spitzenverband list shows a new rate only from the day it applies. Today it shows ${EN.pk(p.zb)}. The official estimating group put the average for 2027 at ${EN.pz(J(2027).zb_durchschnitt)} on 14 October 2026. If TK raises its rate, members have a special right to leave until the end of the month in which the higher rate starts.` },
      { q: `How much do I pay at TK on ${EN.eur(BEISPIEL.lohnNiedrig)} gross?`, a: `With one child, ${EN.eur(p.lohnNiedrig)} a month for health and care insurance together: health is ${EN.pz((w.kv_allgemein + p.zb) / 2)} of your gross pay and care ${EN.pz(w.pv_satz / 2)}. Childless members aged 23 or over pay a ${EN.pz(w.pv_kinderlos)} care surcharge on top. From ${EN.eur(w.bbgKv, 2)} gross the contribution stops rising, at ${EN.eur(p.lohnBbg)}.` },
      { q: 'Is TK cheaper than BARMER and DAK?', a: `On price, yes. BARMER charges ${EN.pk(barmer.k.zb!)} and DAK-Gesundheit ${EN.pk(dak.k.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(vsBarmer)} a year less at TK than at BARMER and ${EN.eur(vsDak)} less than at DAK. The rate says nothing about bonus schemes or extra benefits; those are set out in each fund’s statutes.` },
      { q: 'What do pensioners and students pay at TK?', a: `Pensioners with a ${EN.eur(BEISPIEL.rente)} state pension pay ${EN.eur(p.rente)} a month (half the health rate, care insurance in full); students pay ${EN.eur(p.student)}, based on the statutory BAföG need rate of ${EN.eur(w.bafoeg_bedarf)}. Self-employed voluntary members with ${EN.eur(BEISPIEL.gewinn)} profit pay ${EN.eur(p.selbst)}, because no employer pays half.` },
    ],
    body: (h) => `
<h2>TK among the big substitute funds</h2>
<p>${guenstigerEk.length === 0 ? 'Of the six big substitute funds, TK has the lowest rate.' : `Of the six big substitute funds, only ${guenstigerEk.map((x) => x.k.kurz).join(' and ')} ${guenstigerEk.length === 1 ? 'is' : 'are'} cheaper than TK.`} Substitute funds have always been open nationwide, so unlike an AOK or a regional company fund you can join TK wherever you live or work. The table uses ${h.eur(BEISPIEL.lohn)} gross and one child, your share of health and care insurance.</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'vs TK a year'], ek.map((x) => [x.k.id === 'techniker-krankenkasse' ? `<strong>${x.k.kurz}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.id === 'techniker-krankenkasse' ? '·' : `${x.lohn > p.lohn ? '+' : '−'}${h.eur(Math.abs(Math.round((x.lohn - p.lohn) * 12)))}`]), 'GKV-Spitzenverband list, amounts from the calculator above', ['l', 'r', 'r', 'r'])}
<h2>What you pay at TK a month</h2>
${h.table(['Situation', 'Base', 'Your share a month'], [
  ['Employee', h.eur(BEISPIEL.lohnNiedrig), h.eur(p.lohnNiedrig)],
  ['Employee', h.eur(BEISPIEL.lohn), h.eur(p.lohn)],
  ['Employee at the ceiling', h.eur(w.bbgKv, 2), h.eur(p.lohnBbg)],
  ['Pensioner', h.eur(BEISPIEL.rente), h.eur(p.rente)],
  ['Self-employed, no sick pay', h.eur(BEISPIEL.gewinn), h.eur(p.selbst)],
  ['Student', h.eur(w.bafoeg_bedarf), h.eur(p.student)],
], '2026, with one child; student under 23', ['l', 'r', 'r'])}
<p>The additional rate is only a small part of the total at TK: on ${h.eur(BEISPIEL.lohn)} gross it accounts for ${h.eur(BEISPIEL.lohn * p.zb / 200)} of your share, the rest being the general rate every fund charges plus care insurance. That is why TK and the most expensive nationwide fund are only ${h.eur(Math.round((kostenZeile(p.teuerste).lohn - p.lohn) * 12))} a year apart at this pay. High earners feel the gap more, because the additional rate grows with pay up to the ceiling.</p>
<h2>Moving to TK or away from it</h2>
<p>You join TK with a membership application to TK; it notifies your current fund. Membership starts on the first day of the month after next, provided you have been a member for twelve months or your fund raises its rate (${h.a('krankenkasse-wechseln', 'work out the dates')}). If you are with TK and want a cheaper fund, the calculator above ranks every fund open in your state; the ${h.a('zusatzbeitrag-liste', 'full list of additional rates')} also covers regional funds. Switching is free and treatment continues. If TK raises its rate in January, the ${h.a('sonderkuendigungsrecht', 'special termination right')} applies even within the twelve-month lock-in.</p>`,
  },
});
