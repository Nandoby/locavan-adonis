# Audit re-vérification (AUD-014 et AUD-032, accueil) — 2026-09-19

- **Périmètre** : re-vérification d'AUD-014 (rouvert au passage précédent) et d'AUD-032.
- **Commit audité** : `f95d7a8` (branche `fix/microcopie-promesses`)
- **Audit précédent** : `audits/2026-09-19-reverif-aud014.md` (commit `b2c7722`)
- **Outillage** : typecheck ✅ · lint ❌ 4 erreurs connues de `database/schema.ts`, rien de nouveau · tests 47/47 · scan de `/` (serveur de dev lancé)
- **Indépendance** : la retouche a été préparée dans la même session par locavan-redesign. La vérification s'en tient donc au critère « Attendu », fixé avant la correction, et s'appuie sur le rendu et le code.

## Synthèse

Les deux derniers libellés inexacts de l'accueil sont corrigés, et les pastilles
inertes du hero sont retirées. J'ai relu tous les libellés de `home.edge` et
`show.edge` : chacun correspond maintenant à un comportement du code. **AUD-014
et AUD-032 sont clos.** Pour l'accueil, il ne reste que des points déjà suivis :
les liens du footer (AUD-003), le focus des champs (AUD-015) et les couleurs hors
tokens (AUD-031).

## ✅ Ce qui va

- « Nouveautés » et son sous-titre « Sélection des dernières annonces publiées » décrivent exactement la requête (`home_controller.ts`, `orderBy('createdAt', 'desc')`, `limit(3)`).
- « Filtrez par ville, dates et nombre de voyageurs » correspond aux filtres réels : `city`, `startDate`/`endDate`, `minSeats` (champ libellé « Voyageurs »).
- Aucune pastille ni aucun raccourci ne simule un filtre absent. Le hero se termine proprement sur la barre de recherche.
- Les acquis du passage précédent tiennent toujours : nombre d'annonces et prix minimum calculés, « Demander à réserver », fonctionnalités à venir grisées avec leur `title`.

## ❌ Ce qui ne va pas

Rien de nouveau.

## Re-vérifications

| ID | Attendu | Résultat | Nouveau statut |
|---|---|---|---|
| AUD-014 | Aucun libellé de l'accueil ni de la fiche ne décrit un service, une garantie ou un comportement absent du code ; prix calculé ; demande à accepter mentionnée près du bouton | Libellés des deux templates relus un par un. Rendu de `/` : aucune occurrence de « Les mieux notés », « couchages, puis », « Permis B » ; « Nouveautés » et « nombre de voyageurs » présents. Le footer (« Assurance propriétaire », « Prix et frais ») est laissé à AUD-003 | **clos** |
| AUD-032 | Chaque pastille mène à une recherche filtrée, ou est retirée | Bloc supprimé du template et du rendu | **clos** |

## Transmis au design

- **Accueil** : AUD-003 (footer), AUD-015 (focus de la barre de recherche), AUD-031 (couleurs hors tokens)

## Transmis au dev (code)

Pas de changement. La liste de `audits/2026-09-19-complet.md` reste valable, en commençant par DSN-002 et AUD-018.

## Limites de cet audit

- Pas de navigateur exécutant le JavaScript : je n'ai pas vu le rendu visuel du hero après le retrait des pastilles (espacement sous la barre de recherche).
