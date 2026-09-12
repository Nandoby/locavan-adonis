import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Vehicle from '#models/vehicle'
import Type from '#models/type'
import Picture from '#models/picture'
import {
  vehicleValidator,
  vehicleUpdateValidator,
  vehicleStatusValidator,
} from '#validators/vehicle'
import { storeUpload, deleteUpload } from '#services/upload_service'
import VehiclePolicy from '#policies/vehicle_policy'

export default class VehiclesController {
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const vehicles = await Vehicle.query()
      .where('status', 'published')
      .preload('pictures')
      .preload('user')
      .preload('type')
      .orderBy('createdAt', 'desc')
      .paginate(page, 12)

    vehicles.baseUrl('/vehicles')

    return view.render('pages/vehicles/index', { vehicles })
  }

  async show({ params, view, auth, response }: HttpContext) {
    const { id } = params
    const vehicle = await Vehicle.query()
      .preload('pictures')
      .preload('user')
      .preload('type')
      .preload('comments', (query) => query.preload('user').preload('memories'))
      .where({ id: id })
      .firstOrFail()

    if (vehicle.status !== 'published' && auth.user?.id !== vehicle.userId) {
      return response.notFound('Annonce introuvable')
    }

    const notAvailableDays = await vehicle.getNotAvailableDays()
    const notAvailableDaysJson = notAvailableDays
      .map((date) => date.toFormat('dd/MM/yyyy'))
      .join(',')
    const ratingAverage = await vehicle.ratingAverage()

    return view.render('pages/vehicles/show', { vehicle, notAvailableDaysJson, ratingAverage })
  }

  async search({ view, request }: HttpContext) {
    const inputSearch = request.input('city', '').trim()
    const page = request.input('page', 1)

    const vehicles = await Vehicle.query()
      .where('city', 'LIKE', `%${inputSearch}%`)
      .where('status', 'published')
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
    return response.redirect().toRoute('vehicles.show', { id: vehicle.id })
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

  async edit({ params, view, bouncer }: HttpContext) {
    const vehicle = await Vehicle.query().where({ id: params.id }).preload('pictures').firstOrFail()

    await bouncer.with(VehiclePolicy).authorize('update', vehicle)

    const types = await Type.all()
    return view.render('pages/vehicles/edit', { vehicle, types })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const vehicle = await Vehicle.findOrFail(params.id)
    await bouncer.with(VehiclePolicy).authorize('update', vehicle)

    const data = await request.validateUsing(vehicleUpdateValidator)

    vehicle.merge({
      model: data.model,
      typeId: data.type,
      price: data.price,
      year: data.year,
      length: data.length,
      height: data.height,
      width: data.width,
      km: data.km,
      city: data.city,
      cleanWater: data.cleanWater,
      wasteWater: data.wasteWater,
      seats: data.seats,
      beds: data.beds,
      animals: data.animals,
      travelAbroad: data.travelAbroad,
      description: data.description,
    })
    await vehicle.save()

    if (data.pictures?.length) {
      for (const file of data.pictures) {
        const name = await storeUpload(file, 'pictures')
        await Picture.create({ title: file.fileName, vehicleId: vehicle.id, path: name })
      }
    }

    session.flash('success', 'Annonce mise à jour')
    return response.redirect().toRoute('vehicles.show', { id: vehicle.id })
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    const vehicle = await Vehicle.query()
      .where({ id: params.id })
      .withCount('bookings')
      .withCount('comments')
      .preload('pictures')
      .firstOrFail()

    await bouncer.with(VehiclePolicy).authorize('delete', vehicle)

    if (Number(vehicle.$extras.bookings_count) > 0 || Number(vehicle.$extras.comments_count) > 0) {
      session.flash(
        'error',
        'Cette annonce a un historique (réservations ou avis). Mettez-la en pause plutôt que de la supprimer.'
      )
      return response.redirect().back()
    }

    const keys = vehicle.pictures.map((picture) => picture.path)

    await db.transaction(async (trx) => {
      vehicle.useTransaction(trx)
      await vehicle.related('pictures').query().delete()
      await vehicle.delete()
    })

    await Promise.all(keys.map((key) => deleteUpload(key)))

    session.flash('success', 'Annonce supprimée')
    return response.redirect().toRoute('vehicles.listing')
  }

  async updateStatus({ params, request, response, session, bouncer }: HttpContext) {
    const vehicle = await Vehicle.findOrFail(params.id)
    await bouncer.with(VehiclePolicy).authorize('update', vehicle)

    const { status } = await request.validateUsing(vehicleStatusValidator)
    vehicle.status = status
    await vehicle.save()

    session.flash('success', status === 'published' ? 'Annonce publiée' : 'Annonce mise en pause')
    return response.redirect().back()
  }
}
