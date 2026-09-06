import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Vehicle from '#models/vehicle'
import Comment from '#models/comment'

export default class AdminController {
  async index({ view }: HttpContext) {
    const [users, vehicles, comments] = await Promise.all([
      User.query().count('* as total'),
      Vehicle.query().count('* as total'),
      Comment.query().count('* as total'),
    ])

    return view.render('pages/admin/index', {
      usersCount: users[0].$extras.total,
      vehiclesCount: vehicles[0].$extras.total,
      commentsCount: comments[0].$extras.total,
    })
  }

  async users({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const users = await User.query().paginate(page, 5)
    users.baseUrl(request.url())
    return view.render('pages/admin/users', { users })
  }

  async vehicles({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = 5
    const vehicles = await Vehicle.query()
      .preload('user')
      .preload('comments')
      .paginate(page, perPage)

    vehicles.baseUrl(request.url())

    return view.render('pages/admin/vehicles', { vehicles })
  }

  async comments({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const comments = await Comment.query().preload('user').paginate(page, 10)
    comments.baseUrl(request.url())
    return view.render('pages/admin/comments', { comments })
  }
}
