import type { HttpContext } from '@adonisjs/core/http'
import { bookingValidator } from '#validators/booking'
import Vehicle from '#models/vehicle'
import Booking from '#models/booking'

export default class BookingsController {
  async store({ params, request, auth, response, session }: HttpContext) {
    const id = params.id
    const vehicle = await Vehicle.findByOrFail({ id })
    const data = await request.validateUsing(bookingValidator)
    const startDate = data.booking_startDate
    const endDate = data.booking_endDate

    const overlap = await Booking.query()
      .where('vehicleId', vehicle.id)
      .where('startDate', '<=', endDate.toSQL()!)
      .where('endDate', '>=', startDate.toSQL()!)
      .first()

    if (overlap) {
      session.flash('error', 'Ce véhicule est déjà réservé sur cette période')
      return response.redirect().back()
    }

    await Booking.create({ userId: auth.user!.id, vehicleId: vehicle.id, startDate, endDate })
    session.flash('success', 'Réservation confirmée !')
    return response.redirect().toRoute('vehicles.show', { id: vehicle.id })
  }
}
