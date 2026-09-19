# Audit re-vérification (recherche de l'accueil, DSN-005) — 2026-09-19

- **Périmètre** : re-vérification de l'unique élément `à vérifier`, DSN-005. Aucun élément `à qualifier`.
- **Commit audité** : `026ef04` (`main`, merge de la PR #23, branche `fix/recherche-accueil`)
- **Audit précédent** : `audits/2026-09-19-reverif-focus-fichier.md` (commit `f031b63`)
- **Outillage** : typecheck ✅ · lint ❌ 4 erreurs connues de `database/schema.ts`, rien de nouveau · tests 55/55 · formulaires comparés sur le HTML rendu · recherches mesurées sur le serveur de dev · calendrier et mise en page constatés dans le navigateur par Nando
- **Indépendance** : la correction a été faite dans la même session. La vérification s'appuie sur le critère « Attendu » fixé à la qualification, sur les mesures et sur les tests.

## Synthèse

La recherche lancée depuis l'accueil filtre enfin réellement. La barre envoie les
mêmes champs que celle des résultats, et les dates passent par le même calendrier.
**DSN-005 est clos.** Il n'y a plus aucun 🟠 côté code. Les deux 🟠 restants sont
côté design : AUD-016 (contrastes des écrans pré-refonte) et AUD-017 (pages
d'erreur).

## ✅ Ce qui va

- Une seule forme de recherche sur le site : l'accueil et les résultats envoient les mêmes quatre champs, avec les mêmes identifiants de calendrier. Le filtrage n'est défini qu'à un seul endroit (`parseSearchFilters`).
- Mesures sur le serveur de dev :
  - `minSeats=9` : 0 annonce, contre 10 avant la correction ;
  - dates du 20 au 23/09/2026 : 8 annonces sur 10, les véhicules 2 et 6, réservés sur cette période, étant exclus.
- Les labels de l'accueil sont reliés à leurs champs, y compris les dates : l'identifiant est passé à `field.root`. Le scan de `/` ne signale plus aucun champ sans label.
- Premiers tests du filtrage par voyageurs et par dates (`home_search.spec.ts`) : jusqu'ici, ces filtres n'étaient couverts par aucun test.
- Le bouton de recherche de l'accueil utilise maintenant les tokens (`bg-accent text-ink`), ce qui règle une partie d'AUD-031.

## ❌ Ce qui ne va pas

Rien de nouveau.

## Re-vérifications

| ID | Attendu | Résultat | Nouveau statut |
|---|---|---|---|
| DSN-005 (1) | Même recherche depuis l'accueil et depuis les résultats = mêmes annonces | Mêmes champs et mêmes ids dans les deux formulaires ; mesures `minSeats` et dates conformes | ✅ |
| DSN-005 (2) | Même calendrier, dates passées exclues | Ids `search_*` visés par `initSearchDatepickers` (`minDate: new Date()`) ; constaté dans le navigateur par Nando | ✅ |
| DSN-005 (3) | Test des paramètres envoyés par l'accueil | `home_search.spec.ts` : 3 tests verts | ✅ **clos** |

## Transmis au design

Sans changement. Priorités 🟠 :
- **Écrans pré-refonte** (auth, profil, réservations, annonces) : AUD-016, avec AUD-028
- **Pages d'erreur 404/500** : AUD-017

## Transmis au dev (code)

Il ne reste que des 🟡. Dans l'ordre : AUD-019 (règles de réservation côté serveur), AUD-020, AUD-021 et AUD-023 (accessibilité mécanique), AUD-029 (tests), AUD-030, AUD-024, AUD-025 et AUD-026, puis les éléments déjà connus.

## Limites de cet audit

- Le calendrier et la mise en page responsive reposent sur le constat de Nando dans le navigateur.
- Sur la page des résultats, les labels des dates restent non reliés : c'est AUD-021, hors périmètre de ce passage.
