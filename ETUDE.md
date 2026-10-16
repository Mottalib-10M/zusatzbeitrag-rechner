# ETUDE — DE-GKV : Zusatzbeitrag 2027, Krankenkassenbeitrag, changement de caisse

Étude du 2026-10-15 (idée DE-GKV de `reports/etude-niches-2026-10-15-B.md`, brief `reports/BRIEF-10-SITES-2026-10-15.md`).

## Volume (RECETTE §2.0)

Keyword Planner, compte Objet Tech, Allemagne, 2026-10-15 : ≈ 125 000 recherches/mois sur le lot
(`zusatzbeitrag`, `krankenkasse wechseln`, `krankenkassen vergleich` à 10 k – 100 k ; 9 requêtes à 1 k – 10 k),
enchère haute de page jusqu'à 22,51 €. Fichier : `reports/volumes-2026-10-15/de-gkv.txt` → `check-volumes.py` :
123 329 (GO, plancher 100 000). Saisonnalité forte : pic d'octobre à janvier (annonces des caisses, Sonderkündigungsrecht).

## SERP réel (requêtes « zusatzbeitrag 2027 krankenkassen liste », « günstigste krankenkasse 2026 zusatzbeitrag vergleich rechner »)

Relevé le 2026-10-15 (recherche web + lecture des pages, `curl` pour le contenu servi).

| Résultat | Ce qu'il fait | Défaut constaté | Ce que nous faisons mieux |
|---|---|---|---|
| gkv-spitzenverband.de (liste officielle) | Liste des 92 caisses, taux du jour, Länder d'ouverture, PDF | Pagination 15 par page, aucun calcul en euros, aucun tri, aucune explication | Même liste lue chaque jour, triée par Land, en euros pour votre revenu, historique daté |
| check24.de/gesetzliche-krankenversicherung/rechner | Comparateur avec formulaire (8 champs), classement | « Stand: 01.2026 » sur la page en octobre ; 245 marqueurs d'affiliation/suivi ; le comparateur mène à une souscription | Taux du jour, aucune donnée personnelle, aucun lien d'affiliation |
| finanztip.de/gkv/gkv-zusatzbeitrag | Article long + calculateur d'économie vers la caisse la moins chère bundesweit | « Stand: 16. Juli 2026 » ; seulement les caisses bundesweit, pas de filtre Land ; recommandations « Preis-Leistung » | Toutes les caisses ouvertes dans votre Land (régionales comprises), cinq statuts (salarié, retraité, indépendant, étudiant, Midijob) |
| krankenkassen.de (liste par taux) | Liste de caisses avec taux | Aucune date de mise à jour, aucun calcul, aucun filtre Land | Date de la liste, calcul en euros, Land |
| krankenkasseninfo.de/krankenkassen/zusatzbeitrag | Liste + article 10/2026 + « Vergleichsrechner » | Champs téléphone/code postal (4), 26 marqueurs d'affiliation ; pas de calcul par statut | Pas de formulaire de contact, calcul complet par statut |
| bruttonettocalculator.com/zusatzbeitrag-2027 | Une page « 2027 » avec taux 2026 | Une seule page, taux 2026 figés au 5 octobre, pas de mise à jour automatique | Mise à jour quotidienne, 2027 provisoire chiffré (BBG 6 375 €, PV 6 075 €) |
| marcusknispel.com/gkv-zusatzbeitrag-2027 | Article de conseiller | Formulaire de lead (177 occurrences tel/plz), « Stand März 2026 » | Aucun lead, chiffres officiels datés |
| presse (evangelisch.de, apotheken-umschau.de, onvista) | Actualité du Schätzerkreis | Aucun taux par caisse, aucun calcul | Le chiffre pour votre caisse et votre revenu |

**Verdict SERP** : prenable mais défendu. Les deux premiers sont des portails puissants (Check24, Finanztip) ; aucun
ne calcule par Land avec les caisses régionales, aucun ne gère retraités/indépendants/étudiants/Midijob dans le
même outil, aucun ne date ses taux au jour. Les indépendants (krankenkassen.de, krankenkasseninfo.de, petits
blogs) sont présents dans le top 10 : le SERP n'est pas imprenable.

