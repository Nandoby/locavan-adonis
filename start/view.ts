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
