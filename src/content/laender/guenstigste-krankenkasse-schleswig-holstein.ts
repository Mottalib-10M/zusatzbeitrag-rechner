import { defineGuide } from '../../lib/guide-types';
import { landProfil, kostenZeile, BEISPIEL, kLink } from '../../lib/kassen-daten';
import { J, DE, EN } from '../../lib/fmt';
import { KASSEN } from '../../lib/engine/kassen';
import { student, rentner } from '../../lib/engine/beitrag';

/** Schleswig-Holstein: Rangliste aus der Liste des GKV-Spitzenverbands; AOK NordWest, Pendeln nach Hamburg. */
const p = landProfil('SH');
const hh = landProfil('HH');
const w = J(2026);
const top = p.r.slice(0, 5).map(kostenZeile);
const aok = p.aok!;
const aoks = KASSEN.filter((k) => k.kassenart === 'AOK' && k.zb !== null);
const aokPlatz = aoks.filter((k) => k.zb! < aok.zb!).length + 1;
const firmusHier = p.r.some((k) => k.id === 'bkk-firmus');
const extraHh = hh.r.filter((k) => !p.r.some((x) => x.id === k.id));
const hhVorteil = Math.round((kostenZeile(p.billig).lohn - kostenZeile(hh.billig).lohn) * 12);
const studAok = student({ zb: aok.zb!, jahr: 2026, eltern: 'unter23' }).selbst;
const studBillig = student({ zb: p.billig.zb!, jahr: 2026, eltern: 'unter23' }).selbst;
const renteAok = rentner({ rente: BEISPIEL.rente, zb: aok.zb!, jahr: 2026, eltern: 'kinderlos' }).selbst;
const renteBillig = rentner({ rente: BEISPIEL.rente, zb: p.billig.zb!, jahr: 2026, eltern: 'kinderlos' }).selbst;
const aokBbg = Math.round((kostenZeile(aok).lohn - kostenZeile(p.billig).lohn) * 12);

