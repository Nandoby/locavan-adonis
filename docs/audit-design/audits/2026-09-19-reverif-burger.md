# Audit re-vérification (burger mobile) — 2026-09-19

- **Périmètre** : re-vérification. Éléments `à vérifier` (DSN-003) et `à qualifier` (DSN-002), plus l'import des éléments ouverts de l'ancien plan §9, puisque c'est le premier passage de l'audit.
- **Commit audité** : `e643853` (branche `feat/burger-redesign`)
- **Audit précédent** : aucun
- **Outillage** : typecheck ✅ · lint ❌ 4 erreurs, toutes dans `database/schema.ts` (fichier généré, déjà en échec sur main, pas une régression) · tests 47/47 · scan HTML de 13 pages, visiteur et connecté (compte de dev avec 3 demandes en attente) · contrastes
- **Indépendance** : la refonte vérifiée a été intégrée dans la même session par locavan-redesign. La vérification s'en tient donc aux critères « Attendu » écrits avant l'audit, prouvés par le rendu et le code.

## Synthèse

La refonte du burger remplit ses 5 critères : DSN-003 est clos. Un utilisateur
connecté a désormais accès à tout son compte sur mobile, et le badge des demandes
y est visible. Les liens `#` du burger (Accueil, Connexion, Déposer une annonce)
ont disparu du scan. Les deux limites laissées ouvertes par le design deviennent
des constats mineurs (AUD-001 piège du focus, AUD-002 défilement bloqué au
redimensionnement). Le signalement `lang="en-us"` est confirmé, sur le layout
public comme sur celui de l'admin : c'est le problème le plus important de ce
passage, parce qu'il concerne toutes les pages. L'import de l'ancien plan ajoute
11 éléments, tous 🟡.

## ✅ Ce qui va

### UX / accessibilité (burger)
- Bouton burger : vrai `<button>` avec `aria-controls="mobile-menu"`, `:aria-expanded`, et un libellé qui inclut le nombre de demandes. Rendu connecté : « Ouvrir le menu (3 demandes en attente) » (`header.edge`, bouton `x-ref="burgerToggle"`).
- Lien courant marqué par `aria-current="page"` et un repère visuel : sur `/`, c'est « Accueil » ; sur `/vehicles`, « Nos véhicules ».
- Badge accessible sans doublon : visuel en `aria-hidden` sur le bouton ; sur « Réservations reçues », le rendu est `3<span class="sr-only">&nbsp;en attente</span>`.
- Menu fermé retiré du parcours clavier grâce à `x-show` (`display: none`), alors que l'ancienne version le décalait seulement hors de l'écran.
- La déconnexion est un vrai `POST /logout` avec jeton CSRF, et non un lien.

### UI
- Aucune couleur hors tokens dans `burger.edge` ni dans le bouton. Le seul `text-accent` est le « van » du logo, exempté du contraste minimal en tant que logotype (WCAG 1.4.3).
- Les nouvelles conventions (anneau de focus `accent-dark` à 6:1, états `bg-line/40` et `bg-line/70`) sont documentées dans le style guide, qui pourra les réutiliser.

### Produit
- Aucune promesse fabriquée dans le burger. La mention « Assurance et assistance 24/7 » de la maquette a été retirée avant l'intégration.
- Les favoris sont présentés honnêtement comme « à venir » (`show.edge:44-50`) plutôt que comme un faux bouton.
- `components/email/layout.edge` déclare déjà `lang="fr"`.

### Technique
- 47 tests verts, typecheck propre.
- Le scan connecté fonctionne : les 5 pages protégées répondent 200, en moins de 30 ms en local.

## ❌ Ce qui ne va pas

### Accessibilité
- 🟠 **DSN-002** · `lang="en-us"` sur `components/layout.edge:2` et `components/admin/layout.edge:2` : toutes les pages sont annoncées en anglais (WCAG 3.1.1, niveau A). → Porteur code
- 🟡 **AUD-001** · Tiroir ouvert : Tab sort du tiroir vers la page masquée, malgré `aria-modal="true"`. → Porteur code

### UX
- 🟡 **AUD-002** · Menu ouvert puis fenêtre élargie au-delà de 640 px : le défilement reste bloqué. → Porteur code

