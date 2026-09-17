import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import User from '#models/user'
import PasswordResetToken from '#models/password_reset_token'
import PasswordResetNotification from '#mails/password_reset_notification'
import { forgotPasswordValidator, resetPasswordValidator } from '#validators/password_reset'

export default class PasswordResetController {
  async create({ view }: HttpContext) {
    return view.render('pages/auth/forgot_password')
  }

  /**
   * Même réponse que le compte existe ou non, pour ne pas révéler
   * quelles adresses sont inscrites.
   */
  async store({ request, response, session }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)
    const user = await User.findBy('email', email)

    if (user) {
      const token = await PasswordResetToken.generateFor(user)
      await mail.sendLater(new PasswordResetNotification(user, token))
    }

    session.flash('success', "Un e-mail de réinitialisation vient d'être envoyé.")
    return response.redirect().back()
  }

  async edit({ params, view, response, session }: HttpContext) {
    const record = await PasswordResetToken.findValid(params.token)

    if (!record) {
      session.flash('error', 'Ce lien de réinitialisation est invalide ou a expiré')
      return response.redirect().toRoute('password_reset.create')
    }

    return view.render('pages/auth/reset_password', { token: params.token })
  }

  async update({ params, request, response, session }: HttpContext) {
    const { password } = await request.validateUsing(resetPasswordValidator)
    const record = await PasswordResetToken.findValid(params.token)

    if (!record) {
      session.flash('error', 'Ce lien de réinitialisation est invalide ou a expiré.')
      return response.redirect().toRoute('password_reset.create')
    }

    await db.transaction(async (trx) => {
      record.user.useTransaction(trx)
      record.user.password = password
      await record.user.save()
      await PasswordResetToken.query({ client: trx }).where('userId', record.userId).delete()
    })

    session.flash('success', 'Mot de passe modifié. Vous pouvez maintenant vous connecter.')
    return response.redirect().toRoute('session.create')
  }
}
