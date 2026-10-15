/** Die Krankenkassen mit ihrem tagesaktuellen Zusatzbeitrag (Liste des GKV-Spitzenverbands, scripts/fetch-kassen.py). */
import data from '../../data/kassen.json';
import abruf from '../../data/kassen-abruf.json';
import historie from '../../data/kassen-historie.json';

export const LAENDER = ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'] as const;
export type Land = (typeof LAENDER)[number];
export const LAND_NAME: Record<Land, { de: string; en: string }> = {
  BW: { de: 'Baden-Württemberg', en: 'Baden-Württemberg' }, BY: { de: 'Bayern', en: 'Bavaria' }, BE: { de: 'Berlin', en: 'Berlin' },
  BB: { de: 'Brandenburg', en: 'Brandenburg' }, HB: { de: 'Bremen', en: 'Bremen' }, HH: { de: 'Hamburg', en: 'Hamburg' },
  HE: { de: 'Hessen', en: 'Hesse' }, MV: { de: 'Mecklenburg-Vorpommern', en: 'Mecklenburg-Western Pomerania' },
  NI: { de: 'Niedersachsen', en: 'Lower Saxony' }, NW: { de: 'Nordrhein-Westfalen', en: 'North Rhine-Westphalia' },
  RP: { de: 'Rheinland-Pfalz', en: 'Rhineland-Palatinate' }, SL: { de: 'Saarland', en: 'Saarland' }, SN: { de: 'Sachsen', en: 'Saxony' },
  ST: { de: 'Sachsen-Anhalt', en: 'Saxony-Anhalt' }, SH: { de: 'Schleswig-Holstein', en: 'Schleswig-Holstein' }, TH: { de: 'Thüringen', en: 'Thuringia' },
};

export type Kassenart = 'AOK' | 'BKK' | 'IKK' | 'EK' | 'KBS' | 'LKK';
export interface Kasse {
  id: string; name: string; kurz: string; zb: number | null; zb_text: string;
  art: 'bundesweit' | 'regional' | 'betrieblich' | 'branche'; laender: Land[]; kassenart: Kassenart;
}

/** Kurznamen für Tabellen. Der amtliche Name bleibt in `name`. */
const KURZ: Record<string, string> = {
  'aok-die-gesundheitskasse-fur-niedersachsen': 'AOK Niedersachsen', 'aok-die-gesundheitskasse-in-hessen': 'AOK Hessen',
  'aok-bayern-die-gesundheitskasse': 'AOK Bayern', 'aok-bremen-bremerhaven': 'AOK Bremen/Bremerhaven', 'aok-nordost-die-gesundheitskasse': 'AOK Nordost',
  'aok-nordwest-die-gesundheitskasse': 'AOK NordWest', 'aok-plus-die-gesundheitskasse-fur-sachsen-und-thuringen': 'AOK PLUS',
  'aok-rheinland-hamburg-die-gesundheitskasse': 'AOK Rheinland/Hamburg', 'aok-rheinland-pfalz-saarland-die-gesundheitskasse': 'AOK Rheinland-Pfalz/Saarland',
  'aok-sachsen-anhalt-die-gesundheitskasse': 'AOK Sachsen-Anhalt', 'techniker-krankenkasse': 'Techniker Krankenkasse (TK)', 'barmer': 'BARMER',
  'handelskrankenkasse-hkk': 'hkk', 'hek-hanseatische-krankenkasse': 'HEK', 'kaufmannische-krankenkasse-kkh': 'KKH', 'knappschaft': 'KNAPPSCHAFT',
  'siemens-betriebskrankenkasse-sbk': 'SBK', 'betriebskrankenkasse-mobil': 'BKK Mobil (Mobil Krankenkasse)', 'bergische-krankenkasse': 'Bergische Krankenkasse',
  'bkk-mkk-meine-krankenkasse': 'BKK mkk', 'bkk-durkoppadler': 'BKK DürkoppAdler', 'bkk-gildemeister-seidensticker': 'BKK Gildemeister Seidensticker',
  'bkk-wirtschaft-und-finanzen': 'BKK Wirtschaft & Finanzen', 'bkk-werra-meissner': 'BKK Werra-Meissner', 'betriebskrankenkasse-der-g-m-pfaff-ag': 'BKK Pfaff',
  'mhplus-betriebskrankenkasse': 'mhplus BKK', 'continentale-betriebskrankenkasse': 'Continentale BKK', 'energie-betriebskrankenkasse': 'energie-BKK',
  'r-und-v-betriebskrankenkasse': 'R+V BKK', 'ikk-die-innovationskasse': 'IKK - Die Innovationskasse', 'viactiv-krankenkasse': 'VIACTIV',
  'sozialversicherung-fur-landwirtschaft-forsten-und-gartenbau-svlfg': 'SVLFG (landwirtschaftliche Krankenkasse)',
  'betriebskrankenkasse-technoform': 'BKK Technoform', 'betriebskrankenkasse-ewe': 'BKK EWE', 'betriebskrankenkasse-miele': 'BKK Miele',
  'betriebskrankenkasse-pricewaterhousecoopers': 'BKK PwC', 'ey-betriebskrankenkasse': 'EY BKK', 'krones-betriebskrankenkasse': 'Krones BKK',
  'bkk-faber-castell-und-partner': 'BKK Faber-Castell & Partner', 'bkk-schwarzwald-baar-heuberg': 'BKK Schwarzwald-Baar-Heuberg',
};
const EK = new Set(['techniker-krankenkasse', 'barmer', 'dak-gesundheit', 'kaufmannische-krankenkasse-kkh', 'handelskrankenkasse-hkk', 'hek-hanseatische-krankenkasse']);
function kassenart(id: string, name: string): Kassenart {
  if (EK.has(id)) return 'EK';
  if (id === 'knappschaft') return 'KBS';
  if (id.startsWith('sozialversicherung-fur-landwirtschaft')) return 'LKK';
  if (/^AOK/.test(name)) return 'AOK';
  if (/IKK/.test(name)) return 'IKK';
  return 'BKK';
}

