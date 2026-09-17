import { BaseMail } from '@adonisjs/mail'
import type User from '#models/user'

export default class PasswordResetNotification extends BaseMail {
  subject = 'Réinitialisation de votre mot de passe'

  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  prepare() {
    this.message
      .to(this.user.email)
      .htmlView('emails/password_reset', { user: this.user, token: this.token })
  }
}
