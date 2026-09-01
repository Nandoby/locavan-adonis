import { BaseCommand } from '@adonisjs/core/ace'
import { mkdir, rename, readdir } from 'node:fs/promises'
import app from '@adonisjs/core/services/app'
import User from '#models/user'
import Picture from '#models/picture'
import Memory from '#models/memory'

import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class MigrateUploads extends BaseCommand {
  static commandName = 'migrate:uploads'

  static options: CommandOptions = { startApp: true }

  async run() {
    const src = app.publicPath('uploads')
    const dest = app.makePath('storage/uploads')
    await mkdir(dest, { recursive: true })

    // 1. Déplace les fichiers plats de public/uploads -> storage/uploads
    for (const entry of await readdir(src, { withFileTypes: true })) {
      if (entry.isFile() && entry.name !== '.gitkeep') {
        await rename(`${src}/${entry.name}`, `${dest}/${entry.name}`)
        this.logger.info(`moved ${entry.name}`)
      }
    }

    // 2. Normalise la base : "/uploads/x.png" -> "x.png" (les URLs http restent)
    for (const Model of [User, Picture, Memory] as const) {
      const col = Model === User ? 'avatarPath' : 'path'
      for (const row of await Model.all()) {
        const v = (row as any)[col]
        if (typeof v === 'string' && v.startsWith('/uploads/')) {
          ;(row as any)[col] = v.replace(/^\/uploads\//, '')
          await row.save()
          this.logger.info(`${Model.name}#${row.id}: ${v} -> ${(row as any)[col]}`)
        }
      }
    }
  }
}
