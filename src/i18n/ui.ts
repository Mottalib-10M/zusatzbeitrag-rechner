import type { Locale } from './routes';
const de = {
  updatedOn: 'Aktualisiert am', editorialPolicy: 'Redaktionsgrundsätze', contactLabel: 'Kontakt', reviewedBy: 'Geprüft von',
  skipToContent: 'Zum Inhalt', mainNav: 'Hauptnavigation', breadcrumbLabel: 'Brotkrümelnavigation', breadcrumbHome: 'Start', menuOpen: 'Menü öffnen',
  faqTitle: 'Was Versicherte fragen', relatedCalculators: 'Weiter mit', sourcesTitle: 'Gesetze und amtliche Daten', writtenBy: 'Verfasst von',
  asOf: 'Rechtsstand', lastUpdated: 'nachgelesen am', footerValidated: 'Kassenliste täglich mit dem GKV-Spitzenverband abgeglichen, Rechenregeln im Test nachgerechnet', footerBrowser: 'Gerechnet wird in Ihrem Browser · nichts wird gespeichert oder gesendet · kostenlos, ohne Anmeldung',
  footerDisclaimer: 'Zusatzbeitragrechner ist ein unabhängiges Angebot von Radif Partners. Wir gehören zu keiner Krankenkasse und keinem Vergleichsportal, vermitteln keine Mitgliedschaft und erhalten keine Provision. Ergebnisse sind Schätzungen nach SGB V und SGB XI; verbindlich ist die Beitragsberechnung Ihrer Krankenkasse oder Ihres Arbeitgebers.', footerPopular: '', notFound: 'Unter dieser Adresse gibt es keine Seite.',
  readMore: 'Weiterlesen',
};
const en: typeof de = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'What members ask', relatedCalculators: 'Continue with', sourcesTitle: 'Laws and official data', writtenBy: 'Written by',
  asOf: 'Legal position', lastUpdated: 'read on', footerValidated: 'Fund list checked daily against the GKV-Spitzenverband, calculation rules recomputed in tests', footerBrowser: 'Calculated in your browser · nothing is stored or sent · free, no sign-up',
  footerDisclaimer: 'Zusatzbeitragrechner is an independent service by Radif Partners. We belong to no health fund and no comparison portal, sign no one up and take no commission. Results are estimates only, under Books V and XI of the German Social Code; this site does not replace the calculation of your fund or employer, which alone is binding.', footerPopular: '', notFound: 'There is no page at this address.',
  readMore: 'Read more',
};
export function t(lang: Locale) { return lang === 'en' ? en : de; }
