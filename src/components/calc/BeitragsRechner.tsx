/**
 * Hauptrechner: Monatsbeitrag zur Kranken- und Pflegeversicherung bei der eigenen Kasse, Rangliste aller in
 * Ihrem Land wählbaren Kassen in Euro, Ersparnis im Jahr und frühester Wechseltermin.
 * Erster Render = Vorgaben des Builds (RECETTE §17.5); Link-Parameter erst im useEffect.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { Kopf, Zeilen, Aktionen, Rechenweg, kasten, rahmen, raster, tx, fm, type L, type Zeile } from './kit';
import { statusOpt, elternOpt, landOpt, kassenOpt, jahrOpt, hinweisText } from './opts';
import { beitrag, type Status, type Eltern, type Eingabe } from '../../lib/engine/beitrag';
import { KASSEN, rangliste, kasse as kasseById, LAND_NAME, LAENDER, type Land } from '../../lib/engine/kassen';
import { J, type Jahr } from '../../lib/engine/params';
import { wechsel, iso } from '../../lib/engine/wechsel';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { displayDate } from '../../lib/format';

declare const __BUILD_DAY__: string;

export interface Preset { status?: Status; land?: Land; kasse?: string; jahr?: Jahr; einkommen?: number; eltern?: Eltern }
interface Props { lang: L; preset?: Preset; methodHref?: string; kassenHref?: Record<string, string>; zeilen?: number }

const DEF = { status: 'angestellt' as Status, land: 'NW' as Land, kasse: 'barmer', jahr: 2026 as Jahr, eltern: 'k1' as Eltern };
const defEinkommen = (s: Status) => (s === 'rentner' ? 1600 : s === 'selbststaendig' ? 3000 : 3800);

export default function BeitragsRechner({ lang, preset = {}, methodHref, kassenHref = {}, zeilen = 8 }: Props) {
  const f = fm(lang);
  const startStatus = preset.status ?? DEF.status;
  const [status, setStatus] = useState<Status>(startStatus);
  const [einkommen, setEinkommen] = useState(preset.einkommen ?? defEinkommen(startStatus));
  const [land, setLand] = useState<Land>(preset.land ?? DEF.land);
  const [kid, setKid] = useState(preset.kasse ?? DEF.kasse);
  const [eltern, setEltern] = useState<Eltern>(preset.eltern ?? (startStatus === 'student' ? 'unter23' : DEF.eltern));
  const [jahr, setJahr] = useState<Jahr>(preset.jahr ?? DEF.jahr);
  const [betriebsrente, setBetriebsrente] = useState(0);
  const [krankengeld, setKrankengeld] = useState(false);
  const [alle, setAlle] = useState(false);
  const [heute, setHeute] = useState(__BUILD_DAY__);

  useEffect(() => {
    const u = readParams(window.location.search);
    const s = str(u, 'st', startStatus) as Status;
    if (['angestellt', 'rentner', 'selbststaendig', 'student'].includes(s)) setStatus(s);
    setEinkommen(num(u, 'e', preset.einkommen ?? defEinkommen(s)));
    const l = str(u, 'l', preset.land ?? DEF.land) as Land; if ((LAENDER as readonly string[]).includes(l)) setLand(l);
    const k = str(u, 'k', preset.kasse ?? DEF.kasse); if (KASSEN.some((x) => x.id === k && x.zb !== null)) setKid(k);
    const el = str(u, 'el', eltern) as Eltern; setEltern(el);
    const j = num(u, 'j', preset.jahr ?? DEF.jahr); if (j === 2026 || j === 2027) setJahr(j);
    setBetriebsrente(num(u, 'br', 0)); setKrankengeld(str(u, 'kg', '0') === '1');
    setHeute(new Date().toISOString().slice(0, 10));
  }, []);
  useEffect(() => { updateURL({ st: status, e: einkommen, l: land, k: kid, el: eltern, j: jahr, br: betriebsrente || undefined, kg: krankengeld ? 1 : undefined }); }, [status, einkommen, land, kid, eltern, jahr, betriebsrente, krankengeld]);

  const w = J(jahr);
  const eigene = kasseById(kid);
  const eingabe: Eingabe = { status, einkommen, betriebsrente, krankengeld, sachsen: land === 'SN', eltern, jahr };
  const r = useMemo(() => beitrag(eingabe, eigene.zb ?? w.zb_durchschnitt), [status, einkommen, betriebsrente, krankengeld, land, eltern, jahr, kid]);
  const liste = useMemo(() => rangliste(land).map((k) => {
    const x = beitrag(eingabe, k.zb!);
    return { k, selbst: x.selbst, diffJahr: Math.round((r.selbst - x.selbst) * 12 * 100) / 100 };
  }), [land, r]);
  const best = liste[0];
  const eigeneWaehlbar = liste.some((x) => x.k.id === kid);
  const rang = eigeneWaehlbar ? liste.filter((x) => x.k.zb! < eigene.zb!).length + 1 : 0;
  const sparen = best ? Math.max(0, best.diffJahr) : 0;

  // Frühester Wechsel bei Erklärung im laufenden Monat, Bindung erfüllt angenommen (§ 175 Abs. 4 SGB V).
  const [hy, hm] = heute.split('-').map(Number);
  const wx = wechsel({ y: hy, m: hm }, { y: hy - 2, m: hm }, null);
  const tag = (m: { y: number; m: number }) => displayDate(iso(m), lang === 'de' ? 'de-DE' : 'en-GB');

  const andere = r.andere === 'arbeitgeber' ? tx(lang, 'Arbeitgeber', 'Employer') : r.andere === 'rentenversicherung' ? tx(lang, 'Rentenversicherung', 'Pension fund') : '';
  const kvLabel = status === 'student' ? tx(lang, `Krankenversicherung (${f.ps(r.kvSatz)} + ${f.pz(r.zb)})`, `Health insurance (${f.ps(r.kvSatz)} + ${f.pz(r.zb)})`)
    : tx(lang, `Krankenversicherung (${f.ps(r.kvSatz)} + ${f.pz(r.zb)})`, `Health insurance (${f.ps(r.kvSatz)} + ${f.pz(r.zb)})`);
  const rows: Zeile[] = [
    { label: tx(lang, 'Beitragspflichtige Einnahme', 'Contributory income'), value: f.eur(r.basisKv), muted: true },
    { label: `${kvLabel}${andere ? tx(lang, ', Ihr Anteil', ', your share') : ''}`, value: f.eur(r.kv.mitglied) },
    { label: tx(lang, `davon Zusatzbeitrag ${eigene.kurz}`, `of which ${eigene.kurz} additional rate`), value: f.eur(r.zbSelbst), muted: true },
    { label: tx(lang, `Pflegeversicherung${r.pvZuAb > 0 ? ' mit Kinderlosenzuschlag' : r.pvZuAb < 0 ? ' mit Kinderabschlag' : ''}`, `Long-term care${r.pvZuAb > 0 ? ' incl. childless surcharge' : r.pvZuAb < 0 ? ' incl. child discount' : ''}`), value: f.eur(r.pv.mitglied) },
    { label: tx(lang, 'Sie zahlen im Monat', 'You pay a month'), value: f.eur(r.selbst), strong: true, sep: true },
  ];
  if (andere) rows.push({ label: tx(lang, `${andere} zahlt dazu`, `${andere} adds`), value: f.eur(r.kv.andere + r.pv.andere), muted: true });
  rows.push({ label: tx(lang, 'Im Jahr (Ihr Anteil)', 'A year (your share)'), value: f.eur(r.selbst * 12), muted: true });

  const steps = [
    tx(lang, `Einnahme ${f.eur(Math.max(einkommen, 0))} → beitragspflichtig ${f.eur(r.basisKv)} (Grenze ${jahr}: ${f.eur(w.bbgKv)} im Monat).`, `Income ${f.eur(Math.max(einkommen, 0))} → contributory ${f.eur(r.basisKv)} (ceiling ${jahr}: ${f.eur(w.bbgKv)} a month).`),
    tx(lang, `Kranken­versicherung: ${f.ps(r.kvSatz)} allgemeiner oder ermäßigter Satz plus ${f.pz(r.zb)} Zusatzbeitrag der ${eigene.kurz}${andere ? `, je zur Hälfte mit ${andere}` : ', allein getragen'}.`, `Health: ${f.ps(r.kvSatz)} general or reduced rate plus ${f.pz(r.zb)} ${eigene.kurz} additional rate${andere ? `, split half and half with the ${andere.toLowerCase()}` : ', paid in full by you'}.`),
    tx(lang, `Pflege: ${f.ps(r.pvSatz)}${r.pvZuAb ? ` ${r.pvZuAb > 0 ? '+' : '−'} ${f.ps(Math.abs(r.pvZuAb))}` : ''}${land === 'SN' && status === 'angestellt' ? ', in Sachsen 0,5 Punkte mehr für Beschäftigte' : ''}.`, `Care: ${f.ps(r.pvSatz)}${r.pvZuAb ? ` ${r.pvZuAb > 0 ? '+' : '−'} ${f.ps(Math.abs(r.pvZuAb))}` : ''}${land === 'SN' && status === 'angestellt' ? ', employees in Saxony pay 0.5 points more' : ''}.`),
  ];
  const hinweise = r.hinweise.map((h) => hinweisText(h, lang, w)).filter(Boolean) as string[];
  const zeigen = alle ? liste : liste.slice(0, zeilen);
  const text = () => tx(lang, `${eigene.kurz}: ${f.eur(r.selbst)} im Monat. Günstigste in ${LAND_NAME[land].de}: ${best?.k.kurz} (${f.pz(best?.k.zb ?? 0)}), ${f.eur(sparen)} weniger im Jahr.`,
    `${eigene.kurz}: ${f.eur(r.selbst)} a month. Cheapest in ${LAND_NAME[land].en}: ${best?.k.kurz} (${f.pz(best?.k.zb ?? 0)}), ${f.eur(sparen)} less a year.`);

  return (
    <div className={rahmen}>
      <div className={raster}>
        <form className="grid content-start gap-x-4 gap-y-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-x-4 gap-y-5 sm:col-span-2 sm:grid-cols-2">
            <SelectField id="st" label={tx(lang, 'Sie sind', 'You are')} value={status} onChange={(v) => { const s = v as Status; setStatus(s); setEinkommen(defEinkommen(s)); if (s === 'student' && eltern === 'k1') setEltern('unter23'); }} options={statusOpt(lang)} />
            {status === 'student'
              ? <div className="grid grid-rows-subgrid row-span-3 content-start"><span className="mb-1 block text-sm font-medium text-navy-700">{tx(lang, 'Beitragsgrundlage', 'Contribution base')}</span><p className="flex h-12 items-center rounded-lg border border-dashed border-navy-300 px-4 text-navy-800 tabular-nums">{f.eur(w.bafoeg_bedarf)}</p><p className="mt-1 text-xs text-navy-600">{tx(lang, 'BAföG-Bedarf, gesetzlich fest (§ 236 SGB V)', 'BAföG need rate, fixed by law')}</p></div>
              : <NumberField id="e" lang={lang} label={status === 'rentner' ? tx(lang, 'Gesetzliche Rente brutto im Monat', 'Gross state pension a month') : status === 'selbststaendig' ? tx(lang, 'Gewinn im Monat', 'Profit a month') : tx(lang, 'Bruttolohn im Monat', 'Gross pay a month')} value={einkommen} onChange={setEinkommen} unit="€" max={1_000_000}
                  help={status === 'selbststaendig' ? tx(lang, 'laut letztem Steuerbescheid ÷ 12', 'from your last tax assessment ÷ 12') : status === 'rentner' ? tx(lang, 'Betrag vor Abzug laut Rentenbescheid', 'amount before deductions') : tx(lang, 'ohne Einmalzahlungen', 'excluding one-off payments')} />}
          </div>
          <SelectField id="l" label={tx(lang, 'Bundesland (Wohn- oder Arbeitsort)', 'State (home or work)')} value={land} onChange={(v) => setLand(v as Land)} options={landOpt(lang)} />
          <SelectField id="k" label={tx(lang, 'Ihre Krankenkasse heute', 'Your health fund today')} value={kid} onChange={setKid} options={kassenOpt(lang)} />
          <SelectField id="el" label={tx(lang, 'Kinder (Pflegeversicherung)', 'Children (care insurance)')} value={eltern} onChange={(v) => setEltern(v as Eltern)} options={elternOpt(lang)} />
          <Toggle id="j" label={tx(lang, 'Jahr', 'Year')} value={String(jahr)} onChange={(v) => setJahr(Number(v) as Jahr)} options={jahrOpt(lang)} />
          {status === 'rentner' && <NumberField id="br" lang={lang} label={tx(lang, 'Betriebsrente im Monat', 'Company pension a month')} value={betriebsrente} onChange={setBetriebsrente} unit="€" max={100_000} help={tx(lang, `KV-Freibetrag ${f.eur(w.vbFrei, 2)}`, `health allowance ${f.eur(w.vbFrei, 2)}`)} />}
          {status === 'selbststaendig' && <Toggle id="kg" label={tx(lang, 'Krankengeld absichern?', 'Insure sick pay?')} value={krankengeld ? '1' : '0'} onChange={(v) => setKrankengeld(v === '1')} options={[{ value: '0', label: tx(lang, 'Nein', 'No') }, { value: '1', label: tx(lang, 'Ja', 'Yes') }]} />}
        </form>
        <div className={`${kasten} lg:col-start-2 lg:row-span-2 lg:row-start-1`} data-resultat aria-live="polite">
          <Kopf label={tx(lang, `Ihr Beitrag bei ${eigene.kurz}, ${jahr}`, `Your contribution at ${eigene.kurz}, ${jahr}`)} wert={f.eur(r.selbst)}
            unter={tx(lang, `im Monat · Zusatzbeitrag ${f.pz(eigene.zb ?? 0)}`, `a month · additional rate ${f.pz(eigene.zb ?? 0)}`)} />
          <Zeilen rows={rows} />
          {best && (
            <p className="mt-4 rounded-lg bg-white p-3 text-sm text-navy-800">
              {sparen > 0
                ? tx(lang, <>Günstigste wählbare Kasse in {LAND_NAME[land].de}: <strong>{best.k.kurz}</strong> ({f.pz(best.k.zb!)}). Sie zahlen dort <strong>{f.eur(sparen)} weniger im Jahr</strong>.</>, <>Cheapest fund open in {LAND_NAME[land].en}: <strong>{best.k.kurz}</strong> ({f.pz(best.k.zb!)}). You would pay <strong>{f.eur(sparen)} less a year</strong>.</>)
                : tx(lang, <>{eigene.kurz} hat bereits den niedrigsten Zusatzbeitrag der in {LAND_NAME[land].de} wählbaren Kassen.</>, <>{eigene.kurz} already has the lowest additional rate of the funds open in {LAND_NAME[land].en}.</>)}
              {eigeneWaehlbar ? tx(lang, ` Rang ${rang} von ${liste.length}.`, ` Rank ${rang} of ${liste.length}.`) : tx(lang, ' Ihre Kasse ist dort nicht frei wählbar.', ' Your fund is not open to everyone there.')}
            </p>
          )}
          <p className="mt-3 text-sm text-navy-700">{tx(lang, `Heute gewählt: neue Kasse ab ${tag(wx.beginn)}, wenn Sie seit mindestens zwölf Monaten Mitglied sind.`, `Chosen today: new fund from ${tag(wx.beginn)}, provided you have been a member for at least twelve months.`)}</p>
          <Aktionen lang={lang} text={text} />
          {hinweise.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-navy-700">{hinweise.map((h) => <li key={h}>{h}</li>)}</ul>}
          <Rechenweg lang={lang} steps={steps} />
          <p className="mt-3 text-xs text-navy-600">{tx(lang, 'Schätzung nach SGB V und SGB XI. Verbindlich ist die Berechnung Ihrer Kasse oder Ihres Arbeitgebers. ', 'Estimate under Books V and XI of the Social Code. Your fund’s or employer’s calculation is binding. ')}{methodHref && <a className="underline" href={methodHref}>{tx(lang, 'So rechnen wir', 'How we calculate')}</a>}</p>
        </div>
      <div className="mt-8 lg:col-start-1 lg:row-start-2 lg:mt-2">
        <p className="font-serif text-lg font-semibold text-navy-900">{tx(lang, `Alle ${liste.length} Kassen, die Sie in ${LAND_NAME[land].de} wählen können, in Euro`, `All ${liste.length} funds you can join in ${LAND_NAME[land].en}, in euros`)}</p>
        <div className="mt-2 overflow-x-auto">
          <table className="journal w-full min-w-[34rem] text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wide text-navy-700">
              <th scope="col" className="py-2 pr-2">#</th><th scope="col" className="py-2 pr-2">{tx(lang, 'Kasse', 'Fund')}</th><th scope="col" className="py-2 pr-2 text-right">{tx(lang, 'Zusatzbeitrag', 'Add. rate')}</th>
              <th scope="col" className="py-2 pr-2 text-right">{tx(lang, 'Sie zahlen/Monat', 'You pay/month')}</th><th scope="col" className="py-2 text-right">{tx(lang, 'gegenüber heute/Jahr', 'vs today/year')}</th>
            </tr></thead>
            <tbody>
              {zeigen.map((x, i) => (
                <tr key={x.k.id} className={`border-t border-navy-100 ${x.k.id === kid ? 'bg-accent-50 font-semibold' : ''}`}>
                  <td className="py-1.5 pr-2 tabular-nums text-navy-600">{liste.filter((y) => y.k.zb! < x.k.zb!).length + 1}</td>
                  <td className="py-1.5 pr-2 text-navy-900">{kassenHref[x.k.id] ? <a className="underline" href={kassenHref[x.k.id]}>{x.k.kurz}</a> : x.k.kurz}{x.k.art === 'regional' ? <span className="text-navy-600"> · {tx(lang, 'regional', 'regional')}</span> : null}</td>
                  <td className="py-1.5 pr-2 text-right tabular-nums">{f.pz(x.k.zb!)}</td>
                  <td className="py-1.5 pr-2 text-right tabular-nums">{f.eur(x.selbst)}</td>
                  <td className={`py-1.5 text-right tabular-nums ${x.diffJahr > 0 ? 'text-green-800' : x.diffJahr < 0 ? 'text-accent-700' : 'text-navy-600'}`}>{x.diffJahr === 0 ? '±0' : `${x.diffJahr > 0 ? '−' : '+'}${f.eur(Math.abs(x.diffJahr))}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {liste.length > zeilen && <button type="button" className="no-print mt-3 rounded-md border border-navy-300 px-3 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-50" onClick={() => setAlle(!alle)}>{alle ? tx(lang, 'Weniger zeigen', 'Show fewer') : tx(lang, `Alle ${liste.length} zeigen`, `Show all ${liste.length}`)}</button>}
        <p className="mt-2 text-xs text-navy-600">{tx(lang, `Minus = Sie zahlen dort im Jahr weniger als bei ${eigene.kurz}. Betriebskrankenkassen, die nur Beschäftigten ihres Trägers offenstehen, fehlen hier.${w.vorlaeufig ? ' 2027: Rechengrößen vorläufig, Kassensätze von heute, bis die Kassen ihre neuen Sätze melden.' : ''}`, `Minus = you pay less a year than at ${eigene.kurz}. Company funds open only to their own staff are left out.${w.vorlaeufig ? ' 2027: provisional thresholds, today’s fund rates until funds report new ones.' : ''}`)}</p>
      </div>
      </div>
    </div>
  );
}
