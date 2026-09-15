import edge from 'edge.js'
import drive from '@adonisjs/drive/services/main'

/**
 * Résout une valeur stockée en base vers une URL affichable.
 * - null / vide -> null (la vue peut afficher un avatar par défaut)
 * - URL absolue -> renvoyée telle quelle (données de seed picsum.photos)
 * - clé Drive   -> URL servie par le disque courant
 */
edge.global('driveUrl', async (key?: string | null): Promise<string | null> => {
  if (!key) return null
  if (key.startsWith('http://') || key.startsWith('https://')) return key
  return drive.use().getUrl(key)
})

/**
 * Construit une URL de filtre : fusionne les filtres courants avec les
 * overrides, et retire les valeurs vides pour garder une query string propre.
 */
edge.global('queryUrl', (base: string, params: Record<string, unknown>): string => {
  const usp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue
    usp.set(key, String(value))
  }
  const qs = usp.toString()
  return qs ? `${base}?${qs}` : base
})
