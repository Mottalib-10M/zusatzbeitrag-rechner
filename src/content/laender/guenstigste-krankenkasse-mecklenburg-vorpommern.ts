import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN } from '../../lib/engine/kassen';
import { angestellt, selbststaendig } from '../../lib/engine/beitrag';

/** Mecklenburg-Vorpommern: Rangliste aus der Liste des GKV-Spitzenverbands, Saisonarbeit und Pendeln nach Hamburg. */
const p = landProfil('MV');
const hh = landProfil('HH');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const firmusHier = p.r.some((k) => k.id === 'bkk-firmus');
const saison = angestellt({ brutto: 1400, zb: p.billig.zb!, jahr: 2026, eltern: 'k1' });
const saisonNormal = angestellt({ brutto: 2100, zb: p.billig.zb!, jahr: 2026, eltern: 'k1' });
const selbstBillig = selbststaendig({ einkommen: BEISPIEL.gewinn, zb: p.billig.zb!, jahr: 2026, krankengeld: false, eltern: 'k1' }).selbst;
const selbstAok = selbststaendig({ einkommen: BEISPIEL.gewinn, zb: aok.zb!, jahr: 2026, krankengeld: false, eltern: 'k1' }).selbst;
const hhVorteil = Math.round((kostenZeile(p.billig).lohn - kostenZeile(hh.billig).lohn) * 12);

