import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { storeUpload } from '#services/upload_service'

/**
 * NewAccountController handles user registration.
 * It provides methods for displaying the signup page and creating
 * new user accounts.
 */
export default class NewAccountController {
  /**
   * Display the signup page
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/signup')
  }

  /**
   * Create a new user account and authenticate the user
   */
  async store({ request, response, auth }: HttpContext) {
    const { avatar, ...data } = await request.validateUsing(signupValidator)

    const user = await User.create(data)

    if (avatar) {
      user.avatarPath = await storeUpload(avatar, 'avatars')
      await user.save()
    }

    await auth.use('web').login(user)
    response.redirect().toRoute('home.index')
  }
}
