/**
 * Cas de référence recalculés à la main (sources : §§ 223, 226, 236, 240, 241, 243, 245, 247, 249, 249a SGB V ;
 * §§ 55, 58, 59 SGB XI ; § 20 Abs. 2a SGB IV ; § 175 Abs. 4 SGB V). Chaque montant attendu est écrit
 * avec son calcul en commentaire, à partir des taux de params-2026.json.
 */
import { describe, expect, it } from 'vitest';
import { J } from '../src/lib/engine/params';
import { angestellt, rentner, selbststaendig, student, familienversicherung, ersparnisJahr, pvZuAb } from '../src/lib/engine/beitrag';
import { wechsel, renteAb } from '../src/lib/engine/wechsel';
import { KASSEN, rangliste, waehlbar, offen, statistik, kasse, rangIn } from '../src/lib/engine/kassen';

const near = (a: number, b: number) => expect(Math.abs(a - b), `${a} ≠ ${b}`).toBeLessThanOrEqual(0.011);

describe('Rechengrößen', () => {
  it('2026 : BBG 5.812,50 €, Familiengrenze 565 €, Mindestbemessung 1.318,33 €, Freibetrag 197,75 €', () => {
    const w = J(2026);
    near(w.bbgKv, 5812.5); near(w.bbgPv, 5812.5); near(w.famGrenze, 565); near(w.mindestFreiwillig, 1318.33); near(w.vbFrei, 197.75); near(w.kvStudent, 10.22);
    expect(w.vorlaeufig).toBe(false);
  });
  it('2027 : BBG KV 6.375 €, PV nach § 55 Abs. 2 SGB XI 6.075 €, 590 €, 1.376,67 €, 206,50 €', () => {
    const w = J(2027);
    near(w.bbgKv, 6375); near(w.bbgPv, 6075); near(w.famGrenze, 590); near(w.mindestFreiwillig, 1376.67); near(w.vbFrei, 206.5);
    expect(w.vorlaeufig).toBe(true);
  });
  it('Faktor F 2026 = 28 / (18,6 + 3,6 + 2,6 + 14,6 + 2,9) auf vier Stellen', () => {
    const w = J(2026); near(w.faktor_f, Math.round((28 / (w.rv_satz + w.pv_satz + w.av_satz + w.kv_allgemein + w.zb_durchschnitt)) * 10000) / 10000);
  });
});

describe('Beschäftigte', () => {
  it('4.000 € brutto, Zusatzbeitrag 2,69 %, ein Kind : KV 4.000 × 8,645 % = 345,80 €, PV 4.000 × 1,8 % = 72 €', () => {
    const r = angestellt({ brutto: 4000, zb: 2.69, jahr: 2026, eltern: 'k1' });
    near(r.kv.mitglied, 345.8); near(r.kv.andere, 345.8); near(r.pv.mitglied, 72); near(r.pv.andere, 72); near(r.selbst, 417.8);
    near(r.zbSelbst, 53.8); // 4.000 × 1,345 %
  });
  it('kinderlos ab 23 : PV-Anteil 4.000 × (1,8 + 0,6) % = 96 €, Arbeitgeber unverändert 72 €', () => {
    const r = angestellt({ brutto: 4000, zb: 2.69, jahr: 2026, eltern: 'kinderlos' });
    near(r.pv.mitglied, 96); near(r.pv.andere, 72);
  });
  it('drei Kinder unter 25 : Abschlag 2 × 0,25 Punkte, PV 4.000 × 1,3 % = 52 €', () => {
    near(pvZuAb('k3', J(2026)), -0.5);
    near(angestellt({ brutto: 4000, zb: 2.69, jahr: 2026, eltern: 'k3' }).pv.mitglied, 52);
    near(pvZuAb('k5', J(2026)), -1); near(pvZuAb('unter23', J(2026)), 0);
  });
  it('Sachsen : Beschäftigte tragen 2,3 %, Arbeitgeber 1,3 % (§ 58 Abs. 3 SGB XI)', () => {
    const r = angestellt({ brutto: 4000, zb: 2.69, jahr: 2026, sachsen: true, eltern: 'k1' });
    near(r.pv.mitglied, 92); near(r.pv.andere, 52); expect(r.hinweise).toContain('sachsen');
  });
  it('über der BBG 2026 : 7.000 € zählen mit 5.812,50 €, KV 502,49 €', () => {
    const r = angestellt({ brutto: 7000, zb: 2.69, jahr: 2026, eltern: 'k1' });
    near(r.basisKv, 5812.5); near(r.kv.mitglied, 502.49); expect(r.hinweise).toContain('ueberBbgKv');
  });
  it('2027 : KV bis 6.375 € (551,12 €), PV nur bis 6.075 € (109,35 €)', () => {
    const r = angestellt({ brutto: 7000, zb: 2.69, jahr: 2027, eltern: 'k1' });
    near(r.kv.mitglied, 551.12); near(r.pv.mitglied, 109.35); expect(r.hinweise).toContain('pvBbg2027'); expect(r.hinweise).toContain('vorlaeufig');
  });
  it('Übergangsbereich 2026, 1.200 € : BE 1.083,25 € gesamt, 854,69 € für den Arbeitnehmeranteil', () => {
    const r = angestellt({ brutto: 1200, zb: 2.9, jahr: 2026, eltern: 'k1' });
    near(r.weg.beGes, 1083.25); near(r.weg.beAn, 854.69);
    near(r.kv.gesamt, 189.57); near(r.kv.mitglied, 74.79); near(r.kv.andere, 114.78);
    near(r.pv.gesamt, 39); near(r.pv.mitglied, 15.38);
  });
  it('Übergangsbereich 2026, 1.000 €, 3,0 % : 854,06 / 568,36 €, KV 150,32 € davon 50,02 € Arbeitnehmer, PV 30,74 € davon 10,23 € (Beispiel lohn-info.de, nachgerechnet)', () => {
    const r = angestellt({ brutto: 1000, zb: 3.0, jahr: 2026, eltern: 'k1' });
    near(r.weg.beGes, 854.06); near(r.weg.beAn, 568.36); near(r.kv.gesamt, 150.32); near(r.kv.mitglied, 50.02); near(r.kv.andere, 100.3);
    near(r.pv.gesamt, 30.74); near(r.pv.mitglied, 10.23); near(r.pv.andere, 20.51);
  });
  it('Übergangsbereich, obere Grenze 2.000 € : keine Ermäßigung mehr, halber Satz auf 2.000 €', () => {
    const r = angestellt({ brutto: 2000, zb: 2.9, jahr: 2026, eltern: 'k1' });
    near(r.kv.mitglied, 175); near(r.kv.andere, 175);
  });
  it('Minijob 603 € : kein Beitrag des Beschäftigten, Pauschale 13 % 2026 und 17,5 % 2027', () => {
    const a = angestellt({ brutto: 603, zb: 2.9, jahr: 2026, eltern: 'k1' });
    near(a.selbst, 0); near(a.kv.andere, 78.39); expect(a.hinweise).toContain('minijob');
    near(angestellt({ brutto: 600, zb: 2.9, jahr: 2027, eltern: 'k1' }).kv.andere, 105);
  });
  it('über der Versicherungspflichtgrenze 2026 (77.400 €/Jahr) : Hinweis, gleicher Beitrag', () => {
    expect(angestellt({ brutto: 6500, zb: 2.9, jahr: 2026, eltern: 'k1' }).hinweise).toContain('ueberJaeg');
    expect(angestellt({ brutto: 6400, zb: 2.9, jahr: 2026, eltern: 'k1' }).hinweise).not.toContain('ueberJaeg');
  });
});