export default defineGuide({
  id: 'guenstigste-krankenkasse-mecklenburg-vorpommern',
  group: 'laender',
  order: 57,
  land: 'MV',
  tool: 'beitrag',
  toolPreset: { land: 'MV', kasse: 'aok-nordost-die-gesundheitskasse' },
  related: ['aok-nordost-die-gesundheitskasse', 'guenstigste-krankenkasse-schleswig-holstein', 'guenstigste-krankenkasse-brandenburg', 'midijob-krankenversicherung', 'zusatzbeitrag-liste'],
  sources: ['gkvListe', 'sgb4_20', 'sgb5_175', 'sgb5_242'],
  de: {
    slug: 'guenstigste-krankenkasse-mecklenburg-vorpommern',
    nav: 'Mecklenburg-Vorpommern',
    card: `${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; AOK Nordost mit ${DE.pk(aok.zb!)}, Pendler nach Hamburg haben mehr Auswahl.`,
    title: 'Günstigste Krankenkasse Mecklenburg-Vorpommern 2027',
    description: `Mecklenburg-Vorpommern 2026/2027: Krankenkassen ab ${DE.pk(p.billig.zb!)} Zusatzbeitrag, Monatsbeitrag in Euro, AOK Nordost, Saisonjobs im Übergangsbereich und Pendler.`,
    h1: 'Günstigste Krankenkasse in Mecklenburg-Vorpommern',
    intro: `Zwischen Ostseeküste und Seenplatte sind ${p.n} Kassen wählbar, ab ${DE.pk(p.billig.zb!)} bei ${p.billig.kurz}; die AOK Nordost liegt auf Platz ${p.aokRang}.`,
    resume: `In Mecklenburg-Vorpommern können Versicherte laut Liste des GKV-Spitzenverbands zwischen ${p.n} gesetzlichen Krankenkassen wählen. ${p.bund.length} davon sind bundesweit geöffnet, nur ${p.regional.length} haben ihre Satzung regional für das Land geöffnet. ${firmusHier ? 'BKK firmus gehört dazu.' : 'BKK firmus, anderswo an der Spitze, fehlt; die Liste beginnt deshalb mit'} ${firmusHier ? `Am günstigsten ist ${p.billig.kurz}` : p.billig.kurz} mit ${DE.pk(p.billig.zb!)}, am teuersten ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind macht das ${DE.eur(p.spanneJahr)} im Jahr für Sie aus. Zuständige Ortskrankenkasse ist die AOK Nordost, die auch Berlin und Brandenburg versichert, mit ${DE.pk(aok.zb!)}. Wer in Hamburg oder Schleswig-Holstein arbeitet, darf zusätzlich aus deren Listen wählen. In der Saison arbeiten viele im Übergangsbereich bis ${DE.eur(w.uebergang_oben)} im Monat, wo der eigene Anteil deutlich niedriger ausfällt als der volle Satz. Den genauen Betrag für Ihren Fall zeigt der Rechner oben.`,
    faqs: [
      { q: 'Welche Kasse ist in Mecklenburg-Vorpommern am günstigsten?', a: `${p.billig.kurz} mit ${DE.pk(p.billig.zb!)} Zusatzbeitrag, gefolgt von ${top.slice(1, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Mit ${DE.eur(BEISPIEL.lohn)} brutto zahlen Sie dort ${DE.eur(p.lohnBillig)} im Monat für Kranken- und Pflegeversicherung. Service, Geschäftsstellen und Zusatzleistungen vergleicht diese Reihenfolge nicht.` },
      { q: 'Was zahle ich in einem Saisonjob an der Küste mit 1.400 € brutto?', a: `Das liegt im Übergangsbereich zwischen Minijob-Grenze und ${DE.eur(w.uebergang_oben)}. Ihr Anteil wird dort nach § 20 Abs. 2a SGB IV ermäßigt: Bei ${p.billig.kurz} zahlen Sie ${DE.eur(saison.selbst)} im Monat für Kranken- und Pflegeversicherung, der Arbeitgeber trägt mehr als die Hälfte. Bis ${DE.eur(w.geringfuegigkeit)} zahlen Sie als Minijobber gar nichts.` },
      { q: 'Ich wohne in Schwerin und arbeite in Hamburg. Welche Kassen kann ich wählen?', a: `Alle, die für Mecklenburg-Vorpommern oder für Hamburg geöffnet sind, denn Wohn- und Arbeitsort zählen. In Hamburg führt ${hh.billig.kurz} mit ${DE.pk(hh.billig.zb!)} die Liste an. Gegenüber der günstigsten Kasse Ihres Wohnlandes sind das bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(Math.max(0, hhVorteil))} im Jahr weniger.` },
      { q: 'Wie teuer ist die AOK Nordost im Vergleich?', a: `Sie verlangt ${DE.pk(aok.zb!)}, ${aok.zb! > w.zb_durchschnitt ? 'mehr' : 'weniger'} als der amtliche Durchschnitt von ${DE.pz(w.zb_durchschnitt)}. Unter den ${aoks.length} AOKs hat sie den ${aokPlatz}. niedrigsten Satz. In Mecklenburg-Vorpommern steht sie auf Platz ${p.aokRang} von ${p.n}; gegenüber der günstigsten Kasse zahlen Mitglieder ${DE.eur(p.aokVsBillig)} im Jahr mehr.` },
      { q: 'Ich vermiete Ferienwohnungen und bin selbstständig. Wie hoch ist mein Beitrag?', a: `Als freiwillig versicherte Selbstständige zahlen Sie Kranken- und Pflegeversicherung allein, auf Ihren Gewinn, mindestens aber auf ${DE.eur(w.mindestFreiwillig, 2)} im Monat. Mit ${DE.eur(BEISPIEL.gewinn)} Gewinn und ohne Krankengeld sind das bei ${p.billig.kurz} ${DE.eur(selbstBillig)} und bei der AOK Nordost ${DE.eur(selbstAok)} im Monat. Den Zusatzbeitrag tragen Sie voll, deshalb wirkt ein Wechsel doppelt.` },
    ],
    body: (h) => `
<h2>Wenige regionale Kassen, klare Spitze</h2>
<p>Die meisten Betriebs- und Innungskrankenkassen öffnen ihre Satzung zuerst für die großen westdeutschen Länder. Mecklenburg-Vorpommern taucht in nur ${p.regional.length} dieser Satzungen auf, die Auswahl besteht deshalb vor allem aus bundesweiten Kassen. Für Sie hat das einen Vorteil: Die Rangliste ist überschaubar, und der Wechsel zur günstigsten bundesweiten Kasse ist von überall im Land möglich.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Saisonarbeit in Tourismus und Gastronomie</h2>
<p>Zwischen Ostern und Oktober arbeiten viele mit Löhnen knapp über der Minijob-Grenze. Bis ${h.eur(w.geringfuegigkeit)} im Monat sind Sie als Minijobber nicht selbst versichert und brauchen eine Familienversicherung oder eine eigene Mitgliedschaft. Darüber, bis ${h.eur(w.uebergang_oben)}, gilt der Übergangsbereich mit ermäßigtem Arbeitnehmeranteil. Der Zusatzbeitrag Ihrer Kasse wirkt auch hier, aber auf eine kleinere Bemessung, deshalb fällt die Ersparnis durch einen Wechsel geringer aus als bei vollem Lohn. Details im Ratgeber zum ${h.a('midijob-krankenversicherung', 'Midijob')}.</p>
${h.table(['Monatslohn', 'Ihr Anteil im Monat', 'Bereich'], [
  [h.eur(1400), h.eur(saison.selbst), 'Übergangsbereich'],
  [h.eur(2100), h.eur(saisonNormal.selbst), 'voller hälftiger Anteil'],
], `bei ${p.billig.kurz}, ein Kind, 2026`, ['l', 'r', 'l'])}
<h2>Pendeln nach Westen</h2>
<p>Wer aus Westmecklenburg nach Hamburg oder Lübeck pendelt, darf auch die Kassen der Länder ${h.a('guenstigste-krankenkasse-hamburg', 'Hamburg')} und ${h.a('guenstigste-krankenkasse-schleswig-holstein', 'Schleswig-Holstein')} wählen. Umgekehrt gilt die AOK Nordost auch in ${h.a('guenstigste-krankenkasse-brandenburg', 'Brandenburg')} und Berlin. Der Wechsel selbst ist überall gleich: Antrag bei der neuen Kasse, neue Mitgliedschaft ab dem übernächsten Monatsersten (${h.a('krankenkasse-wechseln', 'Fristen rechnen')}).</p>
<p>Für Rentnerinnen und Rentner in Rostock, Greifswald oder Neubrandenburg zählt allein der Zusatzbeitrag, halbiert, weil die Rentenversicherung die andere Hälfte trägt. Ändert eine Kasse ihren Satz, zieht die Rentenversicherung den neuen Beitrag erst ab dem zweiten Folgemonat ab. Mit ${h.eur(BEISPIEL.rente)} Rente zahlen Sie bei ${kLink(h, p.billig)} ${h.eur(kostenZeile(p.billig).rente)} im Monat, bei der AOK Nordost ${h.eur(kostenZeile(aok).rente)}.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-mecklenburg-western-pomerania',
    nav: 'Mecklenburg-Western Pomerania',
    card: `${p.n} funds from ${EN.pk(p.billig.zb!)}; AOK Nordost at ${EN.pk(aok.zb!)}, commuters to Hamburg have more choice.`,
    title: 'Cheapest Health Insurance Mecklenburg 2027: Funds, Euros',
    description: `Mecklenburg-Western Pomerania 2026/2027: health funds from ${EN.pk(p.billig.zb!)} additional rate, monthly cost in euros, AOK Nordost, seasonal jobs and commuting west.`,
    h1: 'Cheapest health insurance in Mecklenburg-Western Pomerania',
    intro: `Between the Baltic coast and the lake district ${p.n} funds are open, from ${EN.pk(p.billig.zb!)} at ${p.billig.kurz}; AOK Nordost ranks ${p.aokRang}.`,
    resume: `In Mecklenburg-Western Pomerania (Mecklenburg-Vorpommern) the GKV-Spitzenverband list lets you choose among ${p.n} statutory health funds. ${p.bund.length} are open nationwide and only ${p.regional.length} have opened their statutes regionally to the state. ${firmusHier ? 'BKK firmus is one of them, and the cheapest is' : 'BKK firmus, top of the list elsewhere, is missing, so the ranking starts with'} ${p.billig.kurz} at ${EN.pk(p.billig.zb!)}; the most expensive is ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child that makes ${EN.eur(p.spanneJahr)} a year in your share. The regional fund is AOK Nordost, which also covers Berlin and Brandenburg, at ${EN.pk(aok.zb!)}. If you work in Hamburg or Schleswig-Holstein, you may also choose from their lists. In the tourist season many people earn within the transition zone up to ${EN.eur(w.uebergang_oben)} a month, where their own share is well below the full rate. The calculator above shows the exact figure for your case.`,
    faqs: [
      { q: 'Which fund is cheapest in Mecklenburg-Western Pomerania?', a: `${p.billig.kurz} with an additional rate of ${EN.pk(p.billig.zb!)}, followed by ${top.slice(1, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. On ${EN.eur(BEISPIEL.lohn)} gross you pay ${EN.eur(p.lohnBillig)} a month there for health and care insurance. The order says nothing about service, branch offices or extra benefits.` },
      { q: 'What do I pay in a seasonal job on the coast earning €1,400 gross?', a: `That falls in the transition zone between the minijob limit and ${EN.eur(w.uebergang_oben)}. Your share is reduced under section 20(2a) SGB IV: at ${p.billig.kurz} you pay ${EN.eur(saison.selbst)} a month for health and care insurance, and the employer pays more than half. Up to ${EN.eur(w.geringfuegigkeit)} you pay nothing as a minijobber.` },
      { q: 'I live in Schwerin and work in Hamburg. Which funds can I join?', a: `Any fund open to Mecklenburg-Western Pomerania or to Hamburg, since home and workplace both count. In Hamburg ${hh.billig.kurz} leads at ${EN.pk(hh.billig.zb!)}. Compared with the cheapest fund in your home state that is ${EN.eur(Math.max(0, hhVorteil))} a year less on ${EN.eur(BEISPIEL.lohn)} gross.` },
      { q: 'How expensive is AOK Nordost by comparison?', a: `It charges ${EN.pk(aok.zb!)}, ${aok.zb! > w.zb_durchschnitt ? 'more' : 'less'} than the official average of ${EN.pz(w.zb_durchschnitt)}. Among the ${aoks.length} AOK funds it has rate number ${aokPlatz} from the bottom. In Mecklenburg-Western Pomerania it ranks ${p.aokRang} of ${p.n}; members pay ${EN.eur(p.aokVsBillig)} a year more than at the cheapest fund.` },
      { q: 'I let holiday flats as a self-employed person. What is my contribution?', a: `As a self-employed voluntary member you pay health and care insurance alone, on your profit but at least on ${EN.eur(w.mindestFreiwillig, 2)} a month. With ${EN.eur(BEISPIEL.gewinn)} profit and no sick pay that is ${EN.eur(selbstBillig)} a month at ${p.billig.kurz} and ${EN.eur(selbstAok)} at AOK Nordost. You carry the additional rate in full, so a switch counts double.` },
    ],
    body: (h) => `
<h2>Few regional funds, a clear leader</h2>
<p>Most company and guild funds open their statutes first to the big western states. Mecklenburg-Western Pomerania appears in only ${p.regional.length} of those statutes, so the choice consists mostly of nationwide funds. That has an upside: the ranking is easy to scan, and moving to the cheapest nationwide fund works from anywhere in the state.</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Seasonal work in tourism and hospitality</h2>
<p>Between Easter and October many people earn just above the minijob limit. Up to ${h.eur(w.geringfuegigkeit)} a month a minijob does not insure you, so you need family cover or your own membership. Above that, up to ${h.eur(w.uebergang_oben)}, the transition zone reduces the employee share. Your fund’s additional rate still applies, but on a smaller base, so switching saves less than on full pay. See the guide to ${h.a('midijob-krankenversicherung', 'midijobs')}.</p>
${h.table(['Monthly pay', 'Your share a month', 'Band'], [
  [h.eur(1400), h.eur(saison.selbst), 'transition zone'],
  [h.eur(2100), h.eur(saisonNormal.selbst), 'full half share'],
], `at ${p.billig.kurz}, one child, 2026`, ['l', 'r', 'l'])}
<h2>Commuting west</h2>
<p>If you commute from western Mecklenburg to Hamburg or Lübeck, you may also join funds open to ${h.a('guenstigste-krankenkasse-hamburg', 'Hamburg')} and ${h.a('guenstigste-krankenkasse-schleswig-holstein', 'Schleswig-Holstein')}. AOK Nordost, in turn, also covers ${h.a('guenstigste-krankenkasse-brandenburg', 'Brandenburg')} and Berlin. Switching itself works the same everywhere: apply to the new fund, and membership starts on the first day of the month after next (${h.a('krankenkasse-wechseln', 'work out the dates')}).</p>
<p>For pensioners in Rostock, Greifswald or Neubrandenburg only the additional rate differs, and only half of it, since the pension insurance pays the other half. When a fund changes its rate, the pension insurance deducts the new amount from the second month after the change. On a ${h.eur(BEISPIEL.rente)} pension you pay ${h.eur(kostenZeile(p.billig).rente)} a month at ${kLink(h, p.billig)} and ${h.eur(kostenZeile(aok).rente)} at AOK Nordost.</p>`,
  },
});
