/** Familienversicherung (§ 10 SGB V): Einkommensgrenze 2026/2027 und, für Ehegatten, der Zuschlag nach § 242b SGB V ab 2028. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { Kopf, Zeilen, Aktionen, Rechenweg, kasten, rahmen, raster, tx, fm, type L, type Zeile } from './kit';
import { janeinOpt, jahrOpt } from './opts';
import { familienversicherung } from '../../lib/engine/beitrag';
import { J, P, type Jahr } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { lang: L; methodHref?: string }

export default function FamilieRechner({ lang, methodHref }: Props) {
  const f = fm(lang);
  const [einkommen, setEinkommen] = useState(450);
  const [minijob, setMinijob] = useState('0');
  const [jahr, setJahr] = useState<Jahr>(2026);
  const [wer, setWer] = useState('ehe');
  const [brutto, setBrutto] = useState(4200);
  const [kind12, setKind12] = useState('0');
  useEffect(() => {
    const u = readParams(window.location.search);
    setEinkommen(num(u, 'e', 450)); setMinijob(str(u, 'm', '0')); const j = num(u, 'j', 2026); if (j === 2026 || j === 2027) setJahr(j);
    setWer(str(u, 'w', 'ehe')); setBrutto(num(u, 'b', 4200)); setKind12(str(u, 'k', '0'));
  }, []);
  useEffect(() => { updateURL({ e: einkommen, m: minijob, j: jahr, w: wer, b: brutto, k: kind12 }); }, [einkommen, minijob, jahr, wer, brutto, kind12]);

  const w = J(jahr);
  const r = familienversicherung({ einkommen, minijob: minijob === '1', jahr });
  const Z = P.ehegattenzuschlag_2028;
  // Zuschlag 2,5 Punkte auf die beitragspflichtigen Einnahmen des Mitglieds; Grenze 2028 noch nicht festgesetzt, daher die von 2027.
  const zuschlag = wer === 'ehe' && kind12 !== '1' ? Math.round(Math.min(brutto, J(2027).bbgKv) * Z.punkte) / 100 : 0;
  const rows: Zeile[] = [
    { label: tx(lang, `Grenze ${jahr}`, `Limit ${jahr}`), value: f.eur(r.grenze) },
    { label: tx(lang, 'Gesamteinkommen der Person', 'That person’s total income'), value: f.eur(einkommen) },
    { label: r.moeglich ? tx(lang, 'Luft bis zur Grenze', 'Room below the limit') : tx(lang, 'Über der Grenze um', 'Above the limit by'), value: f.eur(Math.abs(r.abstand)), strong: true, sep: true },
  ];
  if (wer === 'ehe') rows.push({ label: tx(lang, `Zuschlag ab 2028 für das Mitglied (${f.ps(Z.punkte, 1)})`, `Surcharge from 2028 for the member (${f.ps(Z.punkte, 1)})`), value: kind12 === '1' ? tx(lang, 'entfällt', 'none') : tx(lang, `${f.eur(zuschlag)} im Monat`, `${f.eur(zuschlag)} a month`) });
  const steps = [
    tx(lang, `Grenze: ein Siebtel der Bezugsgröße (${f.eur(w.bezugsgroesse_monat)} ÷ 7 = ${f.eur(w.famGrenze)}), mit Minijob die Minijob-Grenze von ${f.eur(w.geringfuegigkeit)} (§ 10 Abs. 1 SGB V).`, `Limit: one seventh of the reference value (${f.eur(w.bezugsgroesse_monat)} ÷ 7 = ${f.eur(w.famGrenze)}), or the minijob limit of ${f.eur(w.geringfuegigkeit)} for a minijob (section 10(1) SGB V).`),
    tx(lang, 'Gesamteinkommen: Lohn, Gewinn, Rente (ohne Kindererziehungszeiten), Mieten und Kapitalerträge über dem Sparerpauschbetrag, jeweils im Monatsdurchschnitt.', 'Total income: pay, profit, pension (excluding child-raising credits), rent and investment income above the saver’s allowance, as a monthly average.'),
    tx(lang, `Ehegattenzuschlag: ${f.ps(Z.punkte, 1)} auf den Beitragssatz des Mitglieds ab 1. Januar 2028, nicht bei einem Kind unter ${Z.kind_unter} im Haushalt, bei Pflege, Regelaltersgrenze oder Erwerbsminderung (§ 242b SGB V).`, `Spouse surcharge: ${f.ps(Z.punkte, 1)} on the member’s rate from 1 January 2028, not with a child under ${Z.kind_unter} in the household, caring, pension age or reduced earning capacity (section 242b SGB V).`),
  ];
  const text = () => tx(lang, `Familienversicherung ${jahr}: Grenze ${f.eur(r.grenze)}, ${r.moeglich ? 'möglich' : 'nicht möglich'}.`, `Family cover ${jahr}: limit ${f.eur(r.grenze)}, ${r.moeglich ? 'possible' : 'not possible'}.`);
  return (
    <div className={rahmen}>
      <div className={raster}>
        <form className="grid content-start gap-x-4 gap-y-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <NumberField id="fe" lang={lang} label={tx(lang, 'Einkommen der mitversicherten Person', 'Income of the family member')} value={einkommen} onChange={setEinkommen} unit="€" max={100_000} help={tx(lang, 'im Monat, alle Einkünfte zusammen', 'a month, all income together')} />
          <Toggle id="fm" label={tx(lang, 'Ist es ein Minijob?', 'Is it a minijob?')} value={minijob} onChange={setMinijob} options={janeinOpt(lang)} />
          <Toggle id="fj" label={tx(lang, 'Jahr', 'Year')} value={String(jahr)} onChange={(v) => setJahr(Number(v) as Jahr)} options={jahrOpt(lang)} />
          <Toggle id="fw" label={tx(lang, 'Mitversichert ist', 'Covered person is')} value={wer} onChange={setWer} options={[{ value: 'ehe', label: tx(lang, 'Ehepartner', 'Spouse') }, { value: 'kind', label: tx(lang, 'Kind', 'Child') }]} />
          {wer === 'ehe' && <NumberField id="fb" lang={lang} label={tx(lang, 'Ihr Bruttolohn (Mitglied)', 'Your gross pay (member)')} value={brutto} onChange={setBrutto} unit="€" max={1_000_000} />}
          {wer === 'ehe' && <Toggle id="fk" label={tx(lang, `Kind unter ${Z.kind_unter} im Haushalt?`, `Child under ${Z.kind_unter} at home?`)} value={kind12} onChange={setKind12} options={janeinOpt(lang)} />}
        </form>
        <div className={kasten} data-resultat aria-live="polite">
          <Kopf label={tx(lang, `Familienversicherung ${jahr}`, `Family cover ${jahr}`)} wert={r.moeglich ? tx(lang, 'möglich', 'possible') : tx(lang, 'nicht möglich', 'not possible')}
            unter={r.moeglich ? tx(lang, 'beitragsfrei über das Mitglied', 'free through the member') : tx(lang, 'eigene Mitgliedschaft nötig', 'own membership needed')} />
          <Zeilen rows={rows} />
          <Aktionen lang={lang} text={text} />
          <Rechenweg lang={lang} steps={steps} />
          <p className="mt-3 text-xs text-navy-600">{tx(lang, 'Über die Familienversicherung entscheidet Ihre Krankenkasse anhand des Fragebogens. ', 'Your health fund decides on family cover from its questionnaire. ')}{methodHref && <a className="underline" href={methodHref}>{tx(lang, 'So rechnen wir', 'How we calculate')}</a>}</p>
        </div>
      </div>
    </div>
  );
}
