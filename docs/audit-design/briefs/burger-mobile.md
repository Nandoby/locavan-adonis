# Brief Claude Design — Menu burger mobile — 2026-09-18

## Contexte

Locavan : plateforme de location de vans et camping-cars entre particuliers (France,
interface en français). Élément à concevoir : **le menu de navigation mobile**
(écrans < 640 px) et son **bouton d'ouverture dans la barre du header**. Il est
utilisé par tout le monde : visiteur, locataire connecté, propriétaire (qui reçoit
des demandes de réservation), admin.

Aujourd'hui, sur mobile, un utilisateur connecté **n'a aucun accès à son compte** :
le menu utilisateur du header est masqué sous 640 px et le menu mobile ne contient
que 3 liens inopérants. Ce menu doit devenir la navigation complète du site sur
mobile.

## Identité à conserver

Le site a été refondu récemment (Accueil, Résultats de recherche, Détail
d'annonce) : ce menu doit clairement en faire partie, pas inventer un autre style.

- **Police** : Poppins — 400, 500, 600 (la plus utilisée), 700.
- **Couleurs** :
  - ink `#1F2434` — texte principal, titres, fonds sombres
  - accent `#E8930C` — **fond** des boutons d'action, avec texte ink dessus ; étoiles ; soulignement du lien actif
  - accent-dark `#8A5403` — petits textes accentués sur fond clair
  - muted `#5A6070` — texte secondaire
  - muted-dark `#3B4152` — liens de navigation sur fond clair
  - line `#E4E3DE` — bordures et séparateurs
  - page `#fbfbf9` — fond de page ; blanc `#ffffff` pour les surfaces (header, cartes)
- **Logo** : texte « LOCAVAN » en capitales, `text-2xl`, lettres espacées, filet
  accent de 2 px au-dessus et au-dessous, « VAN » en accent.
- **Formes** : boutons `rounded-lg` (8 px) `px-5 py-2.5` semi-bold ; pastilles et
  badges `rounded-full` ; cartes `rounded-2xl` ; ombres discrètes.
- **Navigation desktop existante** (référence de ton) : liens `15px` muted-dark
  lettres légèrement espacées, lien actif en semi-bold ink avec un soulignement
  accent de 2 px. Bouton « Inscription » : fond accent, texte ink, semi-bold.
  Menu utilisateur : avatar rond 40 px + prénom nom, liste blanche bordée `line`
  avec icônes Font Awesome.
- **Badge** des demandes en attente : pastille accent, texte ink `text-xs`
  semi-bold, ronde, min 20 px, posée en haut à droite de l'avatar.
- **Icônes** : Font Awesome (solid).
- Deux variantes de header existent : **solid** (fond blanc, bordure basse line —
  toutes les pages) et **transparent** (texte blanc posé sur la grande photo de
  l'accueil). Le bouton d'ouverture doit fonctionner sur les deux.

## Ce qui marche aujourd'hui (à préserver)

- Le header unique et épuré des écrans refondus, avec son lien actif souligné accent.
- Le badge du nombre de demandes de réservation en attente (propriétaires) — très
  utile, mais aujourd'hui invisible sur mobile.
- Le bouton « Inscription » accent toujours visible dans la barre mobile pour un
  visiteur.

## Problèmes à résoudre

- Aucun accès au compte sur mobile quand on est connecté (profil, réservations,
  annonces, demandes reçues, admin, déconnexion).
- Menu actuel hors charte : photo sombre en plein écran, texte orange centré,
  liens inopérants, pas de « Nos véhicules ».
- Le badge des demandes en attente n'est visible nulle part sur mobile.
- Accessibilité : l'ouverture/fermeture ne sont pas de vrais boutons, rien
  n'indique l'état ouvert/fermé, le menu fermé reste atteignable au clavier, pas
  de fermeture par Échap, la page défile derrière le menu ouvert.

## Améliorations UX/UI proposées

Pistes à évaluer, pas à appliquer aveuglément :
- **Tiroir depuis la droite** (~85–90 % de la largeur) sur fond clair, avec un
  voile sombre sur la page derrière (toucher le voile ferme) — la page reste
  visible, on comprend qu'on n'a pas changé d'écran. Montrer si possible une
  variante plein écran pour comparer.
- **Sections hiérarchisées** plutôt qu'une liste plate : 1) en-tête du tiroir
  (logo + fermer), 2) identité si connecté, 3) navigation, 4) action principale,
  5) espace compte, 6) déconnexion isolée en bas — l'œil trouve vite ce qu'il cherche.