describe('Rentner, Selbstständige, Studierende', () => {
  it('Rente 1.500 €, 2,69 %, kinderlos : KV 1.500 × 8,645 % = 129,68 €, PV 1.500 × 4,2 % = 63 €', () => {
    const r = rentner({ rente: 1500, zb: 2.69, jahr: 2026, eltern: 'kinderlos' });
    near(r.kv.mitglied, 129.68); near(r.kv.andere, 129.68); near(r.pv.mitglied, 63); expect(r.pv.andere).toBe(0);
  });
  it('Betriebsrente 400 € : KV auf 400 − 197,75 = 202,25 € mit 17,29 % = 34,97 €, PV auf volle 400 € = 16,80 €', () => {
    const r = rentner({ rente: 1500, betriebsrente: 400, zb: 2.69, jahr: 2026, eltern: 'kinderlos' });
    near(r.kv.mitglied, 129.68 + 34.97); near(r.pv.mitglied, 63 + 16.8);
  });
  it('Betriebsrente 190 € unter der Freigrenze : beitragsfrei', () => {
    const r = rentner({ rente: 1500, betriebsrente: 190, zb: 2.69, jahr: 2026, eltern: 'k1' });
    near(r.kv.mitglied, 129.68); near(r.pv.mitglied, 54); expect(r.hinweise).toContain('vbFrei'); // Rentner tragen die Pflege allein : 1.500 × 3,6 %
  });
  it('Selbstständig 3.000 € Gewinn, 2,9 %, ohne Krankengeld : KV 3.000 × 16,9 % = 507 €, PV 108 €', () => {
    const r = selbststaendig({ einkommen: 3000, zb: 2.9, jahr: 2026, krankengeld: false, eltern: 'k1' });
    near(r.kv.mitglied, 507); near(r.pv.mitglied, 108);
  });
  it('Selbstständig mit Krankengeld : 3.000 × 17,5 % = 525 €', () => {
    near(selbststaendig({ einkommen: 3000, zb: 2.9, jahr: 2026, krankengeld: true, eltern: 'k1' }).kv.mitglied, 525);
  });
  it('Selbstständig 800 € : Mindestbemessung 1.318,33 € → KV 222,80 €, PV 47,46 €', () => {
    const r = selbststaendig({ einkommen: 800, zb: 2.9, jahr: 2026, krankengeld: false, eltern: 'k1' });
    near(r.basisKv, 1318.33); near(r.kv.mitglied, 222.8); near(r.pv.mitglied, 47.46); expect(r.hinweise).toContain('mindest');
  });
  it('Student, 2,69 % : 855 × 12,91 % = 110,38 €, PV 855 × 3,6 % = 30,78 € (unter 23)', () => {
    const r = student({ zb: 2.69, jahr: 2026, eltern: 'unter23' });
    near(r.kv.mitglied, 110.38); near(r.pv.mitglied, 30.78);
    near(student({ zb: 2.69, jahr: 2026, eltern: 'kinderlos' }).pv.mitglied, 35.91);
  });
});

