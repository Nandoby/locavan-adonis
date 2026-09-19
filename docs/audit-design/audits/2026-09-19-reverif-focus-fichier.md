# Audit re-vérification (focus des champs, champ fichier) — 2026-09-19

- **Périmètre** : re-vérification. `à vérifier` : AUD-015 et DSN-004 ; `à qualifier` : DSN-005.
- **Commit audité** : `f031b63` (`main`, merge de la PR #22, branche `fix/focus-champs`)
- **Audit précédent** : `audits/2026-09-19-reverif-lang-connexion.md` (commit `ddb9629`)
- **Outillage** : typecheck ✅ · lint ❌ 4 erreurs connues de `database/schema.ts`, rien de nouveau · tests 52/52 · HTML rendu analysé en visiteur et en connecté (compte propriétaire) · requêtes de recherche comparées sur le serveur de dev · comportement dans le navigateur constaté par Nando (sélecteur de fichier, nom affiché, anneaux de focus)
- **Indépendance** : l'intégration a été faite dans la même session. La vérification s'appuie sur les critères « Attendu », fixés avant l'intégration, et sur le rendu et le code.

## Synthèse

Le focus clavier est maintenant visible sur tous les champs du parcours principal.
Dans les barres de recherche et de réservation, c'est le segment actif qui
s'entoure d'`accent-dark`. Le nouveau composant de champ fichier remplace les 5
contrôles natifs, avec un bouton en français, le nom du fichier choisi et des
consignes alignées sur le validateur. **AUD-015 et DSN-004 sont clos.**

Le signalement DSN-005 est **confirmé en 🟠**. Depuis l'accueil, principale porte
d'entrée du site, les champs « Dates » et « Voyageurs » ne filtrent rien : le
visiteur reçoit les 10 annonces, y compris des véhicules indisponibles ou trop
petits.

## ✅ Ce qui va

- Les 9 champs de barre qui gardent `focus:outline-none` ont tous leur remplacement, le segment `focus-within` (vérifié sur le HTML rendu). La règle est écrite dans le style guide, donc applicable aux prochains écrans.
- `file.control` est un bon modèle de composant à réutiliser :
  - il se branche dans `field.root` comme les autres contrôles ;
  - le champ reste natif et accessible (`<label for>`, `aria-describedby` vers le texte d'aide et l'erreur, `accept`) ;
  - il utilise uniquement des tokens ;
  - il fonctionne sans JavaScript : seul le nom du fichier ne s'affiche pas.
- Le libellé du profil (« Avatar ») est maintenant un vrai label : une partie d'AUD-021 est réglée.
- Aucun test cassé : les noms de champs d'upload sont inchangés.

## ❌ Ce qui ne va pas

### Produit / UX
- 🟠 **DSN-005** · (confirmé) La recherche de l'accueil envoie `date` et `voyageur`, que le contrôleur ignore. Mesure : `voyageur=9` donne 10 résultats, alors que `minSeats=9` en donne 0. Pas de datepicker sur « Dates ». → Porteur code, avec une petite décision de mise en forme de la barre : un segment « Dates » contre deux dates attendues.

### UI (précision sur un élément existant)
- 🟡 **AUD-028** · Le profil et la création/modification d'annonce gardent l'anneau bleu par défaut du navigateur (constaté par Nando) : il est visible, mais pas encore celui du style guide.

## Re-vérifications

| ID | Attendu | Résultat | Nouveau statut |
|---|---|---|---|
| AUD-015 | Indicateur de focus ≥ 3:1 sur tout champ ; documenté ; plus de `focus:outline-none` sans remplacement | 9/9 champs de barre dans un segment `focus-within` ; auth avec l'anneau commun ; `accent-dark` à 6,3:1 ; style guide à jour. Les boutons à `focus:ring-*` relèvent d'AUD-016 | **clos** |
| DSN-004 (1) | 5 champs sur `file.control`, plus de `.input-file` | ✅ | |
| DSN-004 (2) | label relié, `accept`, `aria-describedby` | ✅ sur le rendu de `/signup`, `/profile`, `/vehicles/create` et `/vehicles/9/edit` | |
| DSN-004 (3) | Focus visible, nom du fichier affiché | Règle CSS générée ; constaté dans le navigateur par Nando | |
| DSN-004 (4) | Aperçu des avis conservé, tests verts | `@change` et `x-on:change` coexistent (code) ; 52/52 | |
| DSN-004 (5) | Pas de couleur hors tokens | ✅ | **clos** |
| DSN-005 | (à qualifier) | Confirmé, mesure à l'appui | ouvert, code, 🟠 |

## Transmis au design

- **Écrans pré-refonte** : AUD-016 🟠 (contrastes), AUD-028 (dont l'alignement de l'anneau de focus sur le profil et les annonces)
- **Pages d'erreur** : AUD-017 🟠
- Le reste est sans changement : AUD-003, AUD-009, AUD-022, AUD-027, AUD-031

## Transmis au dev (code)

1. 🟠 **DSN-005** : brancher la barre de l'accueil sur les vrais filtres (`startDate`/`endDate`, `minSeats`), avec datepicker, et ajouter un test
2. 🟡 Suite inchangée : AUD-019, AUD-020/021/023, AUD-029, AUD-030, AUD-024 à 026, puis les éléments déjà connus

## Limites de cet audit

- Pas de navigateur de mon côté : le comportement du composant fichier et l'aspect des anneaux reposent sur le constat de Nando.
- Le formulaire d'avis (`/bookings/:id`) n'a pas été rendu, faute de réservation terminée sans avis dans la base de dev.
- DSN-005 : le comptage des résultats repose sur les liens vers les annonces dans le HTML ; les deux requêtes ont été mesurées de la même façon.