**Phrase de valeur ajoutée (§6.6)** : ce site fait mieux que le premier résultat parce qu'il lit la liste
officielle chaque jour, ne montre que les caisses que vous pouvez réellement choisir dans votre Land, chiffre en
euros votre cotisation réelle selon votre statut (salarié, retraité avec Betriebsrente, indépendant, étudiant,
Midijob, Sachsen) et la date de changement exacte, sans aucune donnée personnelle ni lien d'affiliation.

## Actif de données (§2.2)

- Liste officielle GKV-Spitzenverband (`scripts/fetch-kassen.py`, quotidienne, Action GitHub) : 92 caisses ×
  taux × Länder d'ouverture ; historique cumulé daté (`src/data/kassen-historie.json`, départ le 2026-10-15).
- Paramètres légaux 2026 et 2027 (provisoire) lus sur les sources primaires : `src/data/params-2026.json`.
- Nouveautés que les concurrents n'ont pas : BBG KV 2027 avec les 3 600 € du GKV-Beitragssatzstabilisierungsgesetz
  (BGBl. 2026 I Nr. 228), BBG PV 2027 restée à 6 075 € selon § 55 Abs. 2 SGB XI en vigueur, Ehegattenzuschlag 2,5
  points dès 2028 (§ 242b), Minijob-Pauschale 2027 = 14,6 + Ø.

## Leads (§2.3)

Les comparateurs vendent des souscriptions (affiliation caisses, Wechselservice). Ici : aucun lien d'affiliation,
aucun formulaire, conformément au brief.

## Limites assumées

- Les taux 2027 des caisses n'existent pas avant décembre ; la liste officielle ne les montre qu'au jour de validité.
- Les prestations (Bonusprogramme, Satzungsleistungen) ne sont pas chiffrées.

## Passe qualité du 2026-10-16 (BRIEF-QUALITE-2026-10-16)

- **Sachsen dans l'Übergangsbereich modélisé** (avant : « nicht abgebildet ») selon le Gemeinsames Rundschreiben
  GKV-SV / DRV / BA du 16.08.2022 (Ziffer 4.3.3.1, Beispiel 9) et § 58 Abs. 3 et 5 SGB XI : part du salarié = demi-taux
  + 0,5 point sur BE Arbeitnehmer, employeur = Gesamtbeitrag − part du salarié. Corrigé au passage : le
  Kinderlosenzuschlag porte sur BE gesamt (§ 2 Abs. 2 Satz 6 BVV ; avant : sur BE Arbeitnehmer, trop bas) et le
  Kinderabschlag sur BE Arbeitnehmer (GKV-SV 31.03.2025, Abschnitt 3.3) ; allgemeiner Beitrag et Zusatzbeitrag
  arrondis séparément. Tests : les deux exemples officiels recalculés au centime (Beispiel 9 : 31,36 / 17,40 / 13,96 /
  Zuschlag 3,60 € ; GKV-SV 2025 : 29,38 / 19,56 / 8,46 €) + 4 cas saxons 2026.
- **Faktor F 2027** : pas encore publié par le BMAS (Bundesanzeiger, au plus tard le 31/12/2026), donc « vorläufig ».
  Mais la formule change au 1/1/2027 (Art. 2 Nr. 1 et Art. 8 Abs. 2 GKV-Beitragssatzstabilisierungsgesetz, BGBl. 2026 I
  Nr. 228) : numérateur = 14,6 + Ø Zusatzbeitrag + 15 (RV-Pauschale § 168 Abs. 1 Nr. 1b SGB VI) au lieu de 28. Avant :
  0,6619 (ancienne formule) ; après : 32,5 / 42,3 = 0,7683, testé.
- **Action quotidienne** : `scripts/fetch-kassen.py` lancé en local le 2026-10-16 : 92 caisses, liste du jour, sortie 0 ;
  dans GitHub Actions, l'étape de lecture, les tests et le build passent ; seul le déploiement Pages échoue (Pages
  pas encore activé, hors périmètre).
- Règles des guides relues : la limite « 14. Fachsemester » n'existe plus dans § 5 Abs. 1 Nr. 9 SGB V (texte du
  2026-10-16) → corrigé (fin avec le semestre des 30 ans, § 190 Abs. 9) sur 3 pages ; § 173, § 188 Abs. 4, § 65a,
  § 11 Abs. 6 SGB V, § 23a SGB IV, § 106 SGB VI ajoutés comme sources là où la règle était énoncée sans source.
