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
- La répartition saxonne de la Pflege dans l'Übergangsbereich n'est pas modélisée (signalé dans le calculateur).
