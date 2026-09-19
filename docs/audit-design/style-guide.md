# Style guide Locavan

_Synchronisé avec le code le 2026-09-18 (commit `3782e8c`). Décrit le style tel
qu'il est dans le code ; source de vérité des valeurs : `resources/css/app.css`._

## Couleurs

Tokens `@theme` (`resources/css/app.css`), utilisables en classes Tailwind
(`text-ink`, `bg-accent`, `border-line`…).

| Token | Hex | Usage observé | Contraste utile |
|---|---|---|---|
| `ink` | `#1F2434` | texte principal, titres, fonds sombres (`bg-ink`, `bg-ink/85`) | 15,4:1 sur blanc |
| `accent` | `#E8930C` | fonds de CTA (texte `ink` dessus), étoiles, « van » du logo, soulignement des liens | ⚠️ 2,4:1 sur blanc, 6,3:1 avec texte ink dessus |
| `accent-dark` | `#8A5403` | petits libellés accentués sur fond clair (« Étape 1 ») | 6,3:1 sur blanc |
| `muted` | `#5A6070` | texte secondaire | 6,3:1 sur blanc |
| `muted-dark` | `#3B4152` | liens de navigation sur fond clair | 9,8:1 sur page |
| `line` | `#E4E3DE` | bordures, séparateurs | décoratif uniquement |
| `page` | `#fbfbf9` | fond de page (`body`) | — |

Ratios : `node .claude/skills/locavan-audit/scripts/contrast.mjs`.

**Règles d'usage**
- `accent` = **fond** d'action avec texte `ink` (`bg-accent text-ink`), jamais texte
  sur fond clair ni fond avec texte blanc. Sur fond `ink`, `text-accent` est lisible (6,3:1).
- Texte accentué sur fond clair → `accent-dark`.
- Survol d'un CTA accent : `hover:bg-accent/80`.
- Fonds d'état neutres **sans nouvelle couleur** : `bg-line/40` (élément actif,
  bouton secondaire) et `active:bg-line/70` (appuyé). Sur fond sombre/photo :
  `bg-white/15 border-white/35`, appuyé `active:bg-white/25`.

## Focus clavier

