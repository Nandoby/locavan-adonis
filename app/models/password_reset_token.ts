import { createHash, randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { PasswordResetTokenSchema } from '#database/schema'
import User from '#models/user'

export default class PasswordResetToken extends PasswordResetTokenSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  /**
   * Seul le hash est stocké : une fuite de la base ne donne pas
   * de lien de réinitilisation utilisable
   */
  static hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex')
  }

  /**
   * Crée un token valable 1 heure en invalidant les précédents.
   * Retourne le token en clair, destiné uniquement au lien envoyé par mail.
   */
  static async generateFor(user: User) {
    const token = randomBytes(32).toString('base64url')

    await PasswordResetToken.query().where('userId', user.id).delete()
    await PasswordResetToken.create({
      userId: user.id,
      tokenHash: PasswordResetToken.hashToken(token),
      expiresAt: DateTime.now().plus({ hours: 1 }),
    })

    return token
  }

  static async findValid(token: string) {
    const record = await PasswordResetToken.query()
      .where('tokenHash', PasswordResetToken.hashToken(token))
      .preload('user')
      .first()

    if (!record || record.expiresAt < DateTime.now()) return null
    return record
  }
}
