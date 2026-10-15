/** Die ganze Liste des GKV-Spitzenverbands: filtern nach Land und Kassenart, sortieren, Beitrag in Euro für Ihr Brutto. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { tx, fm, rahmen, type L } from './kit';
import { KASSEN, LAND_NAME, LAENDER, sortiert, type Land, type Kassenart } from '../../lib/engine/kassen';
import { angestellt } from '../../lib/engine/beitrag';
import { landOpt } from './opts';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { lang: L; kassenHref?: Record<string, string>; preset?: { land?: Land } }
const ARTEN: Kassenart[] = ['AOK', 'BKK', 'EK', 'IKK', 'KBS'];
const ARTNAME = (l: L): Record<Kassenart, string> => ({ AOK: 'AOK', BKK: tx(l, 'Betriebskrankenkassen', 'company funds (BKK)'), EK: tx(l, 'Ersatzkassen', 'substitute funds'), IKK: tx(l, 'Innungskrankenkassen', 'guild funds (IKK)'), KBS: 'KNAPPSCHAFT', LKK: 'SVLFG' });

export default function ListeRechner({ lang, kassenHref = {}, preset = {} }: Props) {
  const f = fm(lang);
  const [land, setLand] = useState<string>(preset.land ?? 'alle');
  const [art, setArt] = useState('alle');
  const [sort, setSort] = useState('zb');
  const [brutto, setBrutto] = useState(3800);
  const [geschlossen, setGeschlossen] = useState('0');
  useEffect(() => {
    const u = readParams(window.location.search);
    const l = str(u, 'l', preset.land ?? 'alle'); if (l === 'alle' || (LAENDER as readonly string[]).includes(l)) setLand(l);
    setArt(str(u, 'a', 'alle')); setSort(str(u, 's', 'zb')); setBrutto(num(u, 'b', 3800)); setGeschlossen(str(u, 'g', '0'));
  }, []);
  useEffect(() => { updateURL({ l: land, a: art, s: sort, b: brutto, g: geschlossen === '1' ? 1 : undefined }); }, [land, art, sort, brutto, geschlossen]);

  const rows = useMemo(() => {
    let ks = KASSEN.filter((k) => k.zb !== null);
    if (geschlossen !== '1') ks = ks.filter((k) => k.art !== 'betrieblich');
    if (land !== 'alle') ks = ks.filter((k) => k.laender.includes(land as Land) || (geschlossen === '1' && k.art === 'betrieblich'));
    if (art !== 'alle') ks = ks.filter((k) => k.kassenart === art);
    const s = sort === 'name' ? [...ks].sort((a, b) => a.kurz.localeCompare(b.kurz, 'de')) : sortiert(ks);
    return s.map((k) => ({ k, an: angestellt({ brutto, zb: k.zb!, jahr: 2026, eltern: 'k1' }).selbst }));
  }, [land, art, sort, brutto, geschlossen]);
  const n = rows.length;
  const offen = (k: (typeof KASSEN)[number]) => k.art === 'bundesweit' ? tx(lang, 'bundesweit', 'nationwide') : k.art === 'betrieblich' ? tx(lang, 'nur Beschäftigte des Betriebs', 'company staff only') : k.laender.length > 4 ? tx(lang, `${k.laender.length} Länder`, `${k.laender.length} states`) : k.laender.map((x) => LAND_NAME[x][lang]).join(', ');

  return (
    <div className={rahmen}>
      <form className="grid gap-x-4 gap-y-5 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="ll" label={tx(lang, 'Bundesland', 'State')} value={land} onChange={setLand} options={[{ value: 'alle', label: tx(lang, 'alle Länder', 'all states') }, ...landOpt(lang)]} />
        <SelectField id="la" label={tx(lang, 'Kassenart', 'Type of fund')} value={art} onChange={setArt} options={[{ value: 'alle', label: tx(lang, 'alle', 'all') }, ...ARTEN.map((a) => ({ value: a, label: ARTNAME(lang)[a] }))]} />
        <NumberField id="lb" lang={lang} label={tx(lang, 'Bruttolohn im Monat', 'Gross pay a month')} value={brutto} onChange={setBrutto} unit="€" max={1_000_000} />
        <SelectField id="ls" label={tx(lang, 'Sortieren', 'Sort')} value={sort} onChange={setSort} options={[{ value: 'zb', label: tx(lang, 'günstigste zuerst', 'cheapest first') }, { value: 'name', label: tx(lang, 'nach Name', 'by name') }]} />
        <SelectField id="lg" className="sm:col-span-2" label={tx(lang, 'Betriebskrankenkassen nur für Beschäftigte', 'Company-only funds')} value={geschlossen} onChange={setGeschlossen} options={[{ value: '0', label: tx(lang, 'ausblenden', 'hide') }, { value: '1', label: tx(lang, 'zeigen', 'show') }]} />
      </form>
      <div className="border-t border-navy-200 px-4 pb-5 pt-4 sm:px-6" data-resultat aria-live="polite">
        <p className="text-sm text-navy-700">{tx(lang, `${n} Kassen · Ihr Anteil als Beschäftigte(r) mit einem Kind, Kranken- und Pflegeversicherung zusammen`, `${n} funds · your share as an employee with one child, health and care insurance together`)}</p>
        <div className="mt-2 overflow-x-auto">
          <table className="journal w-full min-w-[36rem] text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wide text-navy-700">
              <th scope="col" className="py-2 pr-2">{tx(lang, 'Kasse', 'Fund')}</th><th scope="col" className="py-2 pr-2">{tx(lang, 'geöffnet', 'open in')}</th>
              <th scope="col" className="py-2 pr-2 text-right">{tx(lang, 'Zusatzbeitrag', 'Add. rate')}</th><th scope="col" className="py-2 text-right">{tx(lang, 'Ihr Beitrag/Monat', 'You pay/month')}</th>
            </tr></thead>
            <tbody>{rows.map(({ k, an }) => (
              <tr key={k.id} className="border-t border-navy-100">
                <td className="py-1.5 pr-2 text-navy-900">{kassenHref[k.id] ? <a className="underline" href={kassenHref[k.id]}>{k.kurz}</a> : k.kurz}</td>
                <td className="py-1.5 pr-2 text-navy-700">{offen(k)}</td>
                <td className="py-1.5 pr-2 text-right tabular-nums">{f.pz(k.zb!)}</td>
                <td className="py-1.5 text-right tabular-nums">{f.eur(an)}</td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