Anneau commun : `focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-accent-dark` (6:1 sur clair). Pour un élément de liste
pleine largeur dans un conteneur qui défile : `focus-visible:-outline-offset-2`
(anneau à l'intérieur, pour ne pas être rogné).

**Dette** : les écrans pré-refonte utilisent encore la palette Tailwind brute
(`amber-500/600/700`, `gray-50…900`, `neutral-*`) : auth, profil, réservations,
`listing`, admin, `pagination` (thèmes indigo/yellow/blue/pink), `burger`, et les
classes `.input-field`/`.select`/`.textarea`/`.label` de `app.css`.

## Typographie

Poppins partout (`* { font-family: 'Poppins' }`, toutes graisses importées depuis
Google Fonts). Graisses réellement utilisées : 400, 500 (`font-medium`), 600
(`font-semibold`, la plus fréquente), 700 (`font-bold`).

| Rôle | Classes |
|---|---|
| Logo | `text-2xl uppercase tracking-wide border-y-2 border-accent py-1` + « van » en `text-accent` |
| Titre de page | `text-2xl`/`text-3xl font-bold text-ink` |
| Surtitre / libellé | `text-xs font-bold uppercase tracking-wide` (`text-accent-dark` sur clair) |
| Navigation | `text-[15px] tracking-wide` |
| Corps | `text-sm` (dominant), `text-base` ponctuel |
| Secondaire | `text-sm text-muted` |

## Espacements, rayons, ombres

- Conteneur : `container mx-auto px-4`.
- Rayons : `rounded-full` (pastilles, avatars, badges), `rounded-2xl` (cartes,
  galerie), `rounded-xl` (blocs), `rounded-lg` (boutons, items de menu).
- Ombres discrètes : `shadow-sm`/`shadow`, `shadow-lg` pour les éléments flottants.
- Gaps récurrents : `gap-2`, `gap-3`, `gap-4`, `gap-6`.
- Boutons : `px-5 py-2.5 rounded-lg font-semibold` ; pastilles : `px-3.5 py-2 rounded-full border border-line`.

## Composants

| Composant | Rôle | Style |
|---|---|---|
| `header.edge` | header public unique, variantes `solid` (fond blanc, `border-b border-line`) et `transparent` (sur hero, texte blanc) ; lien actif via `.linkanimate.active` (soulignement accent) ; menu utilisateur déroulant (Alpine `dropdown`) avec badge `pendingBookingsCount` | refondu |
| `burger.edge` | navigation complète sous `sm` : tiroir depuis la droite (`w-[87%] max-w-sm`, `bg-page`) + voile `bg-ink/55`, en-tête blanc (logo + ✕), identité si connecté, sections « Navigation » / « Mon compte » (titres `text-[11px] uppercase tracking-[0.14em] text-muted`), CTA accent pleine largeur `h-12`, déconnexion isolée en bas. Props `isHomeActive`/`isVehiclesActive` passées par le header. Alpine `burger` : `open()`/`close()` (défilement bloqué, focus géré, Échap) | refondu (2026-09-19) |
| Bouton burger (dans `header.edge`) | `<button>` 44×44 px, 3 barres `w-5 h-0.5`, badge accent bordé de blanc, `aria-label` incluant le nombre de demandes | refondu (2026-09-19) |
| `button.edge`, `link.edge`, `avatar.edge` | primitives sans style propre (classes passées en props ; `link` ajoute `current` si actif) | neutres |
| `rating.edge` | 5 étoiles Font Awesome `text-accent` | refondu |
| `pagination.edge` | pagination, prop `accent` (utiliser `ink`) | thèmes hérités à nettoyer |
| `form`, `field/*`, `input`, `select`, `textarea`, `checkbox`, `radio` | formulaires | pré-refonte (`gray`/`amber`) |
| `layout.edge` | squelette HTML, `headerVariant` | `lang="en-us"` à corriger (hors design) |

Icônes : Font Awesome (`fa-solid`, `fa-regular`, `fa-light`), SVG inline ponctuels.

## Motifs de page

Header commun ; **élément de liste de navigation** (tiroir) : `h-12 px-3 rounded-lg
text-base text-muted-dark`, actif = `font-semibold text-ink bg-line/40` + filet
vertical accent `w-0.75 h-5` + `aria-current="page"` (équivalent vertical du
soulignement desktop) ; entrées du compte avec icône FA `w-5 text-muted` à gauche ;
hero photo + header transparent (accueil) ; grille de cartes
véhicules `rounded-2xl` ; pastilles de filtres ; fil d'Ariane ; galerie mosaïque ;
sidebar de réservation ; bandeau de réassurance ; footer `bg-ink` avec libellés
`text-accent` en surtitre.

## Écrans

| Écran | Template | Statut | Brief |
|---|---|---|---|
| Accueil | `pages/home.edge` | refondu (PR #8) | projet Claude Design « Analyse UI/UX Locavan » |
| Résultats véhicules | `pages/vehicles/index.edge` | refondu (PR #9) | idem |
| Détail annonce | `pages/vehicles/show.edge` | refondu (PR #10) | idem |
| Menu burger mobile | `components/burger.edge` | refondu (commit `957fd5d`) | `briefs/burger-mobile.md` |
| Auth, profil, réservations, listing, création/édition, erreurs | `pages/…` | pré-refonte | — |
| Admin | `components/admin/layout.edge`, `partials/admin/*` | pré-refonte, reporté | — |

## Journal des décisions

- 2026-09-18 — style guide créé à partir du code (commit `3782e8c`).
- 2026-09-19 — burger mobile : tiroir depuis la droite retenu contre le plein écran
  (la page reste visible, fermeture par voile/Échap) ; états actif/appuyé en
  `bg-line/40`/`bg-line/70` plutôt que les crèmes `#F5F3EE`/`#EFEDE7` de la maquette
  (pas de couleur hors tokens) ; anneau de focus `accent-dark` généralisé ; pas de
  badge sur l'avatar (déjà sur le bouton et l'entrée) — DSN-003.
- 2026-09-19 — microcopie : aucun libellé ne promet un service, une garantie ou un
  comportement absent du code (assurance, assistance, paiement, vérification
  d'identité, confirmation immédiate). Les chiffres affichés (nombre d'annonces,
  prix « à partir de ») sont calculés depuis la base, jamais écrits en dur. Une
  réservation est une *demande* : bouton « Demander à réserver » — AUD-014.