export default defineGuide({
  id: 'guenstigste-krankenkasse-schleswig-holstein',
  group: 'laender',
  order: 64,
  land: 'SH',
  tool: 'beitrag',
  toolPreset: { land: 'SH', kasse: 'aok-nordwest-die-gesundheitskasse' },
  related: ['aok-nordwest-die-gesundheitskasse', 'guenstigste-krankenkasse-hamburg', 'guenstigste-krankenkasse-niedersachsen', 'guenstigste-krankenkasse-mecklenburg-vorpommern', 'krankenkasse-wechseln'],
  sources: ['gkvListe', 'sgb5_175', 'sgb5_242', 'sgb5_249'],
  de: {
    slug: 'guenstigste-krankenkasse-schleswig-holstein',
    nav: 'Schleswig-Holstein',
    card: `${p.n} Kassen ab ${DE.pk(p.billig.zb!)}; die AOK NordWest mit ${DE.pk(aok.zb!)}, mit Hamburger Arbeitsplatz mehr Auswahl.`,
    title: 'Günstigste Krankenkasse Schleswig-Holstein 2027 in Euro',
    description: `Schleswig-Holstein 2026/2027: Krankenkassen zwischen ${DE.pk(p.billig.zb!)} und ${DE.pk(p.teuer.zb!)} Zusatzbeitrag, Ihr Beitrag in Euro, die AOK NordWest und der Hamburger Arbeitsort.`,
    h1: 'Günstigste Krankenkasse in Schleswig-Holstein',
    intro: `Zwischen Nord- und Ostsee stehen ${p.n} Kassen zur Wahl, ab ${DE.pk(p.billig.zb!)}; die AOK NordWest steht auf Platz ${p.aokRang}.`,
    resume: `Schleswig-Holstein teilt seine Ortskrankenkasse mit einem weit entfernten Landesteil eines anderen Bundeslands: Die AOK NordWest versichert neben dem Norden auch Westfalen-Lippe in Nordrhein-Westfalen und verlangt überall ${DE.pk(aok.zb!)} Zusatzbeitrag. In der Rangliste des Landes steht sie damit auf Platz ${p.aokRang} von ${p.n}. Die Liste des GKV-Spitzenverbands nennt für Schleswig-Holstein ${p.bund.length} bundesweite und ${p.regional.length} regional geöffnete Kassen. ${firmusHier ? `Am günstigsten ist ${p.billig.kurz}` : `BKK firmus ist hier nicht geöffnet; am günstigsten ist deshalb ${p.billig.kurz}`} mit ${DE.pk(p.billig.zb!)}, am teuersten ${p.teuer.kurz} mit ${DE.pk(p.teuer.zb!)}. Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind beträgt der Unterschied ${DE.eur(p.spanneJahr)} im Jahr. Wer in Hamburg arbeitet, kann zusätzlich jede Kasse der Hamburger Liste wählen, was im Speckgürtel um Norderstedt oder Pinneberg für viele gilt. Rentner, Studierende und Selbstständige rechnen im Rechner oben mit ihrer eigenen Lage, die Rangliste sortiert sich dann neu.`,
    faqs: [
      { q: 'Welche AOK ist für Schleswig-Holstein zuständig?', a: `Die AOK NordWest. Sie entstand aus der Fusion der Ortskrankenkassen von Westfalen-Lippe und Schleswig-Holstein und hat in beiden Gebieten denselben Zusatzbeitrag von ${DE.pk(aok.zb!)}. Unter den ${aoks.length} AOKs hat sie den ${aokPlatz}. niedrigsten Satz. Für Kiel, Lübeck und Flensburg gilt also derselbe Preis wie für Dortmund oder Münster.` },
      { q: 'Lohnt sich für Pendler nach Hamburg die Hamburger Kassenliste?', a: `Über den Arbeitsort in Hamburg kommen ${extraHh.length} Kassen hinzu${extraHh.length ? `, darunter ${extraHh.slice(0, 3).map((k) => k.kurz).join(', ')}` : ''}. Die günstigste Hamburger Kasse, ${hh.billig.kurz} mit ${DE.pk(hh.billig.zb!)}, spart bei ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(Math.max(0, hhVorteil))} im Jahr gegenüber der günstigsten Kasse Schleswig-Holsteins. Den Arbeitsort geben Sie im Rechner oben als Bundesland an.` },
      { q: 'Wie viel spare ich, wenn ich die AOK NordWest verlasse?', a: `Bei ${DE.eur(BEISPIEL.lohn)} brutto und einem Kind zahlen Sie bei der günstigsten in Schleswig-Holstein wählbaren Kasse ${DE.eur(aokBbg)} im Jahr weniger. Der Betrag wächst mit dem Lohn bis zur Beitragsbemessungsgrenze von ${DE.eur(w.bbgKv, 2)} im Monat. Ob das gegen Beratung vor Ort aufwiegt, ist Ihre Entscheidung.` },
      { q: 'Welche Kassen führen die Rangliste in Schleswig-Holstein an?', a: `${top.slice(0, 4).map((x) => `${x.k.kurz} (${DE.pk(x.k.zb!)})`).join(', ')}. Bei ${p.billig.kurz} zahlen Sie mit ${DE.eur(BEISPIEL.lohn)} brutto ${DE.eur(p.lohnBillig)} im Monat für Kranken- und Pflegeversicherung. Die Reihenfolge berücksichtigt nur den Preis; Bonusprogramme und Zusatzleistungen stehen in den Satzungen.` },
      { q: 'Was zahlen Studierende in Kiel oder Flensburg bei der AOK NordWest?', a: `Studierende zahlen auf den gesetzlich festen BAföG-Bedarf von ${DE.eur(w.bafoeg_bedarf)} sieben Zehntel des allgemeinen Satzes, den vollen Zusatzbeitrag und die Pflege, alles allein. Bei der AOK NordWest sind das ${DE.eur(studAok)} im Monat, bei ${p.billig.kurz} ${DE.eur(studBillig)}. Bis zum 25. Geburtstag kommt meist auch die beitragsfreie Familienversicherung über die Eltern in Frage.` },
    ],
    body: (h) => `
<h2>Eine AOK für Kiel und Dortmund</h2>
<p>Wer die AOK für eine Kasse vor Ort hält, wird in Schleswig-Holstein überrascht: Die AOK NordWest rechnet mit den Versicherten aus Westfalen-Lippe und dem nördlichsten Bundesland gemeinsam. Ihr Satz von ${h.pk(aok.zb!)} liegt ${aok.zb! > w.zb_durchschnitt ? 'über' : 'unter'} dem amtlichen Durchschnitt von ${h.pz(w.zb_durchschnitt)}. In ${h.a('guenstigste-krankenkasse-nordrhein-westfalen', 'Nordrhein-Westfalen')} konkurriert sie mit einer zweiten AOK; im Norden ist sie die einzige.</p>
${h.table(['Kasse', 'Zusatzbeitrag', 'Ihr Beitrag im Monat', 'geöffnet'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'bundesweit' : `${x.k.laender.length} Länder`]), `Die günstigsten für Schleswig-Holstein, ${h.eur(BEISPIEL.lohn)} brutto, ein Kind, 2026`, ['l', 'r', 'r', 'l'])}
<h2>Der Hamburger Rand</h2>
<p>Der Süden des Landes ist eng mit ${h.a('guenstigste-krankenkasse-hamburg', 'Hamburg')} verflochten. Weil die Kassenwahl Wohn- und Arbeitsort kennt, haben Beschäftigte mit Hamburger Arbeitsplatz die größere Liste. Die Mitgliedschaft bleibt bestehen, wenn Sie später in Schleswig-Holstein arbeiten. Nach Osten grenzt ${h.a('guenstigste-krankenkasse-mecklenburg-vorpommern', 'Mecklenburg-Vorpommern')} mit der AOK Nordost, nach Süden ${h.a('guenstigste-krankenkasse-niedersachsen', 'Niedersachsen')} mit eigener AOK.</p>
<h2>Pflege und Wechsel</h2>
<p>Der Pflegebeitrag von ${h.pz(w.pv_satz)} wird in Schleswig-Holstein hälftig geteilt; Kinderlose ab 23 zahlen ${h.pz(w.pv_kinderlos)} allein dazu. Ein Kassenwechsel gilt ab dem übernächsten Monatsersten nach Ihrem Antrag bei der neuen Kasse, wenn Sie zwölf Monate gebunden waren oder Ihre Kasse den Satz erhöht hat (${h.a('krankenkasse-wechseln', 'Termine rechnen')}). Die Krankenversicherungskarte der alten Kasse gilt bis zum letzten Tag der Mitgliedschaft.</p>
<h2>Rente an der Küste</h2>
<p>Viele ziehen im Ruhestand an Nord- oder Ostsee. Mit der Rente bleibt man in der Regel pflichtversichert und zahlt den halben allgemeinen Satz, den halben Zusatzbeitrag und die volle Pflege; die Rentenversicherung trägt die andere Hälfte der Krankenversicherung. Eine kinderlose Rentnerin mit ${h.eur(BEISPIEL.rente)} Rente zahlt bei der AOK NordWest ${h.eur(renteAok)} im Monat, bei ${kLink(h, p.billig)} ${h.eur(renteBillig)}. Wer umzieht, darf die Kasse behalten; eine regionale Kasse, die für das neue Land nicht geöffnet ist, muss Sie nicht entlassen.</p>`,
  },
  en: {
    slug: 'cheapest-health-insurance-schleswig-holstein',
    nav: 'Schleswig-Holstein',
    card: `${p.n} funds from ${EN.pk(p.billig.zb!)}; AOK NordWest at ${EN.pk(aok.zb!)}, more choice with a Hamburg job.`,
    title: 'Cheapest Health Insurance Schleswig-Holstein 2027 in Euros',
    description: `Schleswig-Holstein 2026/2027: health funds between ${EN.pk(p.billig.zb!)} and ${EN.pk(p.teuer.zb!)} additional rate, your cost in euros, AOK NordWest and the Hamburg workplace rule.`,
    h1: 'Cheapest health insurance in Schleswig-Holstein',
    intro: `Between the North Sea and the Baltic ${p.n} funds are open, from ${EN.pk(p.billig.zb!)}; AOK NordWest ranks ${p.aokRang}.`,
    resume: `Schleswig-Holstein shares its regional fund with a distant part of another state: AOK NordWest covers the north and also Westphalia-Lippe in North Rhine-Westphalia, charging the same additional rate of ${EN.pk(aok.zb!)} everywhere. In the state ranking that puts it at ${p.aokRang} of ${p.n}. The GKV-Spitzenverband list names ${p.bund.length} nationwide and ${p.regional.length} regionally open funds for Schleswig-Holstein. ${firmusHier ? `The cheapest is ${p.billig.kurz}` : `BKK firmus is not open here, so the cheapest is ${p.billig.kurz}`} at ${EN.pk(p.billig.zb!)}, the most expensive ${p.teuer.kurz} at ${EN.pk(p.teuer.zb!)}. On ${EN.eur(BEISPIEL.lohn)} gross with one child the difference is ${EN.eur(p.spanneJahr)} a year. Anyone working in Hamburg may also choose any fund on the Hamburg list, which applies to many people in the commuter belt around Norderstedt or Pinneberg. Pensioners, students and the self-employed can set their own situation in the calculator above, and the ranking reorders itself.`,
    faqs: [
      { q: 'Which AOK covers Schleswig-Holstein?', a: `AOK NordWest. It came from the merger of the regional funds of Westphalia-Lippe and Schleswig-Holstein and charges the same additional rate of ${EN.pk(aok.zb!)} in both areas. Among the ${aoks.length} AOK funds its rate is number ${aokPlatz} from the bottom. Kiel, Lübeck and Flensburg thus pay the same price as Dortmund or Münster.` },
      { q: 'Is the Hamburg fund list worth it for commuters?', a: `A Hamburg workplace adds ${extraHh.length} funds${extraHh.length ? `, including ${extraHh.slice(0, 3).map((k) => k.kurz).join(', ')}` : ''}. The cheapest Hamburg fund, ${hh.billig.kurz} at ${EN.pk(hh.billig.zb!)}, saves ${EN.eur(Math.max(0, hhVorteil))} a year on ${EN.eur(BEISPIEL.lohn)} gross compared with the cheapest fund in Schleswig-Holstein. Enter Hamburg as the state in the calculator above to see your figures.` },
      { q: 'How much do I save by leaving AOK NordWest?', a: `On ${EN.eur(BEISPIEL.lohn)} gross with one child you pay ${EN.eur(aokBbg)} a year less at the cheapest fund open in Schleswig-Holstein. The amount grows with pay up to the contribution ceiling of ${EN.eur(w.bbgKv, 2)} a month. Whether that outweighs local advice is your call.` },
      { q: 'Which funds top the ranking in Schleswig-Holstein?', a: `${top.slice(0, 4).map((x) => `${x.k.kurz} (${EN.pk(x.k.zb!)})`).join(', ')}. At ${p.billig.kurz} you pay ${EN.eur(p.lohnBillig)} a month for health and care insurance on ${EN.eur(BEISPIEL.lohn)} gross. The order reflects price only; bonus schemes and extra benefits are in the funds’ statutes.` },
      { q: 'What do students in Kiel or Flensburg pay at AOK NordWest?', a: `Students pay seven tenths of the general rate, the full additional rate and care insurance, all alone, on the statutory BAföG need rate of ${EN.eur(w.bafoeg_bedarf)}. At AOK NordWest that is ${EN.eur(studAok)} a month, at ${p.billig.kurz} ${EN.eur(studBillig)}. Until their 25th birthday many can instead stay on free family cover through their parents.` },
    ],
    body: (h) => `
<h2>One AOK for Kiel and Dortmund</h2>
<p>If you think of the AOK as a local fund, Schleswig-Holstein is a surprise: AOK NordWest pools members from Westphalia-Lippe and Germany’s northernmost state. Its rate of ${h.pk(aok.zb!)} is ${aok.zb! > w.zb_durchschnitt ? 'above' : 'below'} the official average of ${h.pz(w.zb_durchschnitt)}. In ${h.a('guenstigste-krankenkasse-nordrhein-westfalen', 'North Rhine-Westphalia')} it competes with a second AOK; in the north it is the only one.</p>
${h.table(['Fund', 'Additional rate', 'You pay a month', 'open in'], top.map((x) => [kLink(h, x.k), h.pk(x.k.zb!), h.eur(x.lohn), x.k.art === 'bundesweit' ? 'nationwide' : `${x.k.laender.length} states`]), `The cheapest for Schleswig-Holstein, ${h.eur(BEISPIEL.lohn)} gross, one child, 2026`, ['l', 'r', 'r', 'l'])}
<h2>The Hamburg fringe</h2>
<p>The south of the state is closely tied to ${h.a('guenstigste-krankenkasse-hamburg', 'Hamburg')}. Because the choice of fund follows home and workplace, employees with a job in Hamburg get the longer list. Membership continues if you later work in Schleswig-Holstein. To the east lies ${h.a('guenstigste-krankenkasse-mecklenburg-vorpommern', 'Mecklenburg-Western Pomerania')} with AOK Nordost, to the south ${h.a('guenstigste-krankenkasse-niedersachsen', 'Lower Saxony')} with its own AOK.</p>
<h2>Care insurance and switching</h2>
<p>The ${h.pz(w.pv_satz)} care contribution is split in half in Schleswig-Holstein; childless members from 23 add ${h.pz(w.pv_kinderlos)} alone. A switch takes effect on the first day of the month after next following your application to the new fund, once you have been a member for twelve months or your fund has raised its rate (${h.a('krankenkasse-wechseln', 'work out the dates')}). The old fund’s card stays valid until the last day of membership.</p>
<h2>Retiring to the coast</h2>
<p>Many people move to the North Sea or Baltic coast in retirement. With a state pension you usually stay compulsorily insured and pay half the general rate, half the additional rate and full care insurance; the pension insurance pays the other half of the health contribution. A childless pensioner on ${h.eur(BEISPIEL.rente)} pays ${h.eur(renteAok)} a month at AOK NordWest and ${h.eur(renteBillig)} at ${kLink(h, p.billig)}. You may keep your fund when you move; a regional fund not open to your new state cannot drop you.</p>`,
  },
});
