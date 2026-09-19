# Backlog audit ⇄ design — Locavan

> Fichier partagé entre les skills `locavan-audit` (diagnostic) et
> `locavan-redesign` (design). Règles : `.claude/skills/locavan-audit/references/backlog-protocol.md`.
> L'audit crée et clôt les constats ; le design traite les éléments « Porteur : design ».

## Tableau de bord

_Mis à jour le 2026-09-19 par locavan-audit (audit complet, rapport `audits/2026-09-19-complet.md`)._

| ID | Titre | Statut | Porteur | Gravité |
|---|---|---|---|---|
| AUD-014 | Promesses non tenues : assurance, assistance, annulation remboursée, profils vérifiés, confirmation immédiate | ouvert | design | 🟠 |
| AUD-015 | Focus clavier invisible sur les champs de saisie | ouvert | design | 🟠 |
| AUD-016 | Boutons et liens d'action illisibles sur les écrans pré-refonte (contraste 1,5 à 3,3:1) | ouvert | design | 🟠 |
| AUD-017 | Pages d'erreur 404/500 : gabarit de démonstration AdonisJS en anglais | ouvert | design | 🟠 |
| AUD-018 | Visiteur qui clique « Réserver » : renvoyé vers l'accueil après connexion, annonce et dates perdues | ouvert | code | 🟠 |
| DSN-002 | `<html lang="en-us">` sur un site en français | ouvert | code | 🟠 |
| AUD-003 | Pages statiques absentes, liens morts dans le footer et l'accueil | ouvert | design | 🟡 |
| AUD-009 | Back-office resté au style d'avant la refonte | ouvert | design | 🟡 |
| AUD-022 | Messages flash : disparaissent en 5 s, peu lisibles, débordent sur mobile | ouvert | design | 🟡 |
| AUD-027 | Écrans propriétaire : réservations reçues sans détail, annonces sans lien | ouvert | design | 🟡 |
| AUD-028 | Écrans pré-refonte : palette brute, microcopie mêlée d'anglais, états vides à concevoir | ouvert | design | 🟡 |
| AUD-031 | Écrans refondus : couleurs hors tokens | ouvert | design | 🟡 |
| AUD-001 | Tiroir mobile ouvert : le focus clavier s'échappe vers la page masquée | ouvert | code | 🟡 |
| AUD-002 | Défilement bloqué si la fenêtre dépasse 640 px menu ouvert | ouvert | code | 🟡 |
| AUD-004 | Nommage des routes : `bookings()` et `/listing` | ouvert | code | 🟡 |
| AUD-005 | Favoris affichés mais inactifs (F10) | ouvert | code | 🟡 |
| AUD-006 | Adresse e-mail jamais vérifiée (reste de F7) | ouvert | code | 🟡 |
| AUD-007 | Admin en lecture seule, aucune modération (F9) | ouvert | code | 🟡 |
| AUD-008 | Pas de tableau de bord propriétaire ni de blocage de dates (F8) | ouvert | code | 🟡 |
| AUD-010 | Double réservation empêchée seulement par l'application (SQLite) | ouvert | code | 🟡 |
| AUD-011 | Montants en décimal, prix d'annonce nullable (B19) | ouvert | code | 🟡 |
| AUD-012 | Photos stockées sans redimensionnement (F12) | ouvert | code | 🟡 |
| AUD-013 | CSP désactivée | ouvert | code | 🟡 |
| AUD-019 | Règles de réservation vérifiées seulement côté navigateur | ouvert | code | 🟡 |
| AUD-020 | Liens-images de la galerie et des photos d'avis sans nom accessible | ouvert | code | 🟡 |
| AUD-021 | Champs sans label associé : dates de recherche, avatar du profil | ouvert | code | 🟡 |
| AUD-023 | Structure des pages : double `<main>`, titres qui sautent des niveaux, pas de lien d'évitement | ouvert | code | 🟡 |
| AUD-024 | SEO de base absent et titres de page incohérents | ouvert | code | 🟡 |
| AUD-025 | Ressources front chargées pour rien sur toutes les pages | ouvert | code | 🟡 |
| AUD-026 | Note moyenne : une requête par véhicule, arrondie à l'entier | ouvert | code | 🟡 |
| AUD-029 | Tests manquants sur des autorisations et des parcours critiques | ouvert | code | 🟡 |
| AUD-030 | Validation : mot de passe plafonné à 32 caractères, champs sans borne | ouvert | code | 🟡 |
| DSN-001 | Pages « Devenir loueur » et « Aide » à créer | ouvert | code | 🟡 |
| DSN-003 | Refonte du menu burger mobile | clos | design | 🟠 |

## Éléments

