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

  async users({ view }: HttpContext) {
    const users = await User.query()
    return view.render('pages/admin/users', { users })
  }

  async vehicles({ view }: HttpContext) {
    const vehicles = await Vehicle.query().preload('user').preload('comments')
    return view.render('pages/admin/vehicles', { vehicles })
  }

  async comments({ view }: HttpContext) {
    const comments = await Comment.query().preload('user')
    return view.render('pages/admin/comments', { comments })
  }
}
