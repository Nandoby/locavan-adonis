import type { HttpContext } from '@adonisjs/core/http'
import Vehicle from '#models/vehicle'

export default class HomeController {
  async index({ view }: HttpContext) {
    const vehicles = await Vehicle.query()
      .where('status', 'published')
      .preload('pictures')
      .preload('type')
      .preload('user')
      .limit(3)
      .orderBy('createdAt', 'desc')
      .exec()

    return view.render('pages/home', { vehicles })
  }
}