### DSN-001 · Pages « Devenir loueur » et « Aide » à créer
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : produit
- **Gravité** : 🟡
- **Où** : `resources/views/components/header.edge` (nav desktop), `resources/views/components/burger.edge` (liens `#` commentés « DSN-001 »)
- **Constat** : exigence née de la maquette du burger : les deux entrées sont dessinées à leur place définitive mais pointent vers `#` faute de page. « Devenir loueur » n'est affiché qu'aux visiteurs.
- **Attendu** : deux routes et pages réelles ; plus aucun `href="#"` pour ces libellés dans le header ni le burger.
- **Liens** : DSN-003 · AUD-003 · ancien plan §9.3 « Pages statiques manquantes »
- **Journal** :
  - 2026-09-19 — ouvert (locavan-redesign, refonte du burger)

### DSN-002 · `<html lang="en-us">` sur un site en français
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : a11y
- **Gravité** : 🟠
- **Où** : `resources/views/components/layout.edge:2`
- **Constat** : signalement croisé pendant la refonte du burger, non diagnostiqué : la page déclare l'anglais alors que tout le contenu est en français (les lecteurs d'écran prononceraient le texte avec une voix anglaise). Hors périmètre design.
- **Attendu** : `lang="fr"` sur `components/layout.edge` et `components/admin/layout.edge` ; le scan HTML affiche `lang=fr` sur toutes les pages.
- **Liens** : —
- **Journal** :
  - 2026-09-19 — signalé (locavan-redesign)
  - 2026-09-19 — qualifié par locavan-audit : confirmé. Le scan affiche `lang=en-us` sur les 12 pages analysées (la 13e est la page de debug 404), visiteur comme connecté. Même défaut dans `components/admin/layout.edge:2`, alors que `components/email/layout.edge:2` déclare déjà `fr`. Non-conformité WCAG 3.1.1 (niveau A) sur tout le site : 🟠. Correction mécanique, donc porteur code.
  - 2026-09-19 — toujours présent (audit complet) : `lang=en-us` sur les 19 pages scannées, y compris les 4 pages admin rendues avec un compte admin.

### DSN-003 · Refonte du menu burger mobile
- **Statut** : clos
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
  - 2026-09-19 — **clos** par locavan-audit (re-vérification, commit `e643853`). Les 5 critères sont remplis, détail dans `audits/2026-09-19-reverif-burger.md`. Réserve : « Admin » vérifié dans le code seulement (même condition `auth.user.isAdmin` que le menu desktop), faute de compte admin en dev. Les deux limites connues sont reprises comme constats séparés (AUD-001, AUD-002), car elles ne font pas partie des critères.

### AUD-001 · Tiroir mobile ouvert : le focus clavier s'échappe vers la page masquée
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : a11y
- **Gravité** : 🟡
- **Où** : `resources/views/components/burger.edge:23` (`role="dialog"` + `aria-modal="true"`), `resources/js/app.js:29-41` (aucun piège de focus, pas de `inert` sur la page)
- **Constat** : le tiroir s'annonce comme une fenêtre modale, mais rien ne retient le focus. Depuis « Déconnexion », Tab repart vers les éléments de la page, cachés sous le voile (logo, « Inscription », contenu), et le focus devient invisible (WCAG 2.4.3 et 2.4.11). Impact limité : la navigation au clavier sous 640 px est rare, et Échap ferme bien le tiroir.
- **Attendu** : tiroir ouvert, Tab et Shift+Tab bouclent dans le tiroir et aucun élément de la page n'est atteignable (`x-trap` via `@alpinejs/focus`, ou `inert` sur le reste de la page).
- **Liens** : DSN-003
- **Journal** :
  - 2026-09-19 — ouvert (locavan-audit, re-vérification burger), à partir d'une limite signalée dans DSN-003

### AUD-002 · Défilement bloqué si la fenêtre dépasse 640 px menu ouvert
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : ux
- **Gravité** : 🟡
- **Où** : `resources/js/app.js:35-40` (seul `close()` retire `overflow-hidden`), `resources/views/components/burger.edge` (tiroir et voile en `sm:hidden`)
- **Constat** : si on ouvre le menu puis qu'on élargit la fenêtre au-delà de 640 px (rotation d'une tablette, fenêtre redimensionnée), le tiroir disparaît par CSS mais `isVisible` reste vrai et `body` garde `overflow-hidden` : la page ne défile plus jusqu'au rechargement.
- **Attendu** : passer au-dessus de 640 px menu ouvert ferme le menu, ou au moins libère le défilement.
- **Liens** : DSN-003
- **Journal** :
  - 2026-09-19 — ouvert (locavan-audit, re-vérification burger), à partir d'une limite signalée dans DSN-003

### AUD-003 · Pages statiques absentes, liens morts dans le footer et l'accueil
- **Statut** : ouvert
- **Porteur** : design
- **Domaine** : produit
- **Gravité** : 🟡
- **Où** : `resources/views/pages/home.edge` (footer, l. ~290-310 ; bouton « Mettre mon véhicule en location » l. 267, sans `href`)
- **Constat** : le scan HTML de `/` relève en `#` « Idées d'itinéraires », « Prix et frais », « Assurance propriétaire », « Guide du loueur », « Nous contacter », « CGU » et « Confidentialité », plus un lien sans `href`. « Assurance propriétaire » annonce en plus une assurance qui n'existe pas. Il faut décider du contenu et de la forme de ces pages, et de la formulation (porteur design).
- **Attendu** : chaque lien du footer et de l'accueil mène à une page réelle, ou est retiré ou reformulé ; aucun libellé ne promet une fonctionnalité absente.
- **Liens** : DSN-001 · AUD-014 · ancien plan §9.3 « Pages statiques manquantes »
- **Journal** :
  - 2026-09-19 — importé de l'ancien plan (locavan-audit)
  - 2026-09-19 — confirmé (audit complet) : le scan de `/` relève toujours les 7 liens `#` du footer et « Mettre mon véhicule en location » sans `href`. La promesse « Assurance propriétaire » rejoint les autres promesses non tenues d'AUD-014.