export const KASSEN: Kasse[] = (data.kassen as Array<Omit<Kasse, 'kurz' | 'kassenart'>>).map((k) => ({
  ...k, laender: k.laender as Land[], kurz: KURZ[k.id] ?? k.name, kassenart: kassenart(k.id, k.name),
}));
export const STAND = data.stand as string;
export const ABRUF = abruf as { abgerufen_am: string; stand_gkv: string; anzahl: number };
export const HISTORIE = historie as { ereignisse: Array<Record<string, unknown>> };

export const kasse = (id: string): Kasse => {
  const k = KASSEN.find((x) => x.id === id);
  if (!k) throw new Error(`Unbekannte Kasse: ${id}`);
  return k;
};
/** Kassen, die jeder in diesem Land wählen kann (Wohn- oder Arbeitsort): bundesweit oder für das Land geöffnet, mit Zusatzbeitrag. */
export const waehlbar = (land: Land): Kasse[] => KASSEN.filter((k) => k.zb !== null && (k.art === 'bundesweit' || k.art === 'regional') && k.laender.includes(land));
/** Aufsteigend nach Zusatzbeitrag, bei Gleichstand alphabetisch. */
export const sortiert = (ks: Kasse[]): Kasse[] => [...ks].sort((a, b) => (a.zb! - b.zb!) || a.kurz.localeCompare(b.kurz, 'de'));
export const rangliste = (land: Land): Kasse[] => sortiert(waehlbar(land));
/** Alle Kassen mit Satz, die mindestens in einem Land frei wählbar sind. */
export const offen = (): Kasse[] => sortiert(KASSEN.filter((k) => k.zb !== null && k.art !== 'betrieblich' && k.art !== 'branche'));
/** Rang (1 = günstigste) einer Kasse unter den in einem Land wählbaren Kassen; Gleichstand teilt sich den Rang. */
export const rangIn = (id: string, land: Land): number => { const r = rangliste(land); const z = kasse(id).zb!; return r.filter((k) => k.zb! < z).length + 1; };

export function statistik(ks: Kasse[]) {
  const z = ks.map((k) => k.zb!).sort((a, b) => a - b);
  const n = z.length; const sum = z.reduce((s, x) => s + x, 0);
  return { n, min: z[0], max: z[n - 1], mittel: Math.round((sum / n) * 100) / 100, median: n % 2 ? z[(n - 1) / 2] : Math.round(((z[n / 2 - 1] + z[n / 2]) / 2) * 1000) / 1000 };
}
