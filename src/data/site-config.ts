/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://zusatzbeitragrechner.de";
export const SITE_NAMES: Record<string, string> = {"de": "Zusatzbeitragrechner", "en": "Zusatzbeitragrechner"};
export const LANG_TAGS: Record<string, string> = {"de": "de-DE", "en": "en-DE"};
export const OG_LOCALES: Record<string, string> = {"de": "de_DE", "en": "en_GB"};
export const LOCALE_TAG = 'de-DE';
/** Une locale par langue (RECETTE §4) : les pages anglaises écrivent « €4,000 », les allemandes « 4.000 € ». */
export const LOCALE_BY_LANG: Record<string, string> = { de: 'de-DE', en: 'en-GB' };
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-15';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"de": "Herausgeber eines Beitragsrechners für die gesetzliche Krankenversicherung · Zusatzbeiträge aller Kassen", "en": "Publisher of a contribution calculator for German statutory health insurance · every fund's Zusatzbeitrag"};
export const AUTHOR_DESC: Record<string, string> = {"de": "Radif Partners liest jeden Tag die Liste der Zusatzbeitragssätze, die der GKV-Spitzenverband nach § 242 Abs. 5 SGB V veröffentlicht, und rechnet daraus für Ihr Einkommen den Monatsbeitrag jeder Krankenkasse aus, die in Ihrem Bundesland geöffnet ist. Beitragssätze, Beitragsbemessungsgrenze und Pflegebeitrag stammen aus dem SGB V, dem SGB XI und der Rechengrößenverordnung des BMAS. Wir vermitteln keine Kasse und erhalten von keiner Kasse Geld.", "en": "Radif Partners reads, every day, the list of additional contribution rates that the GKV-Spitzenverband must publish under Section 242(5) of Book V of the Social Code, and turns it into the monthly cost of every health fund open in your state for your income. Rates, the contribution ceiling and long-term care contributions come from Books V and XI of the Social Code and the Labour Ministry's annual ordinance. We place no one with any fund and take no money from any fund."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"de": ["Zusatzbeitrag der gesetzlichen Krankenkassen", "Beitragsbemessungsgrenze und Versicherungspflichtgrenze", "Krankenkassenwechsel und Sonderkündigungsrecht", "Beiträge von Rentnern, Selbstständigen und Studierenden", "Beitrag zur sozialen Pflegeversicherung", "Familienversicherung"], "en": ["Additional contribution rates of German statutory health funds", "Contribution ceiling and compulsory insurance threshold", "Switching health fund and the special termination right", "Contributions of pensioners, the self-employed and students", "Long-term care insurance contributions", "Free family insurance"]};
export const CONTACT_EMAIL = "contact@zusatzbeitragrechner.de";
export const THEME_COLOR = '#C20E0E';
export const LOGO_SYMBOL = '+%';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau, aucun cookie, Clarity chargé en mode sans cookie (consentv2 denied).
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
export const GA4_ID = 'G-S90YCM67K5';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'yz4butbjsp';
export const INDEXNOW_KEY = 'f20dab53194fe5404096a1727ba38eb1';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : publication à titre personnel, pas de société (comme les autres sites du portefeuille)
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Frankreich / France",
  phone: '',
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "USt-IdNr.",
  vatNumber: '',
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
