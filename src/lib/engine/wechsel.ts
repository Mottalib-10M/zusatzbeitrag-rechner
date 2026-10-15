/**
 * Fristen beim Kassenwechsel, § 175 Abs. 4 SGB V. Monate werden als { y, m } (m = 1..12) gezählt, nie als Datum
 * des Tages: die Frist hängt nur vom Monat der Erklärung ab. Rentner: § 247 Satz 3 SGB V.
 */
export interface Monat { y: number; m: number }
export const plus = (a: Monat, n: number): Monat => { const i = a.y * 12 + (a.m - 1) + n; return { y: Math.floor(i / 12), m: (i % 12) + 1 }; };
export const diff = (a: Monat, b: Monat) => (b.y * 12 + b.m) - (a.y * 12 + a.m);
export const iso = (a: Monat) => `${a.y}-${String(a.m).padStart(2, '0')}-01`;
/** Letzter Tag eines Monats als ISO-Datum. */
export const ende = (a: Monat) => { const n = plus(a, 1); const d = new Date(Date.UTC(n.y, n.m - 1, 0)); return d.toISOString().slice(0, 10); };

export interface Wechsel {
  /** Ist die Bindung von zwölf Monaten erfüllt oder greift das Sonderkündigungsrecht? */
  moeglich: boolean;
  grund: 'bindung' | 'sonder' | 'gesperrt';
  /** Letzter Monat bei der alten Kasse. */
  letzterMonat: Monat;
  /** Erster Monat bei der neuen Kasse. */
  beginn: Monat;
  /** Frühester Erklärungsmonat, wenn heute noch gesperrt. */
  fruehestens: Monat;
  /** Monate, in denen der erhöhte Satz noch gezahlt wird (Sonderkündigung). */
  monateErhoeht: number;
}

/**
 * @param erklaerung Monat, in dem Sie die neue Kasse wählen (die neue Kasse meldet das der alten).
 * @param mitgliedSeit Erster Monat der Mitgliedschaft bei der jetzigen Kasse.
 * @param erhoehungAb Monat, ab dem die jetzige Kasse ihren Zusatzbeitrag erhöht (oder null).
 */
export function wechsel(erklaerung: Monat, mitgliedSeit: Monat, erhoehungAb: Monat | null): Wechsel {
  // Satz 1: mindestens zwölf Monate gebunden; Satz 3: Kündigung „zum oder nach Ablauf“ dieser zwölf Monate,
  // wirksam zum Ablauf des übernächsten Kalendermonats. Ende der Bindung = Ablauf des 12. Monats.
  const bindungsEnde = plus(mitgliedSeit, 11);
  const sonder = erhoehungAb !== null && diff(erklaerung, erhoehungAb) >= 0; // Erklärung spätestens im Erhöhungsmonat (Satz 6)
  const letzterRegulaer = plus(erklaerung, 2);
  const bindungOk = diff(bindungsEnde, letzterRegulaer) >= 0;
  const moeglich = bindungOk || sonder;
  const letzterMonat = moeglich ? letzterRegulaer : bindungsEnde;
  const fruehestens = moeglich ? erklaerung : plus(bindungsEnde, -2);
  const monateErhoeht = erhoehungAb ? Math.max(0, diff(erhoehungAb, letzterMonat) + 1) : 0;
  return { moeglich, grund: bindungOk ? 'bindung' : sonder ? 'sonder' : 'gesperrt', letzterMonat, beginn: plus(letzterMonat, 1), fruehestens, monateErhoeht };
}

/** § 247 Satz 3 SGB V: Bei der Rente gilt ein neuer Zusatzbeitrag erst ab dem ersten Tag des zweiten Folgemonats. */
export const renteAb = (aenderung: Monat): Monat => plus(aenderung, 2);
