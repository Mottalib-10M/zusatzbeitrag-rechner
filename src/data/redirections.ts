/**
 * Adressen, die es nicht mehr gibt (Regel der 100 Seiten, RECETTE §3, 2026-10-16), und ihr Ersatz.
 * Die 16 Länderseiten sind in der Kassenliste aufgegangen (die HEK-Seite ist seit 2026-10-17 zurück): Tabelle nach
 * Bundesland, Filter „Bundesland“ (Parameter l) und alle Kassen mit Satz. GitHub Pages kennt keine 301;
 * eine Seite pro alter Adresse zählte selbst als Seite, deshalb leitet die 404 diese Adressen weiter.
 */
import type { Land } from '../lib/engine/kassen';

const LAENDER_ALT: Array<[Land, string, string]> = [
  ['BW', 'baden-wuerttemberg', 'baden-wuerttemberg'], ['BY', 'bayern', 'bavaria'], ['BE', 'berlin', 'berlin'],
  ['BB', 'brandenburg', 'brandenburg'], ['HB', 'bremen', 'bremen'], ['HH', 'hamburg', 'hamburg'], ['HE', 'hessen', 'hesse'],
  ['MV', 'mecklenburg-vorpommern', 'mecklenburg-western-pomerania'], ['NI', 'niedersachsen', 'lower-saxony'],
  ['NW', 'nordrhein-westfalen', 'north-rhine-westphalia'], ['RP', 'rheinland-pfalz', 'rhineland-palatinate'],
  ['SL', 'saarland', 'saarland'], ['SN', 'sachsen', 'saxony'], ['ST', 'sachsen-anhalt', 'saxony-anhalt'],
  ['SH', 'schleswig-holstein', 'schleswig-holstein'], ['TH', 'thueringen', 'thuringia'],
];
const LISTE = { de: '/de/zusatzbeitrag-krankenkassen-liste/', en: '/en/additional-contribution-list/' };

/** Alte Adresse → neue Adresse (mit vorgewähltem Land). */
export const REDIRECTIONS: Record<string, string> = Object.fromEntries([
  ...LAENDER_ALT.flatMap(([l, de, en]) => [
    [`/de/guenstigste-krankenkasse-${de}/`, `${LISTE.de}?l=${l}`],
    [`/en/cheapest-health-insurance-${en}/`, `${LISTE.en}?l=${l}`],
  ]),
]);