- **Lien de la page courante marqué** (même langage que le desktop : semi-bold ink
  + repère accent) — on sait où on est.
- **Badge sur l'icône burger** quand des demandes sont en attente, repris sur
  l'entrée « Réservations reçues » — sans quoi un propriétaire mobile ne voit
  jamais qu'on l'attend.
- **Cibles tactiles ≥ 44 px**, icône à gauche de chaque entrée du compte (mêmes
  icônes que le menu desktop).
- Déconnexion visuellement distincte (bas du tiroir, style secondaire), pour ne pas
  la toucher par erreur.

## Contenu réel disponible

**Barre du header mobile** (inchangée hors bouton burger) : logo à gauche ; à
droite, pour un visiteur, le bouton « Inscription » puis le bouton burger ; pour un
connecté, le bouton burger seul (à enrichir du badge).

**Tiroir — visiteur** :
- Navigation : « Accueil », « Nos véhicules », « Devenir loueur », « Aide »
- Actions : « Inscription » (principal), « Connexion » (secondaire)

**Tiroir — connecté** :
- Identité : avatar (photo ou avatar par défaut), prénom + nom
- Navigation : « Accueil », « Nos véhicules », « Aide »
- Action principale : « Déposer une annonce »
- Compte : « Mes réservations » (icône caravane), « Mes annonces » (livre ouvert),
  « Réservations reçues » (boîte de réception, + badge du nombre en attente si > 0),
  « Modifier profil » (utilisateur), « Admin » (clé — seulement si administrateur)
- « Déconnexion » (flèche sortante)

« Devenir loueur » et « Aide » auront leur page plus tard : les dessiner à leur
place définitive.

**N'existe pas** (ne pas l'afficher) : recherche dans le menu, favoris, messagerie,
notifications autres que le badge des demandes, sélecteur de langue, e-mail de
l'utilisateur mis en avant, statistiques.

## États à couvrir

- Mobile 375 px : menu **fermé** (barre header, variantes solid et transparent,
  avec et sans badge) et **ouvert**
- Tiroir ouvert : **visiteur** / **connecté** / **connecté admin avec 3 demandes en attente**
- Un lien actif (ex. sur « Nos véhicules »)
- États des entrées : normal, appuyé, focus clavier visible

## Contraintes

- Accessibilité WCAG AA : tout texte ≥ 4,5:1 sur son fond. ⚠️ L'accent `#E8930C`
  ne fait que 2,4:1 sur blanc : **jamais en couleur de texte sur fond clair, jamais
  avec du texte blanc dessus**. Texte accentué sur clair → accent-dark `#8A5403` ;
  bouton accent → texte ink.
- Focus clavier visible sur chaque élément interactif.
- Intégration en Edge + Tailwind 4 + Alpine.js : structures simples, une seule
  animation d'ouverture (glissement + fondu du voile), pas de librairie JS en plus.
- Microcopie en français, libellés identiques au menu desktop.

## Livrable attendu

- Un fichier par état : `burger-ferme`, `burger-visiteur`, `burger-connecte`,
  `burger-admin-badge` (+ `burger-plein-ecran` si la variante est explorée)
- Annotations courtes sur les choix UX non évidents
- Le bouton burger avec badge, isolé, avec ses états (normal, focus, ouvert)