### AUD-004 · Nommage des routes : `bookings()` et `/listing`
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : tech
- **Gravité** : 🟡
- **Où** : `start/routes.ts:28` (`/listing`), `start/routes.ts:39` (`[controllers.Bookings, 'bookings']`)
- **Constat** : les noms ne suivent pas les conventions resourceful d'Adonis : `/listing` pour « mes annonces », et une action `bookings()` au lieu d'`index()`.
- **Attendu** : `/vehicles/mine` (ou équivalent) et `BookingsController.index()` ; tous les `urlFor` mis à jour, tests verts.
- **Liens** : ancien plan §9.3
- **Journal** :
  - 2026-09-19 — importé de l'ancien plan (locavan-audit)

### AUD-005 · Favoris affichés mais inactifs (F10)
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : produit
- **Gravité** : 🟡
- **Où** : `resources/views/pages/vehicles/show.edge:44-50` (« Enregistrer » désactivé, `title="Favoris — arrive avec une prochaine évolution"`)
- **Constat** : le design prévoit les favoris, mais le bouton est un `<span>` inactif. C'est honnête (il est marqué comme à venir), mais la fonctionnalité manque.
- **Attendu** : un utilisateur connecté peut ajouter ou retirer un favori et retrouver sa liste.
- **Liens** : ancien plan §8 F10, §9.3
- **Journal** :
  - 2026-09-19 — importé de l'ancien plan (locavan-audit)

### AUD-006 · Adresse e-mail jamais vérifiée (reste de F7)
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : sécu
- **Gravité** : 🟡
- **Où** : aucune colonne `email_verified_at` (`app/`, `database/`)
- **Constat** : n'importe qui peut créer un compte, réserver ou publier avec une adresse qui ne lui appartient pas. Les mails transactionnels (F6) partent alors chez un tiers.
- **Attendu** : lien de vérification signé envoyé à l'inscription, avec possibilité de le renvoyer ; décision explicite sur ce qu'un compte non vérifié peut faire (penchant du plan : ni réserver, ni publier).
- **Liens** : ancien plan §9.4 F7 · AUD-014
- **Journal** :
  - 2026-09-19 — importé de l'ancien plan (locavan-audit)
  - 2026-09-19 — audit complet : l'accueil annonce pourtant « Profils vérifiés — Identité et permis contrôlés des deux côtés » (`home.edge:119-120`), voir AUD-014.

### AUD-007 · Admin en lecture seule, aucune modération (F9)
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : produit
- **Gravité** : 🟡
- **Où** : `start/routes.ts:85-88` (routes admin en `GET` uniquement)
- **Constat** : l'admin voit les utilisateurs, annonces et avis, mais ne peut ni supprimer un avis, ni dépublier une annonce, ni suspendre un compte.
- **Attendu** : actions de modération derrière `middleware.admin()`, avec confirmation et tests.
- **Liens** : ancien plan §9.4 F9 · AUD-009
- **Journal** :
  - 2026-09-19 — importé de l'ancien plan (locavan-audit)

### AUD-008 · Pas de tableau de bord propriétaire ni de blocage de dates (F8)
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : produit
- **Gravité** : 🟡
- **Où** : —
- **Constat** : un propriétaire ne peut pas rendre son véhicule indisponible sur des dates hors réservation, et n'a pas de vue d'ensemble de ses annonces et demandes. L'écran demandera un brief design au moment de le faire.
- **Attendu** : blocage manuel de dates pris en compte par les 3 contrôles de disponibilité ; vue propriétaire récapitulative.
- **Liens** : ancien plan §9.4 F8 · AUD-027
- **Journal** :
  - 2026-09-19 — importé de l'ancien plan (locavan-audit)

### AUD-009 · Back-office resté au style d'avant la refonte
- **Statut** : ouvert
- **Porteur** : design
- **Domaine** : ui
- **Gravité** : 🟡
- **Où** : `resources/views/components/admin/layout.edge`, `resources/views/partials/admin/header.edge`, `resources/views/partials/admin/nav.edge`, `resources/views/pages/admin/*`
- **Constat** : barre sombre et palette `gray`/`amber` d'avant la refonte (style guide : « pré-refonte, reporté »). Ce n'est visible que des admins.
- **Attendu** : back-office aligné sur le style guide (tokens, composants, focus).
- **Liens** : ancien plan §9.3 bis · AUD-007
- **Journal** :
  - 2026-09-19 — importé de l'ancien plan (locavan-audit)

