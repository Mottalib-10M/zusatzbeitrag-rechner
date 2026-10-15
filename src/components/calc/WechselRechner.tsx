/** Fristen beim Kassenwechsel (§ 175 Abs. 4 SGB V): ab wann die neue Kasse gilt, mit oder ohne Sonderkündigungsrecht. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { Kopf, Zeilen, Aktionen, Rechenweg, kasten, rahmen, raster, tx, fm, type L, type Zeile } from './kit';
import { janeinOpt } from './opts';
import { wechsel, renteAb, plus, type Monat } from '../../lib/engine/wechsel';
import { readParams, str, num, updateURL } from '../../lib/url-state';
import { J } from '../../lib/engine/params';

declare const __BUILD_DAY__: string;
interface Props { lang: L; methodHref?: string }

const key = (m: Monat) => `${m.y}-${String(m.m).padStart(2, '0')}`;
const vonKey = (s: string): Monat => { const [y, m] = s.split('-').map(Number); return { y, m }; };
const MONATE = (l: L) => Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2026, i, 1)).toLocaleDateString(l === 'de' ? 'de-DE' : 'en-GB', { month: 'long', timeZone: 'UTC' }));

export default function WechselRechner({ lang, methodHref }: Props) {
  const f = fm(lang);
  const name = (m: Monat) => `${MONATE(lang)[m.m - 1]} ${m.y}`;
  const eins = (m: Monat) => (lang === 'de' ? `1. ${name(m)}` : `1 ${name(m)}`);
  const start = vonKey(__BUILD_DAY__.slice(0, 7));
  const [heute, setHeute] = useState<Monat>(start);
  const [erkl, setErkl] = useState(key(start));
  const [seit, setSeit] = useState(key(plus(start, -36)));
  const [erh, setErh] = useState('1');
  const [erhAb, setErhAb] = useState(key({ y: start.m >= 11 ? start.y + 1 : start.y, m: start.m >= 11 ? 1 : start.m + 1 }));
  const [diffPunkte, setDiffPunkte] = useState(0.5);
  const [brutto, setBrutto] = useState(3800);
  const [rente, setRente] = useState('0');
  useEffect(() => {
    const now = vonKey(new Date().toISOString().slice(0, 7)); setHeute(now);
    const u = readParams(window.location.search);
    setErkl(str(u, 'x', key(now))); setSeit(str(u, 's', key(plus(now, -36)))); setErh(str(u, 'h', '1'));
    setErhAb(str(u, 'ha', key({ y: now.m >= 11 ? now.y + 1 : now.y, m: now.m >= 11 ? 1 : now.m + 1 })));
    setDiffPunkte(num(u, 'd', 0.5)); setBrutto(num(u, 'b', 3800)); setRente(str(u, 'r', '0'));
  }, []);
  useEffect(() => { updateURL({ x: erkl, s: seit, h: erh, ha: erhAb, d: diffPunkte, b: brutto, r: rente }); }, [erkl, seit, erh, erhAb, diffPunkte, brutto, rente]);

  const monatsListe = useMemo(() => Array.from({ length: 30 }, (_, i) => plus(heute, i - 6)), [heute]);
  const seitListe = useMemo(() => Array.from({ length: 72 }, (_, i) => plus(heute, -i)), [heute]);
  const r = wechsel(vonKey(erkl), vonKey(seit), erh === '1' ? vonKey(erhAb) : null);
  // Mehrkosten in der Zeit mit dem erhöhten Satz: Ihr halber Anteil der Erhöhung auf Ihr Brutto (Beschäftigte).
  const mehrMonat = Math.round(Math.min(brutto, J(vonKey(erhAb).y >= 2027 ? 2027 : 2026).bbgKv) * (diffPunkte / 2)) / 100;
  const rows: Zeile[] = [
    { label: tx(lang, 'Wahl der neuen Kasse', 'You join the new fund in'), value: name(vonKey(erkl)) },
    { label: tx(lang, 'Letzter Monat bei der alten Kasse', 'Last month with the old fund'), value: name(r.letzterMonat) },
    { label: tx(lang, 'Neue Kasse ab', 'New fund from'), value: eins(r.beginn), strong: true, sep: true },
  ];
  if (erh === '1') rows.push({ label: tx(lang, 'Monate mit dem erhöhten Satz', 'Months at the higher rate'), value: String(r.monateErhoeht) }, { label: tx(lang, 'Mehrkosten in dieser Zeit (Ihr Anteil)', 'Extra cost meanwhile (your share)'), value: f.eur(mehrMonat * r.monateErhoeht) });
  if (rente === '1' && erh === '1') rows.push({ label: tx(lang, 'Rente: erhöhter Satz wird abgezogen ab', 'Pension: higher rate deducted from'), value: eins(renteAb(vonKey(erhAb))), muted: true });
  const grund = r.grund === 'bindung' ? tx(lang, 'Die zwölf Monate Bindung sind zum Wechseltermin erfüllt: normale Kündigung.', 'The twelve-month lock-in is over by the switch date: ordinary termination.')
    : r.grund === 'sonder' ? tx(lang, 'Sonderkündigungsrecht wegen der Erhöhung: Die Bindung von zwölf Monaten gilt nicht.', 'Special termination right because of the increase: the twelve-month lock-in does not apply.')
    : tx(lang, `Noch gebunden. Frühestens im ${name(r.fruehestens)} wählen, dann neue Kasse ab ${eins(r.beginn)}.`, `Still locked in. Join the new fund in ${name(r.fruehestens)} at the earliest; it starts on ${eins(r.beginn)}.`);
  const steps = [
    tx(lang, 'Bindung: mindestens zwölf Monate ab Beginn der Mitgliedschaft (§ 175 Abs. 4 Satz 1 SGB V).', 'Lock-in: at least twelve months from the start of membership (section 175(4), sentence 1).'),
    tx(lang, 'Frist: zum Ablauf des übernächsten Kalendermonats, gerechnet ab dem Monat der Erklärung (Satz 3). Die neue Kasse meldet den Wechsel, eine eigene Kündigung ist nicht nötig (Satz 4).', 'Notice: to the end of the month after next, counted from the month you declare (sentence 3). The new fund notifies the old one; no separate letter needed (sentence 4).'),
    tx(lang, 'Erhöhung: Erklärung bis zum Ende des Monats, ab dem der höhere Satz gilt, auch während der Bindung (Satz 6). Bis zum Wechsel gilt der höhere Satz.', 'Increase: declare by the end of the month the higher rate takes effect, even during the lock-in (sentence 6). The higher rate applies until you leave.'),
  ];
  const text = () => tx(lang, `Kassenwechsel: neue Kasse ab ${eins(r.beginn)}.`, `Switching fund: new fund from ${eins(r.beginn)}.`);
  return (
    <div className={rahmen}>
      <div className={raster}>
        <form className="grid content-start gap-x-4 gap-y-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <SelectField id="wx" label={tx(lang, 'Ich wähle die neue Kasse im', 'I join the new fund in')} value={erkl} onChange={setErkl} options={monatsListe.map((m) => ({ value: key(m), label: name(m) }))} />
          <SelectField id="ws" label={tx(lang, 'Mitglied der jetzigen Kasse seit', 'Member of current fund since')} value={seit} onChange={setSeit} options={seitListe.map((m) => ({ value: key(m), label: name(m) }))} />
          <Toggle id="wh" label={tx(lang, 'Erhöht die Kasse ihren Satz?', 'Is your fund raising its rate?')} value={erh} onChange={setErh} options={janeinOpt(lang)} />
          {erh === '1' && <SelectField id="wha" label={tx(lang, 'Höherer Satz gilt ab', 'Higher rate applies from')} value={erhAb} onChange={setErhAb} options={monatsListe.map((m) => ({ value: key(m), label: name(m) }))} />}
          {erh === '1' && <NumberField id="wd" lang={lang} label={tx(lang, 'Erhöhung', 'Increase')} value={diffPunkte} onChange={setDiffPunkte} unit={tx(lang, 'Punkte', 'points')} decimals={2} max={5} />}
          {erh === '1' && <NumberField id="wb" lang={lang} label={tx(lang, 'Bruttolohn im Monat', 'Gross pay a month')} value={brutto} onChange={setBrutto} unit="€" max={1_000_000} />}
          <Toggle id="wr" label={tx(lang, 'Rente beziehen?', 'Drawing a pension?')} value={rente} onChange={setRente} options={janeinOpt(lang)} />
        </form>
        <div className={kasten} data-resultat aria-live="polite">
          <Kopf label={tx(lang, 'Ihre neue Kasse gilt ab', 'Your new fund starts on')} wert={eins(r.beginn)} unter={grund} />
          <Zeilen rows={rows} />
          <Aktionen lang={lang} text={text} />
          <Rechenweg lang={lang} steps={steps} />
          <p className="mt-3 text-xs text-navy-600">{tx(lang, 'Fristen nach § 175 Abs. 4 SGB V. Ihre neue Kasse bestätigt den Termin schriftlich. ', 'Deadlines under section 175(4) SGB V. Your new fund confirms the date in writing. ')}{methodHref && <a className="underline" href={methodHref}>{tx(lang, 'So rechnen wir', 'How we calculate')}</a>}</p>
        </div>
      </div>
    </div>
  );
}
