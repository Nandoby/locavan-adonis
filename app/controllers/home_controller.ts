import type { HttpContext } from '@adonisjs/core/http'
import Vehicle from '#models/vehicle'
import Type from '#models/type'

const TYPE_TINTS: Record<string, string> = {
  'Van': '#CFE0D8',
  'Fourgan aménage': '#E3D9C8',
  'Intégral': '#D6DDE6',
  'Caravane': '#D9E2CE',
}

const TYPE_ICONS: Record<string, string> = {
  'Caravane': 'fa-caravan',
  'Van': 'fa-van-shuttle',
  'Fourgon aménage': 'fa-truck-moving',
  'Intégral': 'fa-bus-simple',
}

export default class HomeController {
  async index({ view }: HttpContext) {
    const latestVehicles = await Vehicle.query()
      .where('status', 'published')
      .preload('pictures')
      .preload('type')
      .preload('user')
      .withCount('comments')
      .orderBy('createdAt', 'desc')
      .limit(3)
      .exec()

    const vehicles = await Promise.all(
      latestVehicles.map(async (vehicle) => ({
        vehicle,
        rating: await vehicle.ratingAverage(),
        reviewsCount: Number(vehicle.$extras.comments_count),
      }))
    )

    const rawTypes = await Type.query()
      .withCount('vehicles', (query) => query.where('status', 'published'))
      .withAggregate('vehicles', (query) => {
        query.where('status', 'published').min('price').as('minPrice')
      })

    const types = rawTypes.map((type) => ({
      id: type.id,
      name: type.name,
      vehiclesCount: Number(type.$extras.vehicles_count),
      minPrice: type.$extras.minPrice === null ? null : Number(type.$extras.minPrice),
      tint: TYPE_TINTS[type.name ?? ''] ?? '#E4E3DE',
      icon: TYPE_ICONS[type.name ?? ''] ?? 'fa-caravan',
    }))

    const [{ $extras }] = await Vehicle.query().where('status', 'published').count('* as total')

    return view.render('pages/home', { vehicles, types, vehiclesTotal: Number($extras.total) })
  }
}