### AUD-010 · Double réservation empêchée seulement par l'application (SQLite)
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : tech
- **Gravité** : 🟡
- **Où** : `app/controllers/bookings_controller.ts` (`store()`, vérification du chevauchement dans une transaction)
- **Constat** : l'absence de chevauchement repose sur une transaction applicative. Aucune contrainte en base ne l'interdit, ce qui est acceptable en local mais fragile avant un vrai déploiement.
- **Attendu** : avant la mise en production, passage à PostgreSQL avec une contrainte d'exclusion sur `(vehicle_id, daterange)` pour les statuts actifs.
- **Liens** : ancien plan §6, §9.5
- **Journal** :
  - 2026-09-19 — importé de l'ancien plan (locavan-audit)

### AUD-011 · Montants en décimal, prix d'annonce nullable (B19)
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : tech
- **Gravité** : 🟡
- **Où** : `database/migrations/1786652763766_create_vehicles_table.ts:9` (`table.decimal('price')`, nullable par défaut)
- **Constat** : l'argent est stocké en décimal, lu comme un nombre flottant côté JS, et le prix d'une annonce peut être nul en base.
- **Attendu** : montants en centimes entiers, colonnes `notNullable`.
- **Liens** : ancien plan B19, §9.5
- **Journal** :
  - 2026-09-19 — importé de l'ancien plan (locavan-audit)
  - 2026-09-19 — audit complet : conséquences visibles. `listing.edge:28` appelle `vehicle.price.toFixed(2)`, qui plante si le prix est nul. Le total s'affiche brut dans `bookings/show.edge:56` et `bookings.edge:33` (`450.5 €`), mais avec `toFixed(2)` dans `received.edge:28`. `bookings_controller.ts:25` compte un prix nul comme 0 €.

### AUD-012 · Photos stockées sans redimensionnement (F12)
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : perf
- **Gravité** : 🟡
- **Où** : upload des photos d'annonce (Drive, disque `fs`)
- **Constat** : les photos sont servies à leur taille d'origine, sans miniatures ni conversion en webp.
- **Attendu** : redimensionnement et webp à l'upload (sharp), miniatures pour les cartes.
- **Liens** : ancien plan §8 F12, §9.5
- **Journal** :
  - 2026-09-19 — importé de l'ancien plan (locavan-audit)

### AUD-013 · CSP désactivée
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : sécu
- **Gravité** : 🟡
- **Où** : `config/shield.ts:18` (`csp.enabled: false`)
- **Constat** : aucune Content-Security-Policy n'est envoyée. Une injection de script éventuelle ne serait pas contenue par le navigateur.
- **Attendu** : CSP activée, avec les sources réellement utilisées (Vite, jsDelivr pour lightbox3, Google Fonts, picsum en dev).
- **Liens** : ancien plan §9.5 · AUD-025
- **Journal** :
  - 2026-09-19 — importé de l'ancien plan (locavan-audit)
  - 2026-09-19 — confirmé (audit complet) : `config/shield.ts`, `csp.enabled: false`. Les autres protections sont actives : CSRF, `X-Frame-Options: DENY`, HSTS de 180 jours, `nosniff`. Si AUD-025 supprime la feuille lightbox3 servie par jsDelivr, la CSP aura une source externe de moins à autoriser.

### AUD-014 · Promesses non tenues : assurance, assistance, annulation remboursée, profils vérifiés, confirmation immédiate
- **Statut** : ouvert
- **Porteur** : design
- **Domaine** : produit
- **Gravité** : 🟠
- **Où** : `resources/views/pages/home.edge:16` (texte du hero), `home.edge:105-121` (bandeau de réassurance), `resources/views/pages/vehicles/show.edge:411-419` (encart sous « Réserver »)
- **Constat** : le premier écran et la fiche annonce vendent des services qui n'existent pas :
  - « Assurance et assistance incluses » et « Tous risques pendant toute la durée du séjour » : aucune assurance.
  - « Assistance 24/7 — Dépannage partout en Belgique et en Europe » : aucune assistance.
  - « Annulation 48 h — Remboursement intégral sans justificatif » : il n'y a aucun paiement, donc rien à rembourser. De plus, `Booking.isCancellable` autorise l'annulation jusqu'au départ, pas 48 h avant.
  - « Profils vérifiés — Identité et permis contrôlés » : même l'adresse e-mail n'est pas vérifiée (AUD-006).
  - « Confirmation de réservation immédiate » : c'est faux, puisque la réservation part en demande `pending` que le propriétaire doit accepter (`bookings_controller.ts:45`, flash « Demande de réservation envoyée au propriétaire »).
  - « vous payez uniquement le prix affiché » : aucun paiement n'existe.
  - « à partir de 58 € la nuit » est codé en dur, alors que le prix minimum publié en base de dev est de 50,31 €.

  Dans un site mis en ligne, ce sont des pratiques commerciales trompeuses. Dans tous les cas, l'utilisateur qui croit sa réservation confirmée est induit en erreur.
