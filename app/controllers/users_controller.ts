import type { HttpContext } from '@adonisjs/core/http'
import { urlFor } from '@adonisjs/core/services/url_builder'
import { UserProfileValidator } from '#validators/user_profile'
import User from '#models/user'
import app from '@adonisjs/core/services/app'

export default class UsersController {
  async edit({ view, request }: HttpContext) {
    return view.render('pages/profile', {
      backUrl: request.header('referer') ?? urlFor('home.index'),
    })
  }

  async update({ request, response, auth, session }: HttpContext) {
    const { firstname, lastname, password, avatar } =
      await request.validateUsing(UserProfileValidator)

    const user = await User.findOrFail(auth.user!.id)

    if (!password) {
      user.merge({ firstName: firstname, lastName: lastname })
    } else {
      user.merge({ password: password })
    }

    if (avatar) {
      const name = `${Date.now()}.${avatar.extname}`
      await avatar.move(app.publicPath('uploads'), {
        name,
      })
      user.avatarPath = '/uploads/' + name
    }

    await user.save()
    session.flash('success', 'Profil mis à jour avec succès')
    return response.redirect().toRoute('profile')
  }
}