### Importés de l'ancien plan §9
- 🟡 **AUD-003** · Pages statiques absentes, 7 liens `#` dans le footer de l'accueil et 1 lien sans `href`. « Assurance propriétaire » promet une assurance inexistante. → Porteur design
- 🟡 **AUD-009** · Back-office au style d'avant la refonte. → Porteur design
- 🟡 **AUD-004** routes · **AUD-005** favoris · **AUD-006** vérification d'e-mail · **AUD-007** modération admin · **AUD-008** tableau de bord propriétaire · **AUD-010** contrainte anti-double réservation · **AUD-011** montants · **AUD-012** images · **AUD-013** CSP. → Porteur code

Non importés, car ce sont des évolutions produit et non des défauts (ils restent dans l'ancien plan §9.5) : paiement, messagerie, vérification d'identité et avis croisés.

## Re-vérifications

| ID | Attendu | Résultat | Nouveau statut |
|---|---|---|---|
| DSN-003 (1) | Compte complet pour un connecté, Inscription et Connexion pour un visiteur | Rendu connecté : Mes réservations `/bookings`, Mes annonces `/listing`, Réservations reçues `/bookings/received`, Modifier profil `/profile`, Déconnexion `POST /logout`. Rendu visiteur : `/signup`, `/login`. « Admin » vérifié dans le code uniquement (`@if(auth.user.isAdmin)` → `admin.index`) : aucun admin en base de dev | ✅ |
| DSN-003 (2) | Pas de `#` hors Devenir loueur et Aide | Liens du tiroir : `/`, `/vehicles`, `#` (Aide ; Devenir loueur pour un visiteur), puis les routes réelles | ✅ |
| DSN-003 (3) | `<button>` avec aria-label, aria-controls, aria-expanded, compteur dans le libellé et le badge | Tout présent dans le rendu, sur les deux variantes de header (transparent : `bg-white/15 border-white/35`) | ✅ |
| DSN-003 (4) | Menu fermé non focusable ; Échap, ✕ et voile ferment ; focus rendu ; défilement bloqué | Code : `x-show` sur le tiroir et le voile, `@keydown.escape.window="close()"`, `@click="close()"` sur ✕ et le voile, `close()` rend le focus à `burgerToggle`, `open()` ajoute `overflow-hidden`. Comportement testé à la main par Nando dans le navigateur | ✅ |
| DSN-003 (5) | Pas de couleur hors tokens, pas d'accent en texte sur fond clair | `grep` sans résultat hors logotype exempté | ✅ |
| DSN-002 | (à qualifier) | Confirmé, étendu au layout admin | ouvert, code, 🟠 |

**DSN-003 → clos.**

## Transmis au design

- **Footer et pages de contenu** : AUD-003. Brief à faire pour les pages statiques et la formulation du footer. À traiter avec DSN-001 côté code.
- **Back-office** : AUD-009.

## Transmis au dev (code)

1. 🟠 DSN-002 : `lang="fr"` sur les 2 layouts
2. 🟡 AUD-001 : piège du focus dans le tiroir
3. 🟡 AUD-002 : défilement bloqué au redimensionnement
4. 🟡 DSN-001 : pages Devenir loueur et Aide
5. 🟡 AUD-006 : vérification d'e-mail · AUD-013 : CSP · AUD-005 : favoris · AUD-007 : modération · AUD-008 : tableau de bord propriétaire · AUD-004 : routes · AUD-010 / AUD-011 / AUD-012 : avant déploiement

## Limites de cet audit

- Re-vérification ciblée : les autres signaux du scan n'ont **pas** été qualifiés et le seront lors d'un audit complet. Il s'agit de l'absence de meta description sur toutes les pages, du `<title>` « Locavan » identique sur `/` et `/listing`, des champs `startDate`/`endDate` de `/vehicles` et `avatar` de `/profile` sans label détecté, et des images sans `width`/`height`.
- Pas de navigateur exécutant le JS dans cet environnement : le comportement du critère 4 repose sur la lecture du code et sur le test manuel de Nando.
- Entrée « Admin » non rendue (aucun compte admin en base de dev).
- Données de seed (picsum, faker) : ni les poids d'images ni les temps de réponse ne sont représentatifs.
