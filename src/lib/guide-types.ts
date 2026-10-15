/**
 * Eine Seite = EINE Datei in `src/content/<gruppe>/`. Die Datei trägt beide Sprachen, Text, FAQ, Quellen,
 * Mini-Rechner und Verlinkung. Der Kern (Routen, Menüs, Fußzeile, Sitemap, hreflang, Schemas) liest sie selbst.
 * Gruppen: `rechner` (Rechnerseiten), `wissen` (Ratgeber), `kassen` (eine große Kasse), `laender` (ein Bundesland).
 */
import type { SourceKey, Params } from './engine/params';
import type { Land } from './engine/kassen';

export type Lang = 'de' | 'en';
export type Group = 'rechner' | 'wissen' | 'kassen' | 'laender';
export interface FAQ { q: string; a: string }

export interface Helpers {
  lang: Lang;
  /** Interner Link per Seiten-ID. */
  a: (id: string, text: string) => string;
  /** Eurobetrag im Format der Sprache (ganze Euro, wenn nicht anders verlangt). */
  eur: (n: number, decimals?: number) => string;
  num: (n: number, decimals?: number) => string;
  /** Prozentsatz aus einem Wert in Prozent (2,69 → „2,69 %“). */
  pz: (x: number, decimals?: number) => string;
  /** Kassensatz mit zwei festen Stellen wie in der amtlichen Liste (2,50 %). */
  pk: (x: number) => string;
  /** ISO-Datum ausgeschrieben. */
  date: (iso: string) => string;
  /** Tabelle im Zeitungsstil. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link auf eine amtliche Quelle aus params-2026.json. */
  src: (key: SourceKey, text?: string) => string;
  /** Rechtswerte: jede Zahl kommt von hier oder aus dem Motor, nie fest im Text. */
  P: Params;
}

export interface PageText {
  /** URL-Segment ohne Schrägstrich, ohne Jahreszahl. */
  slug: string;
  nav: string;
  card: string;
  /** 50 bis 60 Zeichen, Suchbegriff zuerst, mit Jahr (RECETTE §11). */
  title: string;
  /** 150 bis 160 Zeichen, mit Jahr. */
  description: string;
  h1: string;
  /** Ein Satz unter dem H1, mit dem Kernwert. */
  intro: string;
  /** Zitierbarer Absatz, mindestens 120 Wörter, mit den Zahlen (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  /** HTML-Körper. `<!--mini:kind-->` setzt einen weiteren Mini-Rechner ein. */
  body: (h: Helpers) => string;
}

/** `beitrag`: Hauptrechner (Status, Land, Kasse vorbelegt); `liste`: alle Kassen; `wechsel`: Fristen; `familie`: Familienversicherung. */
export type Tool = 'beitrag' | 'liste' | 'wechsel' | 'familie';

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  /** Mini-Rechner nach dem Einleitungssatz (Datei `src/lib/minis/<kind>.ts`). Entfällt bei `tool`. */
  mini?: string;
  miniDefaults?: Record<string, number>;
  /** Ziel des Mini-Rechner-Buttons (Standard: Startseite). */
  miniHref?: string;
  /** Voller Rechner der Seite (Rechner-, Kassen- und Länderseiten). */
  tool?: Tool;
  /** Vorbelegung des Rechners: status, land, kasse, jahr, einkommen. */
  toolPreset?: Record<string, number | string | boolean>;
  /** Kassenseite: Kennung der Kasse in kassen.json. */
  kasse?: string;
  /** Länderseite: Kürzel des Landes. */
  land?: Land;
  related: string[];
  sources: SourceKey[];
  de: PageText;
  en: PageText;
}

export const defineGuide = (g: PageDef): PageDef => g;