- **Attendu** : aucun libellé de l'accueil ni de la fiche annonce ne décrit un service, une garantie ou un comportement absent du code. Le prix « à partir de » est calculé depuis la base ou retiré. Le texte près du bouton « Réserver » dit que la demande doit être acceptée par le propriétaire.
- **Liens** : AUD-003 (« Assurance propriétaire » dans le footer) · AUD-006
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-015 · Focus clavier invisible sur les champs de saisie
- **Statut** : ouvert
- **Porteur** : design
- **Domaine** : a11y
- **Gravité** : 🟠
- **Où** : `focus:outline-none` sans état de remplacement dans `pages/home.edge:38,51,64` (barre de recherche), `pages/vehicles/index.edge:29-79` (barre de recherche des résultats), `pages/vehicles/show.edge:380,396` (dates de réservation), `pages/auth/login.edge:18,32`, `signup.edge:27-79`, `forgot_password.edge:25`, `reset_password.edge:25,39`. Aucun `focus-within` dans `resources/views`.
- **Constat** : au clavier, rien ne signale le champ actif sur les trois écrans du parcours principal (recherche, réservation, connexion), à part le curseur de texte (WCAG 2.4.7). Le style guide ne définit un anneau de focus que pour les liens et les boutons. Comme le champ est intégré à une barre segmentée, il faut décider de la forme que prend son état de focus : porteur design.
- **Attendu** : tout champ de saisie focalisé au clavier montre un indicateur d'au moins 3:1 sur son fond (sur le champ ou sur son segment via `focus-within`), documenté dans le style guide ; plus aucun `focus:outline-none` sans remplacement.
- **Liens** : AUD-028
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-016 · Boutons et liens d'action illisibles sur les écrans pré-refonte (contraste 1,5 à 3,3:1)
- **Statut** : ouvert
- **Porteur** : design
- **Domaine** : a11y
- **Gravité** : 🟠
- **Où** / mesures (palette Tailwind, ratios approchés à partir des valeurs hex) :
  - `pages/vehicles/create.edge:234`, `edit.edge:227` : « Créer une annonce » / « Modifier », blanc sur `yellow-400`, **≈1,5:1**
  - `pages/profile.edge:127` : bouton d'enregistrement, blanc sur `green-400`, **≈1,7:1**
  - `pages/bookings/show.edge:145` : « Envoyer » (avis), blanc sur `green-500`, **≈2,3:1**
  - `pages/bookings/bookings.edge:39` : « En savoir plus », blanc sur `amber-600`, ≈3,2:1
  - `pages/vehicles/listing.edge:84` : « Mettre en pause / Publier », `amber-600` sur blanc, ≈3,2:1
  - `pages/bookings/received.edge:61` : « Accepter », `green-600` sur blanc, ≈3,3:1
  - `pages/bookings/bookings.edge:88` : état vide en `red-500` sur `page`, ≈3,6:1
