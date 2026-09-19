# Backlog audit ⇄ design — Locavan

> Fichier partagé entre les skills `locavan-audit` (diagnostic) et
> `locavan-redesign` (design). Règles : `.claude/skills/locavan-audit/references/backlog-protocol.md`.
> L'audit crée et clôt les constats ; le design traite les éléments « Porteur : design ».

## Tableau de bord

_Mis à jour le 2026-09-19 par locavan-redesign. Aucun audit n'a encore été mené :
le premier audit importera les éléments ouverts de l'ancien plan §9._

| ID | Titre | Statut | Porteur | Gravité |
|---|---|---|---|---|
| DSN-002 | `<html lang="en-us">` sur un site en français | à qualifier | — | — |
| DSN-001 | Pages « Devenir loueur » et « Aide » à créer | ouvert | code | 🟡 |
| DSN-003 | Refonte du menu burger mobile | à vérifier | design | 🟠 |

## Éléments

### DSN-001 · Pages « Devenir loueur » et « Aide » à créer
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : produit
- **Gravité** : 🟡
- **Où** : `resources/views/components/header.edge` (nav desktop), `resources/views/components/burger.edge` (liens `#` commentés « DSN-001 »)
- **Constat** : exigence née de la maquette du burger : les deux entrées sont dessinées à leur place définitive mais pointent vers `#` faute de page. « Devenir loueur » n'est affiché qu'aux visiteurs.
- **Attendu** : deux routes et pages réelles ; plus aucun `href="#"` pour ces libellés dans le header ni le burger.
- **Liens** : DSN-003 · ancien plan §9.3 « Pages statiques manquantes »
- **Journal** :
  - 2026-09-19 — ouvert (locavan-redesign, refonte du burger)

### DSN-002 · `<html lang="en-us">` sur un site en français
- **Statut** : à qualifier
- **Porteur** : —
- **Domaine** : a11y
- **Gravité** : —
- **Où** : `resources/views/components/layout.edge:2`
- **Constat** : signalement croisé pendant la refonte du burger, non diagnostiqué : la page déclare l'anglais alors que tout le contenu est en français (les lecteurs d'écran prononceraient le texte avec une voix anglaise). Hors périmètre design.
- **Attendu** : à fixer par l'audit.
- **Liens** : —
- **Journal** :
  - 2026-09-19 — signalé (locavan-redesign)

### DSN-003 · Refonte du menu burger mobile
- **Statut** : à vérifier
- **Porteur** : design
- **Domaine** : ux
- **Gravité** : 🟠
- **Où** : `resources/views/components/burger.edge`, `resources/views/components/header.edge` (bouton burger), `resources/js/app.js` (Alpine `burger`)
- **Constat** : avant refonte, un utilisateur connecté n'avait aucun accès à son compte sous 640 px ; les 3 liens du burger pointaient vers `#` ; style pré-refonte (photo Unsplash, `amber-500`) ; ouverture/fermeture sans vrais boutons ; menu fermé resté dans le parcours clavier ; badge des demandes invisible sur mobile.
- **Attendu** :
  1. Sous 640 px, un connecté atteint depuis le burger : Mes réservations, Mes annonces, Réservations reçues, Modifier profil, Admin (si admin), Déconnexion ; un visiteur : Inscription, Connexion.
  2. Aucun lien `#` hors « Devenir loueur » / « Aide » (DSN-001).
  3. Bouton burger = `<button>` avec `aria-label`, `aria-controls`, `aria-expanded` ; nombre de demandes en attente dans le libellé et en badge.
  4. Menu fermé non focusable ; Échap, ✕ et voile ferment ; focus rendu au bouton ; défilement de la page bloqué quand il est ouvert.
  5. Aucune couleur hors tokens ; aucun texte en `accent` sur fond clair.
- **Liens** : brief `docs/audit-design/briefs/burger-mobile.md` · maquette Claude Design « Locavan - Menu burger mobile » (projet `66be929f-…`, variante 1b) · DSN-001 · ancien plan §9.3 « Refonte totale du menu burger mobile »
- **Journal** :
  - 2026-09-19 — intégré (locavan-redesign), branche `feat/burger-redesign`, commit `957fd5d`. Vérifié : typecheck, 47/47 tests, rendu visiteur et connecté (3 demandes en attente), test manuel navigateur par Nando. Limites connues laissées à l'appréciation de l'audit : pas de vrai piège de focus dans le tiroir (plugin `@alpinejs/focus` non installé, choix assumé) ; si la fenêtre passe au-delà de 640 px menu ouvert, le défilement reste bloqué jusqu'au rechargement ; entrée « Admin » non rendue en dev faute de compte admin en base. `x-transition:leave-start` retiré volontairement (animation meilleure sans, constaté par Nando).
