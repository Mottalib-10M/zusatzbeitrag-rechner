import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN, kasse } from '../../lib/engine/kassen';
import { selbststaendig } from '../../lib/engine/beitrag';

/** Rheinland-Pfalz: Rangliste aus der Liste des GKV-Spitzenverbands; die Ortskrankenkasse an oder nahe der Spitze. */
const p = landProfil('RP');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const aokVorn = p.aokRang === 1;
const zweite = p.r.find((k) => k.id !== aok.id && k.zb! >= aok.zb!) ?? p.r[1];
const abstandZweite = Math.round((kostenZeile(zweite).lohn - kostenZeile(aok).lohn) * 12);
const tk = kasse('techniker-krankenkasse');
const vsTk = Math.round((kostenZeile(tk).lohn - kostenZeile(aok).lohn) * 12);
const ikkSw = kasse('ikk-sudwest');
const selbstAok = selbststaendig({ einkommen: BEISPIEL.gewinn, zb: aok.zb!, jahr: 2026, krankengeld: false, eltern: 'k1' }).selbst;
const selbstTk = selbststaendig({ einkommen: BEISPIEL.gewinn, zb: tk.zb!, jahr: 2026, krankengeld: false, eltern: 'k1' }).selbst;
const nurRp = p.nurHier.filter((k) => k.id !== aok.id);