- **Constat** : le bouton principal de création d'annonce et celui du profil sont pratiquement illisibles, et les autres sont sous 4,5:1 (WCAG 1.4.3). Tous ces écrans datent d'avant la refonte : les tokens (`bg-accent text-ink`, 6,3:1) règlent le problème, mais il faut décider du bouton principal et des boutons secondaires de ces écrans.
- **Attendu** : tout texte de bouton ou de lien ≥ 4,5:1 sur son fond sur ces écrans ; `contrast.mjs` et un `grep` des classes listées ne trouvent plus rien.
- **Liens** : AUD-028 · AUD-022 (contraste des messages flash)
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-017 · Pages d'erreur 404/500 : gabarit de démonstration AdonisJS en anglais
- **Statut** : ouvert
- **Porteur** : design
- **Domaine** : ux
- **Gravité** : 🟠
- **Où** : `resources/views/pages/errors/not_found.edge`, `server_error.edge` (6 lignes chacune, sans `@layout`), `app/exceptions/handler.ts:18` (`renderStatusPages = app.inProduction`), `app/controllers/vehicles_controller.ts:133` (`response.notFound('Annonce introuvable')`)
- **Constat** : en production, toute page introuvable affiche « 404 - Page not found / This template is rendered by the status pages feature… », avec un lien vers la documentation d'AdonisJS : sans header ni style, et en anglais. Une annonce en pause ou supprimée, cas fréquent quand on suit un lien partagé, renvoie le texte brut « Annonce introuvable ». Ce n'est pas visible en dev, où Youch prend la main.
- **Attendu** : 404 et 500 rendues dans le layout du site, en français, avec un chemin de sortie (accueil, recherche) ; l'annonce indisponible passe par la même page 404.
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-018 · Visiteur qui clique « Réserver » : renvoyé vers l'accueil après connexion, annonce et dates perdues
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : ux
- **Gravité** : 🟠
- **Où** : `start/routes.ts:32` (`POST /vehicles/:id/bookings` derrière `middleware.auth()`), `app/middleware/auth_middleware.ts:13` (redirection vers `/login`), `app/controllers/session_controller.ts:37` (toujours `home.index`)
- **Constat** : parcours 1 (visiteur → recherche → fiche → réservation). Le formulaire de réservation est affiché aux visiteurs. Quand un visiteur choisit ses dates et clique « Réserver », il est renvoyé vers `/login`, puis, une fois connecté, vers l'accueil. L'annonce est perdue et il doit tout recommencer. L'inscription (`new_account_controller.ts:33`) renvoie elle aussi vers l'accueil.
- **Attendu** : après connexion ou inscription depuis une tentative de réservation, retour sur la fiche de l'annonce, avec les dates pré-remplies si possible. Test fonctionnel du parcours.
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-019 · Règles de réservation vérifiées seulement côté navigateur
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : tech
- **Gravité** : 🟡
- **Où** : `app/validators/booking.ts:4-5`, `app/controllers/bookings_controller.ts:18-49`, `resources/views/pages/vehicles/show.edge:364-409` (formulaire affiché sans condition `isOwner`)
- **Constat** : le serveur accepte (1) une réservation dans le passé, puisque seul le datepicker empêche ces dates (`datepicker.js:39`, `minDate`) ; (2) une réservation sur une annonce en pause ou en brouillon ; (3) une réservation par le propriétaire de sa propre annonce, avec le formulaire affiché et une demande qu'il reçoit ensuite dans « Réservations reçues ». Les points 1 et 2 demandent une requête forgée, mais le point 3 est accessible depuis l'interface.
- **Attendu** : `store()` refuse une date de début antérieure à aujourd'hui, une annonce non `published` et une réservation par le propriétaire ; le formulaire n'est pas affiché au propriétaire ; un test par règle.
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-020 · Liens-images de la galerie et des photos d'avis sans nom accessible
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : a11y
- **Gravité** : 🟡
- **Où** : `resources/views/pages/vehicles/show.edge:63-73` (mosaïque), `show.edge:324-333` (photos des avis)
- **Constat** : chaque lien ne contient qu'une `<img alt="">`, et un lecteur d'écran annonce donc « lien » suivi de l'URL. Le scan en relève 14 sur `/vehicles/1` (WCAG 2.4.4, 4.1.2).
- **Attendu** : chaque lien de photo a un nom (« Photo 2 sur 5 de <modèle> », par exemple), et le scan ne signale plus aucun « lien sans texte accessible ».
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-021 · Champs sans label associé : dates de recherche, avatar du profil
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : a11y
- **Gravité** : 🟡
- **Où** : `resources/views/pages/vehicles/index.edge:40-63`, `resources/views/pages/profile.edge:106-113`
- **Constat** : sur `/vehicles`, `field.root({ name: 'startDate' })` produit `<label for="startDate">`, mais le champ reçoit `id: 'search_startDate'` : le label ne pointe vers rien (rendu vérifié, de même pour `endDate`). Sur `/profile`, « Avatar » est un `<p>`, pas un label, avec un astérisque « obligatoire » alors que le champ est facultatif (`user_profile.ts:16`) ; l'image a `alt="profile"` (en anglais).
- **Attendu** : le scan ne signale plus aucun « champ sans label » sur `/vehicles`, `/search` et `/profile` ; aucun astérisque sur un champ facultatif.
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-022 · Messages flash : disparaissent en 5 s, peu lisibles, débordent sur mobile
- **Statut** : ouvert
- **Porteur** : design
- **Domaine** : a11y
- **Gravité** : 🟡
- **Où** : `resources/js/app.js:14-21` (`dismiss()` après 5 000 ms), `resources/views/components/alert/root.edge` (`role="alert"` pour toutes les variantes, pas de bouton de fermeture), `resources/css/app.css:32-52` (`min-width: 380px`, couleurs `#fb2c36` et `#00a63e`)
- **Constat** :
  - Les messages de succès et d'erreur, par exemple « Mot de passe actuel incorrect » ou « Ce véhicule est déjà réservé sur cette période », disparaissent au bout de 5 secondes, sans moyen de les garder ni de les fermer (WCAG 2.2.1).
  - Contraste de 3,3:1 pour l'erreur et de 2,9:1 pour le succès (1.4.3).
  - Largeur minimale de 380 px, supérieure à un écran de 360 ou 375 px.
  - Hors des tokens.

  Il faut décider de la forme du composant (fermeture, position, couleurs) : porteur design.
