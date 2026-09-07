import type { HttpContext } from '@adonisjs/core/http'
import Vehicle from '#models/vehicle'
import Type from '#models/type'
import { vehicleValidator } from '#validators/vehicle'
import { storeUpload } from '#services/upload_service'
import Picture from '#models/picture'

export default class VehiclesController {
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const vehicles = await Vehicle.query()
      .preload('pictures')
      .preload('user')
      .preload('type')
      .orderBy('createdAt', 'desc')
      .paginate(page, 12)

    vehicles.baseUrl('/vehicles')

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
    const page = request.input('page', 1)

    const vehicles = await Vehicle.query()
      .where('city', 'LIKE', `%${inputSearch}%`)
      .preload('pictures')
      .preload('type')
      .preload('user')
      .orderBy('createdAt', 'desc')
      .paginate(page, 12)

    vehicles.baseUrl('/search')
    vehicles.queryString({ city: inputSearch })

    return view.render('pages/vehicles/index', { vehicles, inputSearch })
  }

  async create({ view }: HttpContext) {
    const types = await Type.all()
    return view.render('pages/vehicles/create', { types })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const data = await request.validateUsing(vehicleValidator)

    const vehicle = await Vehicle.create({
      beds: data.beds,
      seats: data.seats,
      city: data.city,
      year: data.year,
      wasteWater: data.wasteWater,
      price: data.price,
      model: data.model,
      width: data.width,
      height: data.height,
      length: data.length,
      km: data.km,
      cleanWater: data.cleanWater,
      animals: data.animals,
      description: data.description,
      travelAbroad: data.travelAbroad,
      userId: auth.user!.id,
      typeId: data.type,
    })

    for (const file of data.pictures) {
      const name = await storeUpload(file, 'pictures')
      await Picture.create({
        title: file.fileName,
        vehicleId: vehicle.id,
        path: name,
      })
    }

    session.flash('success', 'Véhicule créé avec succès')
    return response.redirect().back()
  }

  async listing({ view, auth }: HttpContext) {
    const vehicles = await Vehicle.query()
      .where({ userId: auth.user!.id })
      .preload('type')
      .withCount('bookings')
      .withCount('comments')
      .exec()

    return view.render('pages/vehicles/listing', { vehicles })
  }
}