describe('Ersparnis und Familienversicherung', () => {
  it('Wechsel von 3,29 % zu 2,69 % bei 4.000 € : 4.000 × 0,3 % × 12 = 144 € im Jahr', () => {
    near(ersparnisJahr({ status: 'angestellt', einkommen: 4000, eltern: 'k1', jahr: 2026 }, 3.29, 2.69), 144);
  });
  it('Selbstständige sparen den vollen Unterschied : 3.000 × 0,6 % × 12 = 216 €', () => {
    near(ersparnisJahr({ status: 'selbststaendig', einkommen: 3000, eltern: 'k1', jahr: 2026 }, 3.29, 2.69), 216);
  });
  it('Familienversicherung 2026 : 560 € ja, 570 € nein, Minijob 600 € ja', () => {
    expect(familienversicherung({ einkommen: 560, minijob: false, jahr: 2026 }).moeglich).toBe(true);
    expect(familienversicherung({ einkommen: 570, minijob: false, jahr: 2026 }).moeglich).toBe(false);
    expect(familienversicherung({ einkommen: 600, minijob: true, jahr: 2026 }).moeglich).toBe(true);
  });
});

describe('Fristen § 175 Abs. 4 SGB V', () => {
  it('Erklärung im November, lange Mitglied : letzter Monat Januar, neue Kasse ab Februar', () => {
    const w = wechsel({ y: 2026, m: 11 }, { y: 2020, m: 1 }, null);
    expect(w.moeglich).toBe(true); expect(w.letzterMonat).toEqual({ y: 2027, m: 1 }); expect(w.beginn).toEqual({ y: 2027, m: 2 });
  });
  it('Sonderkündigung : seit Juni 2026 Mitglied, Erhöhung Januar 2027, Erklärung im Januar → neue Kasse ab April, drei Monate erhöht', () => {
    const w = wechsel({ y: 2027, m: 1 }, { y: 2026, m: 6 }, { y: 2027, m: 1 });
    expect(w.grund).toBe('sonder'); expect(w.beginn).toEqual({ y: 2027, m: 4 }); expect(w.monateErhoeht).toBe(3);
  });
  it('Erklärung schon im Dezember : neue Kasse ab März, zwei Monate erhöht', () => {
    const w = wechsel({ y: 2026, m: 12 }, { y: 2026, m: 6 }, { y: 2027, m: 1 });
    expect(w.beginn).toEqual({ y: 2027, m: 3 }); expect(w.monateErhoeht).toBe(2);
  });
  it('Bindung nicht erfüllt, keine Erhöhung : frühestens März 2027 erklären, Ende Mai 2027', () => {
    const w = wechsel({ y: 2026, m: 11 }, { y: 2026, m: 6 }, null);
    expect(w.moeglich).toBe(false); expect(w.fruehestens).toEqual({ y: 2027, m: 3 }); expect(w.letzterMonat).toEqual({ y: 2027, m: 5 });
  });
  it('Rente : Erhöhung zum Januar gilt ab März (§ 247 Satz 3)', () => { expect(renteAb({ y: 2027, m: 1 })).toEqual({ y: 2027, m: 3 }); });
});

describe('Kassenliste', () => {
  it('liest alle Kassen der Liste, Länder gültig, Sätze plausibel', () => {
    expect(KASSEN.length).toBeGreaterThanOrEqual(80);
    for (const k of KASSEN) if (k.zb !== null) { expect(k.zb).toBeGreaterThan(0); expect(k.zb).toBeLessThan(8); }
    expect(kasse('techniker-krankenkasse').art).toBe('bundesweit');
  });
  it('Bayern : AOK Bayern wählbar, AOK Hessen nicht, Betriebskassen nie', () => {
    const ids = waehlbar('BY').map((k) => k.id);
    expect(ids).toContain('aok-bayern-die-gesundheitskasse'); expect(ids).not.toContain('aok-die-gesundheitskasse-in-hessen');
    expect(waehlbar('BY').every((k) => k.art !== 'betrieblich')).toBe(true);
  });
  it('Rangliste aufsteigend, Rang 1 = günstigster Satz', () => {
    for (const l of ['BY', 'SN', 'HB'] as const) { const r = rangliste(l); for (let i = 1; i < r.length; i++) expect(r[i].zb!).toBeGreaterThanOrEqual(r[i - 1].zb!); expect(rangIn(r[0].id, l)).toBe(1); }
    const s = statistik(offen()); expect(s.min).toBeLessThanOrEqual(s.median); expect(s.median).toBeLessThanOrEqual(s.max);
  });
});