- **Attendu** : les messages d'erreur restent affichés jusqu'à leur fermeture ; un bouton de fermeture accessible ; texte ≥ 4,5:1 ; aucun débordement horizontal à 360 px ; `role="status"` pour les succès.
- **Liens** : AUD-016
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-023 · Structure des pages : double `<main>`, titres qui sautent des niveaux, pas de lien d'évitement
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : a11y
- **Gravité** : 🟡
- **Où** : `components/layout.edge:20` (`<main>`) contient `pages/home.edge:125` et `pages/vehicles/show.edge:9`, qui ouvrent un second `<main>` ; titres rendus : `/` = h1 puis h3 ×8 ; `/login` = h1 (le logo, `login.edge:6`) puis h3 ; `bookings.edge:18` = h5 ; aucun lien « Aller au contenu » dans `header.edge` ni dans `layout.edge`
- **Constat** : les repères et la hiérarchie des titres, qui servent à naviguer au lecteur d'écran, sont faussés (WCAG 1.3.1, 2.4.1).
- **Attendu** : un seul `<main>` par page ; aucun saut de niveau de titre sur les pages scannées ; le h1 de `/login` décrit la page ; un lien d'évitement en premier élément focusable.
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-024 · SEO de base absent et titres de page incohérents
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : seo
- **Gravité** : 🟡
- **Où** : `components/layout.edge:3-17` (ni meta description, ni Open Graph, ni canonical) ; `public/` (ni `robots.txt` ni `sitemap.xml`) ; `pages/auth/login.edge:1` (« Login ») ; `pages/vehicles/listing.edge:1`, `pages/admin/users.edge:1` et `pages/admin/comments.edge:1` (pas de titre, tous « Locavan ») ; `components/admin/layout.edge:6` (coquille « Adminstration ») ; `pages/admin/index.edge:1` (« Home »)
- **Constat** : les 19 pages scannées n'ont aucune meta description. Partager une fiche annonce ne donne ni image ni description. Les titres de page sont dupliqués ou en anglais, et les pages privées n'ont pas de `noindex`.
- **Attendu** : meta description sur les pages publiques ; `og:title`, `og:image` et `og:description` sur la fiche annonce ; `robots.txt` excluant les pages privées ; un titre unique et en français par page, sans le signalement « <title> dupliqués » du scan.
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-025 · Ressources front chargées pour rien sur toutes les pages
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : perf
- **Gravité** : 🟡
- **Où** : `resources/js/app.js:2,6,71-79` (Splide et sa CSS) ; `components/layout.edge:7` (CSS lightbox3 depuis jsDelivr) ; `resources/css/app.css:1` (`@import` Google Fonts, 18 variantes de Poppins) ; `components/layout.edge:10-13` (4 feuilles Font Awesome) ; balises `<img>` des cartes et de la galerie
- **Constat** :
  - Splide est importé, avec sa CSS, dans le bundle de toutes les pages, alors qu'aucune vue ne contient d'élément `.splide`.
  - La CSS de lightbox3 vient d'un CDN tiers, alors que le paquet npm est installé. Elle est chargée partout mais ne sert que sur la fiche annonce.
  - Poppins est déclarée en 18 variantes, italiques comprises, pour 4 graisses utilisées (400 à 700, d'après le style guide), via un `@import` qui bloque le rendu.
  - Le scan relève des `<img>` sans `width`/`height` sur chaque page publique : 10 sur `/vehicles`, une trentaine sur la fiche. Le contenu saute au chargement (CLS).
- **Attendu** : Splide retiré du bundle et de `package.json` ; CSS lightbox3 importée depuis le paquet, uniquement sur la fiche ; Poppins limitée aux graisses utilisées, chargée par `<link>` ; `width`/`height` (ou `aspect-ratio`) sur les images de cartes et de galerie.
- **Liens** : AUD-012 · AUD-013
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-026 · Note moyenne : une requête par véhicule, arrondie à l'entier
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : perf
- **Gravité** : 🟡
- **Où** : `app/models/vehicle.ts:28-31` (`ratingAverage()`, `Math.round`), appelée en boucle dans `app/controllers/vehicles_controller.ts:102-104` et `home_controller.ts:31-37`
- **Constat** : 12 requêtes supplémentaires par page de résultats (N+1), invisibles en local (moins de 25 ms) mais proportionnelles au trafic. La moyenne est arrondie à l'entier : 4,4 s'affiche « 4 » et 4,5 s'affiche « 5 », à côté du nombre d'avis.
- **Attendu** : moyenne calculée dans la requête de liste (`withAggregate`, `avg`) ; affichage à une décimale (« 4,4 »).
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-027 · Écrans propriétaire : réservations reçues sans détail, annonces sans lien
- **Statut** : ouvert
- **Porteur** : design
- **Domaine** : ux
- **Gravité** : 🟡
- **Où** : `resources/views/pages/bookings/received.edge`, `app/policies/booking_policy.ts:7-9` (`view` réservé au locataire), `resources/views/pages/vehicles/listing.edge`
- **Constat** :
  - Parcours 3 : un propriétaire qui accepte ou refuse une demande ne peut ouvrir ni la réservation (la policy le refuse), ni l'annonce concernée. Il ne dispose que du prénom et du nom du locataire.
  - « Mes annonces » : le modèle n'est pas un lien vers l'annonce. Il n'y a pas d'action « Déposer une annonce », et l'état vide ne propose rien.
  - Les deux écrans sont des tableaux de 8 et 9 colonnes, qu'il faut faire défiler horizontalement sur mobile.
  - Les unités se contredisent : « € / jour » (`listing.edge:28`) contre « / nuit » sur la fiche. Le libellé « Status » est en anglais.
- **Attendu** : depuis « Réservations reçues », le propriétaire ouvre le détail d'une demande et l'annonce concernée ; depuis « Mes annonces », il ouvre chaque annonce et en dépose une nouvelle ; les deux écrans sont lisibles à 375 px sans défilement horizontal ; même unité de prix partout.
- **Liens** : AUD-008 · AUD-028
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-028 · Écrans pré-refonte : palette brute, microcopie mêlée d'anglais, états vides à concevoir
- **Statut** : ouvert
- **Porteur** : design
- **Domaine** : ui
- **Gravité** : 🟡
- **Où** : `pages/auth/*`, `pages/profile.edge`, `pages/bookings/*`, `pages/vehicles/{create,edit,listing}.edge`, `components/{form,field,input,select,textarea}` ; comptage des couleurs hors tokens : `profile` 22, `signup` 21, `create`/`edit` 18, `bookings/show` 16, `bookings` 12
- **Constat** : ces écrans, qui forment le cœur du parcours connecté, n'ont pas été refondus (le style guide les classe en dette). Ce qu'on y relève :
  - des libellés en anglais (« Status » dans `bookings/show.edge:7` et `listing.edge:17`) ;
  - une faute d'accord (« terminé » pour une réservation, `bookings/show.edge:28`) ;
  - le logo recopié à la main sur `/login` avec `amber-600` ;
  - un état vide « Vous n'avez pas encore effectué de réservations » affiché en rouge, sans lien vers la recherche (`bookings.edge:88`).
- **Attendu** : chaque écran listé est aligné sur le style guide (tokens uniquement, composants communs) et son statut passe à « refondu » dans le style guide ; la microcopie est entièrement en français ; chaque état vide propose une action.
- **Liens** : AUD-015 · AUD-016 · AUD-027 · AUD-009 (admin)
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-029 · Tests manquants sur des autorisations et des parcours critiques
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : tech
- **Gravité** : 🟡
- **Où** : `tests/functional/` (aucune occurrence de `/admin`, `/signup`, `/logout` ni `bookings/received`)
- **Constat** : 47 tests passent, mais rien ne vérifie qu'un non-admin est refusé sur `/admin/*`, que l'inscription fonctionne, qu'un tiers ne peut pas voir la réservation d'autrui (`BookingPolicy.view`), ni les règles d'annulation (`isCancellable`). Ces autorisations sont justes aujourd'hui (lecture du code), mais une régression passerait sans alerte.
- **Attendu** : un test fonctionnel par point listé, tous verts.
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-030 · Validation : mot de passe plafonné à 32 caractères, champs sans borne
- **Statut** : ouvert
- **Porteur** : code
- **Domaine** : sécu
- **Gravité** : 🟡
- **Où** : `app/validators/rules.ts:7` (`maxLength(32)`), `app/validators/user.ts:8-9` (`firstName`/`lastName` sans `trim` ni longueur), `app/validators/comment.ts:5-7` (`content` sans longueur, `rating` accepte 3,5)
- **Constat** : une phrase de passe ou un mot de passe généré de plus de 32 caractères est refusé, contre l'usage courant (NIST SP 800-63B : au moins 64 caractères). Le nom et le commentaire acceptent une chaîne vide après espaces ou d'une longueur arbitraire.
- **Attendu** : mot de passe accepté jusqu'à au moins 64 caractères ; noms `trim` + 1 à 100 caractères ; avis borné (5 000 caractères par exemple) et note entière de 1 à 5.
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)