export default defineGuide({
  id: 'guenstigste-krankenkasse-rheinland-pfalz',
  group: 'laender',
  order: 60,
  land: 'RP',
  tool: 'beitrag',
  toolPreset: { land: 'RP', kasse: 'aok-rheinland-pfalz-saarland-die-gesundheitskasse' },
  related: ['guenstigste-krankenkasse-saarland', 'guenstigste-krankenkasse-hessen', 'guenstigste-krankenkasse-baden-wuerttemberg', 'zusatzbeitrag-liste', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_242', 'sgb5_249'],
  de: {
    slug: 'guenstigste-krankenkasse-rheinland-pfalz',
    nav: 'Rheinland-Pfalz',
    card: `${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; die AOK Rheinland-Pfalz/Saarland verlangt ${DE.pk(aok.zb!)} und steht auf Platz ${p.aokRang}.`,
    title: 'Günstigste Krankenkasse Rheinland-Pfalz 2027: AOK vorn?',
    description: `Rheinland-Pfalz 2026/2027: alle wählbaren Krankenkassen ab ${DE.pk(p.billig.zb!)} Zusatzbeitrag mit Beitrag in Euro, AOK Rheinland-Pfalz/Saarland und IKK Südwest verglichen.`,
    h1: 'Günstigste Krankenkasse in Rheinland-Pfalz',
    intro: `In Rheinland-Pfalz sind ${p.n} Kassen wählbar; ${aokVorn ? 'an der Spitze steht ausnahmsweise die Ortskrankenkasse' : `die günstigste ist ${p.billig.kurz}, die AOK folgt auf Platz ${p.aokRang}`}, mit ${DE.pk(aok.zb!)}.`,
    resume: `In den meisten Ländern liegt die AOK im Mittelfeld der Rangliste. In Rheinland-Pfalz ist das anders: Die AOK Rheinland-Pfalz/Saarland verlangt laut Liste des GKV-Spitzenverbands ${DE.pk(aok.zb!)} Zusatzbeitrag und steht damit auf Platz ${p.aokRang} von ${p.n} wählbaren Kassen; unter allen ${aoks.length} AOKs hat sie den ${aokPlatz}. niedrigsten Satz. ${aokVorn ? `Die nächstgünstige Kasse, ${zweite.kurz} mit ${DE.pk(zweite.zb!)}, kostet bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind ${DE.eur(abstandZweite)} im Jahr mehr.` : `Günstiger ist nur ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)}.`} Am anderen Ende der Liste steht ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}, ${DE.eur(p.spanneJahr)} im Jahr über der günstigsten. ${p.aokRang <= 3 ? 'Für Mitglieder der Ortskrankenkasse heißt das: Ein Wechsel spart hier beim Preis nichts oder wenig, Gründe für einen Wechsel liegen eher bei Service und Leistungen.' : `Für Mitglieder der Ortskrankenkasse beträgt die mögliche Ersparnis ${DE.eur(p.aokVsBillig)} im Jahr.`} Wer dagegen bei einer teureren Ersatz- oder Betriebskrankenkasse ist, kann durch einen Wechsel spürbar sparen.`,
    faqs: [
      { q: 'Ist die AOK in Rheinland-Pfalz wirklich die günstigste Kasse?', a: `${aokVorn ? `Ja, nach dem Zusatzbeitrag: ${DE.pk(aok.zb!)}, keine andere für Rheinland-Pfalz geöffnete Kasse liegt darunter.` : `Fast: Nur ${p.billig.kurz} mit ${DE.pk(p.billig.zb!)} liegt darunter.`} Die Reihenfolge beruht allein auf dem Satz der Liste des GKV-Spitzenverbands. Zusatzleistungen, Bonusprogramme und Service bewertet sie nicht; dafür lohnt ein Blick in die Satzungen der Kassen.` },
      { q: 'Was spare ich, wenn ich von der TK zur AOK Rheinland-Pfalz/Saarland wechsle?', a: `Die Techniker Krankenkasse verlangt ${DE.pk(tk.zb!)}, die AOK ${DE.pk(aok.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlen Sie bei der AOK ${vsTk >= 0 ? `${DE.eur(vsTk)} im Jahr weniger` : `${DE.eur(-vsTk)} im Jahr mehr`}. Wählen dürfen Sie die AOK, wenn Sie in Rheinland-Pfalz oder im Saarland wohnen oder arbeiten.` },
      { q: 'Für wen ist die IKK Südwest geöffnet?', a: `Laut Liste für Hessen, Rheinland-Pfalz und das Saarland. Sie verlangt ${DE.pk(ikkSw.zb!)} und steht in der rheinland-pfälzischen Rangliste auf Platz ${p.r.filter((k) => k.zb! < ikkSw.zb!).length + 1}. Innungskrankenkassen stammen aus dem Handwerk, nehmen heute aber jeden auf, der im Öffnungsgebiet wohnt oder arbeitet, ganz gleich in welchem Beruf.` },
      { q: 'Welche Kasse ist nur in Rheinland-Pfalz geöffnet?', a: `Neben der AOK, die zusätzlich das Saarland versichert, nennt die Liste ${nurRp.length ? nurRp.map((k) => `${k.kurz} mit ${DE.pk(k.zb!)}`).join(' und ') : 'keine weitere Kasse'} als ausschließlich für Rheinland-Pfalz geöffnet. Daneben gibt es Betriebskrankenkassen, die nur ihren eigenen Beschäftigten offenstehen und deshalb in der Rangliste fehlen. In der vollständigen Liste lassen sie sich einblenden.` },
      { q: 'Lohnt sich für Selbstständige in der Pfalz die AOK?', a: `Selbstständige tragen den Zusatzbeitrag allein, deshalb wirkt jeder Zehntelpunkt doppelt. Mit ${DE.eur(BEISPIEL.gewinn)} Gewinn und ohne Krankengeld zahlen Sie bei der AOK ${DE.eur(selbstAok)} im Monat, bei der Techniker Krankenkasse ${DE.eur(selbstTk)}. Mindestens wird ein Einkommen von ${DE.eur(w.mindestFreiwillig, 2)} angesetzt, höchstens die Beitragsbemessungsgrenze.` },
    ],
    body: (h) => `
<h2>Wenn die Ortskrankenkasse vorn liegt</h2>
<p>Die AOK Rheinland-Pfalz/Saarland gehört zu den günstigsten Kassen des Landes. Das kehrt die übliche Frage um: Hier überlegen eher Mitglieder von Ersatzkassen und überregionalen Betriebskrankenkassen, ob sie zur Ortskrankenkasse wechseln. Die folgende Tabelle zeigt die Spitze der Rangliste; die AOK ist hervorgehoben, wenn sie darin steht.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [x.k.id === aok.id ? `<strong>${kLink(h, x.k)}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Rheinland-Pfalz und Saarland: eine AOK</h2>
<p>Die AOK versichert beide Länder zum selben Satz. Wer im ${h.a('guenstigste-krankenkasse-saarland', 'Saarland')} wohnt und in Rheinland-Pfalz arbeitet oder umgekehrt, bleibt bei derselben Kasse, egal wo. Nach Osten öffnet die Arbeit in ${h.a('guenstigste-krankenkasse-hessen', 'Hessen')} oder ${h.a('guenstigste-krankenkasse-baden-wuerttemberg', 'Baden-Württemberg')} weitere Listen; für Mainzer mit Job in Wiesbaden oder Ludwigshafener mit Job in Mannheim gilt beides, Wohn- und Arbeitsort.</p>
<h2>Teure Kassen, spürbare Unterschiede</h2>
<p>Am Ende der Rangliste steht ${kLink(h, p.teuer)} mit ${h.pk(p.teuer.zb!)}. Ein Mitglied mit ${h.eur(BEISPIEL.lohn)} brutto zahlt dort ${h.eur(p.lohnTeuer)} im Monat, bei der günstigsten Kasse ${h.eur(p.lohnBillig)}. An der Beitragsbemessungsgrenze von ${h.eur(w.bbgKv, 2)} wächst der Unterschied auf ${h.eur(p.spanneJahrBbg)} im Jahr. Den Wechseltermin berechnet der ${h.a('krankenkasse-wechseln', 'Fristenrechner')}: Antrag bei der neuen Kasse, Mitgliedschaft ab dem übernächsten Monatsersten. Die Pflege wird in Rheinland-Pfalz hälftig geteilt.</p>
<h2>Pendler über die Landesgrenze</h2>
<p>Wer in Rheinland-Pfalz wohnt und in Hessen, Baden-Württemberg oder Nordrhein-Westfalen arbeitet, darf auch die dort geöffneten Kassen wählen, etwa die AOK seines Arbeitsorts. Probieren Sie im Rechner beide Länder aus: Die Rangliste ändert sich mit jedem Land, weil regionale Betriebskrankenkassen und die jeweilige AOK hinzukommen oder wegfallen.</p>
<h2>Rentner und Studierende</h2>
<p>Rentnerinnen und Rentner zahlen den halben Satz plus den halben Zusatzbeitrag auf die Rente und die Pflege allein: mit ${h.eur(BEISPIEL.rente)} Rente und einem Kind ${h.eur(kostenZeile(aok).rente)} bei der AOK. Studierende in Mainz, Trier oder Kaiserslautern zahlen auf den festen BAföG-Bedarf von ${h.eur(w.bafoeg_bedarf)}; der Rechner oben zeigt beide Fälle, wenn Sie Ihre Lage umstellen.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-rhineland-palatinate',
    nav: 'Rhineland-Palatinate',
    card: `${p.n} funds from ${EN.pk(p.billig.zb!)}; AOK Rheinland-Pfalz/Saarland charges ${EN.pk(aok.zb!)} and ranks ${p.aokRang}.`,
    title: 'Cheapest Health Insurance Rhineland-Palatinate 2027: AOK?',
    description: `Rhineland-Palatinate 2026/2027: every fund you can join from ${EN.pk(p.billig.zb!)} additional rate, your cost in euros, AOK Rheinland-Pfalz/Saarland and IKK Südwest compared.`,
    h1: 'Cheapest health insurance in Rhineland-Palatinate',
    intro: `In Rhineland-Palatinate ${p.n} funds are open; ${aokVorn ? 'unusually, the regional AOK tops the list' : `the cheapest is ${p.billig.kurz}, with the AOK in position ${p.aokRang}`}, at ${EN.pk(aok.zb!)}.`,
    resume: `In most states the AOK sits mid-table. Rhineland-Palatinate (Rheinland-Pfalz) is different: according to the GKV-Spitzenverband list, AOK Rheinland-Pfalz/Saarland charges an additional rate of ${EN.pk(aok.zb!)}, placing it ${p.aokRang} of ${p.n} funds you can join; among all ${aoks.length} AOK funds its rate is number ${aokPlatz} from the bottom. ${aokVorn ? `The next cheapest fund, ${zweite.kurz} at ${EN.pk(zweite.zb!)}, costs ${EN.eur(abstandZweite)} a year more on ${EN.eur(BEISPIEL.lohn)} gross with one child.` : `Only ${p.billig.kurz} at ${EN.pk(p.billig.zb!)} is cheaper.`} At the other end is ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}, ${EN.eur(p.spanneJahr)} a year above the cheapest. ${p.aokRang <= 3 ? 'For AOK members this means switching saves little or nothing on price here; reasons to move lie in service and benefits.' : `For AOK members the possible saving is ${EN.eur(p.aokVsBillig)} a year.`} Members of a dearer substitute or company fund, on the other hand, can save noticeably by switching.`,
    faqs: [
      { q: 'Is the AOK really the cheapest fund in Rhineland-Palatinate?', a: `${aokVorn ? `Yes, by additional rate: ${EN.pk(aok.zb!)}, and no other fund open to Rhineland-Palatinate charges less.` : `Almost: only ${p.billig.kurz} at ${EN.pk(p.billig.zb!)} is lower.`} The order rests solely on the rate in the GKV-Spitzenverband list. It does not rate extra benefits, bonus schemes or service; the funds’ statutes are where to check those.` },
      { q: 'What do I save moving from TK to AOK Rheinland-Pfalz/Saarland?', a: `Techniker Krankenkasse charges ${EN.pk(tk.zb!)}, the AOK ${EN.pk(aok.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child you pay ${vsTk >= 0 ? `${EN.eur(vsTk)} a year less` : `${EN.eur(-vsTk)} a year more`} at the AOK. You may join the AOK if you live or work in Rhineland-Palatinate or Saarland, whatever your job.` },
      { q: 'Who can join IKK Südwest?', a: `According to the list, people in Hesse, Rhineland-Palatinate and Saarland. It charges ${EN.pk(ikkSw.zb!)} and ranks ${p.r.filter((k) => k.zb! < ikkSw.zb!).length + 1} in Rhineland-Palatinate. Guild funds (IKK) come from the skilled trades but today accept anyone who lives or works in their area, whatever their job.` },
      { q: 'Which fund is open only in Rhineland-Palatinate?', a: `Besides the AOK, which also covers Saarland, the list names ${nurRp.length ? nurRp.map((k) => `${k.kurz} at ${EN.pk(k.zb!)}`).join(' and ') : 'no other fund'} as open to Rhineland-Palatinate alone. There are also company funds open only to their own staff, which is why they are missing from the ranking.` },
      { q: 'Is the AOK a good choice for the self-employed in the Palatinate?', a: `The self-employed carry the additional rate alone, so every tenth of a point counts double. With ${EN.eur(BEISPIEL.gewinn)} profit and no sick pay you pay ${EN.eur(selbstAok)} a month at the AOK and ${EN.eur(selbstTk)} at Techniker Krankenkasse. Income of at least ${EN.eur(w.mindestFreiwillig, 2)} is assessed, at most the contribution ceiling.` },
    ],
    body: (h) => `
<h2>When the regional fund leads</h2>
<p>AOK Rheinland-Pfalz/Saarland is one of the cheapest funds in the state. That turns the usual question around: here it is members of substitute funds and supra-regional company funds who wonder whether to move to the regional fund. The table shows the top of the ranking, with the AOK in bold if it appears.</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [x.k.id === aok.id ? `<strong>${kLink(h, x.k)}</strong>` : kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Rhineland-Palatinate and Saarland: one AOK</h2>
<p>The AOK covers both states at the same rate. If you live in ${h.a('guenstigste-krankenkasse-saarland', 'Saarland')} and work in Rhineland-Palatinate, or the other way round, you keep the same fund either way. To the east, a job in ${h.a('guenstigste-krankenkasse-hessen', 'Hesse')} or ${h.a('guenstigste-krankenkasse-baden-wuerttemberg', 'Baden-Württemberg')} opens further lists; for someone living in Mainz and working in Wiesbaden, or living in Ludwigshafen and working in Mannheim, both home and workplace count.</p>
<h2>Dear funds, real differences</h2>
<p>At the bottom of the ranking is ${kLink(h, p.teuer)} at ${h.pk(p.teuer.zb!)}. A member on ${h.eur(BEISPIEL.lohn)} gross pays ${h.eur(p.lohnTeuer)} a month there, against ${h.eur(p.lohnBillig)} at the cheapest fund. At the contribution ceiling of ${h.eur(w.bbgKv, 2)} the gap grows to ${h.eur(p.spanneJahrBbg)} a year. The ${h.a('krankenkasse-wechseln', 'deadline calculator')} gives the switch date: apply to the new fund, membership from the first day of the month after next. Care insurance is split half and half in Rhineland-Palatinate.</p>
<h2>Pensioners and students</h2>
<p>Pensioners pay half the rate plus half the additional rate on their pension and care insurance alone: on a ${h.eur(BEISPIEL.rente)} pension with one child, ${h.eur(kostenZeile(aok).rente)} at the AOK. Students in Mainz, Trier or Kaiserslautern pay on the fixed BAföG need rate of ${h.eur(w.bafoeg_bedarf)}; the calculator above covers both once you change your situation.</p>`,
  },
});
