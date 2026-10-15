/** Fabrique les outils d'écriture (`Helpers`) passés au corps de chaque page. */
import { route, ROUTES, type Locale } from '../i18n/routes';
import { P } from './engine/params';
import type { SourceKey } from './engine/params';
import type { Helpers } from './guide-types';
import { formatMoney, formatNumber, formatDecimal, displayDate } from './format';
import { LANG_TAGS } from '../data/site-config';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');

export function helpers(lang: Locale): Helpers {
  return {
    lang, P,
    a: (id, text) => (ROUTES.some((r) => r.id === id) ? `<a href="${route(id, lang)}">${text}</a>` : text),
    eur: (n, d = 0) => formatMoney(n, d, lang),
    num: (n, d = 0) => formatNumber(n, d, lang),
    pz: (x, d = 2) => `${formatDecimal(x, d, lang)}\u00a0%`,
    pk: (x) => `${formatNumber(x, 2, lang)}\u00a0%`,
    date: (iso) => displayDate(iso, LANG_TAGS[lang]),
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label[lang]}</a>`; },
    table: (headers, rows, caption, align = []) => {
      const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
      return `<div class="not-prose my-6 overflow-x-auto"><table class="w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="border-b border-navy-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatDecimal(c, 2, lang)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    },
  };
}
