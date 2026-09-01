import { randomUUID } from 'node:crypto'
import drive from '@adonisjs/drive/services/main'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

/**
 * Déplace un fichier validé vers le disque par défaut.
 * Renvoie la clé à stocker en base, ex: "avatars/xxxx.png".
 */
export async function storeUpload(file: MultipartFile, folder: string): Promise<string> {
  const key = `${folder}/${randomUUID()}.${file.extname}`
  await file.moveToDisk(key)
  return key
}

/** Supprime un fichier par sa clé. No-op si null/absent. */
export async function deleteUpload(key: string | null | undefined): Promise<void> {
  if (!key) return
  await drive.use().delete(key)
}