### AUD-031 · Écrans refondus : couleurs hors tokens
- **Statut** : ouvert
- **Porteur** : design
- **Domaine** : ui
- **Gravité** : 🟡
- **Où** : `#666D7D` (surtitres et compteurs, environ 20 occurrences dans `home.edge`, `vehicles/index.edge` et `vehicles/show.edge`) ; `#FDF0C9`/`#F0DFA8` (`home.edge:255`, `show.edge:411`) ; `#2E7A3E`/`#A33232`/`#F2F7F2`/`#FBF2F2` (`show.edge:128-152`, pastilles oui/non) ; `bg-amber-500` (`home.edge:9,70`, dont le bouton de recherche) ; `text-neutral-*` (`home.edge:199-246`) ; `bg-yellow-100 text-yellow-800` (`show.edge:4`) ; `hover:bg-neutral-*`/`bg-gray-200` (`header.edge:80,166`)
- **Constat** : les trois écrans refondus et le header utilisent des valeurs absentes du style guide. Il y a un gris proche de `muted` (#666D7D, 5,2:1), une crème, et un vert et un rouge d'état. Le bouton de recherche de l'accueil est en `amber-500` et non en `accent`. Aucun problème de lisibilité, mais la norme n'est pas respectée : faut-il des tokens (état positif/négatif, crème) ou un alignement sur les tokens existants ?
- **Attendu** : `grep` des couleurs hex et des palettes Tailwind brutes vide sur `home`, `vehicles/index`, `vehicles/show`, `header` et `burger`, ou chaque valeur restante est un token documenté dans le style guide.
- **Journal** :
  - 2026-09-19 — ouvert (audit complet)
