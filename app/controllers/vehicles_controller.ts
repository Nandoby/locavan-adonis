import type { HttpContext } from '@adonisjs/core/http'
import Vehicle from '#models/vehicle'

export default class VehiclesController {
  async index({ view }: HttpContext) {
    const vehicles = await Vehicle.query().preload('pictures').preload('user').preload('type')

    return view.render('pages/vehicles/index', { vehicles })
  }

  async show({ params, view }: HttpContext) {
    const { id } = params
    const vehicle = await Vehicle.query()
      .preload('pictures')
      .preload('user')
      .preload('type')
      .preload('comments', (query) =>
        query
          .preload('user')
          .preload('memories', (memory) =>
            memory.preload('comment', (c) =>
              c.preload('user').preload('vehicle', (v) => v.preload('type'))
            )
          )
      )
      .where({ id: id })
      .firstOrFail()

    return view.render('pages/vehicles/show', { vehicle })
  }
}
