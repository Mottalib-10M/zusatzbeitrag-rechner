/** Register der Seiten: jede Datei aus `src/content/<gruppe>/` wird hier geladen. */
import type { PageDef, Group } from './guide-types';

const mods = import.meta.glob<{ default: PageDef }>(['../content/rechner/*.ts', '../content/wissen/*.ts', '../content/kassen/*.ts'], { eager: true });

export const PAGES: PageDef[] = Object.entries(mods)
  .map(([file, m]) => {
    const g = m.default;
    const base = file.split('/').pop()!.replace(/\.ts$/, '');
    if (g.id !== base) throw new Error(`${file}: id „${g.id}“ weicht vom Dateinamen ab`);
    return g;
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

export const GROUPS: Group[] = ['rechner', 'kassen', 'wissen'];
export const pageById = (id: string) => PAGES.find((p) => p.id === id);
/** Seite einer Kasse, falls es eine gibt. Die Länder stehen gesammelt in der Kassenliste (Tabelle nach Bundesland). */
export const kassenSeite = (kasseId: string) => PAGES.find((p) => p.group === 'kassen' && p.kasse === kasseId);
