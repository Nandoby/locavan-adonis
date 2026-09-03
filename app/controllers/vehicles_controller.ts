import type { HttpContext } from '@adonisjs/core/http'
import Vehicle from '#models/vehicle'
import Type from '#models/type'
import { vehicleValidator } from '#validators/vehicle'

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
      .preload('comments', (query) => query.preload('user').preload('memories'))
      .where({ id: id })
      .firstOrFail()

    const notAvailableDays = await vehicle.getNotAvailableDays()
    const notAvailableDaysJson = notAvailableDays
      .map((date) => date.toFormat('dd/MM/yyyy'))
      .join(',')

    return view.render('pages/vehicles/show', { vehicle, notAvailableDaysJson })
  }

  async search({ view, request }: HttpContext) {
    const inputSearch = request.input('city', '').trim()

    const vehicles = await Vehicle.query()
      .where('city', 'LIKE', `%${inputSearch}%`)
      .preload('pictures')
      .preload('type')
      .preload('user')

    return view.render('pages/vehicles/index', { vehicles, inputSearch })
  }

  async create({ view }: HttpContext) {
    const types = await Type.all()
    return view.render('pages/vehicles/create', { types })
  }

  async store({ request, response, auth }: HttpContext) {
    console.log(request.all())
    const data = await request.validateUsing(vehicleValidator)
    console.log(data)
  }
}
