import type { HttpContext } from '@adonisjs/core/http'
import { urlFor } from '@adonisjs/core/services/url_builder'
import { UserProfileValidator } from '#validators/user_profile'
import User from '#models/user'
import { storeUpload, deleteUpload } from '#services/upload_service'

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

    user.merge({ firstName: firstname, lastName: lastname })

    if (password) {
      user.merge({ password })
    }

    if (avatar) {
      await deleteUpload(user.avatarPath)
      user.avatarPath = await storeUpload(avatar, 'avatars')
    }

    await user.save()
    session.flash('success', 'Profil mis à jour avec succès')
    return response.redirect().toRoute('profile')
  }
}
