import type { HttpContext } from '@adonisjs/core/http'
import { bookingValidator } from '#validators/booking'
import Vehicle from '#models/vehicle'
import Booking from '#models/booking'
import { DateTime } from 'luxon'
import Comment from '#models/comment'
import { commentValidator } from '#validators/comment'
import { storeUpload } from '#services/upload_service'
import Memory from '#models/memory'
import BookingPolicy from '#policies/booking_policy'
import CommentPolicy from '#policies/comment_policy'
import db from '@adonisjs/lucid/services/db'

export default class BookingsController {
  async store({ params, request, auth, response, session }: HttpContext) {
    const id = params.id
    const vehicle = await Vehicle.findByOrFail({ id })
    const data = await request.validateUsing(bookingValidator)
    const startDate = data.booking_startDate
    const endDate = data.booking_endDate

    const created = await db.transaction(async (trx) => {
      const overlap = await Booking.query({ client: trx })
        .where('vehicleId', vehicle.id)
        .where('startDate', '<=', endDate.toSQL()!)
        .where('endDate', '>=', startDate.toSQL()!)
        .first()

      if (overlap) return false

      await Booking.create(
        { userId: auth.user!.id, vehicleId: vehicle.id, startDate, endDate },
        { client: trx }
      )
      return true
    })

    if (!created) {
      session.flash('error', 'Ce véhicule est déjà réservé sur cette période')
      return response.redirect().back()
    }

    session.flash('success', 'Réservation confirmée !')
    return response.redirect().toRoute('vehicles.show', { id: vehicle.id })
  }

  async bookings({ view, auth }: HttpContext) {
    const bookings = await Booking.query()
      .where('userId', auth.user!.id)
      .preload('vehicle', (v) => v.preload('pictures').preload('type'))
      .exec()
    return view.render('pages/bookings/bookings', { bookings })
  }

  async show({ params, view, auth, bouncer }: HttpContext) {
    const booking = await Booking.query()
      .where('id', params.id)
      .preload('vehicle', (v) => v.preload('type'))
      .firstOrFail()

    await bouncer.with(BookingPolicy).authorize('view', booking)

    const dateNow = DateTime.now()
    const bookingCompleted = dateNow > booking.endDate!
    const hasComment = await Comment.query()
      .where({ vehicleId: booking.vehicleId })
      .where({ userId: auth.user!.id })
      .exec()

    return view.render('pages/bookings/show', { booking, dateNow, bookingCompleted, hasComment })
  }

  async storeComment({ params, request, auth, session, response, bouncer }: HttpContext) {
    const { id } = params
    const { memories = [], ...data } = await request.validateUsing(commentValidator)
    const booking = await Booking.query().where({ id }).preload('vehicle').firstOrFail()

    await bouncer.with(CommentPolicy).authorize('create', booking)

    const existingComment = await Comment.query()
      .where({ vehicleId: booking.vehicleId, userId: auth.user!.id })
      .first()

    if (existingComment) {
      session.flash('error', 'Vous avez déjà laissé un commentaire pour ce véhicule')
      return response.redirect().back()
    }

    const comment = await Comment.create({
      userId: auth.user!.id,
      vehicleId: booking.vehicleId,
      rating: data.rating,
      content: data.content,
    })

    if (memories.length > 0) {
      for (const memory of memories) {
        const path = await storeUpload(memory, 'memories')
        await Memory.create({ commentId: comment.id, path })
      }
    }

    session.flash('success', 'Commentaire ajouté')
    return response.redirect().toRoute('bookings.show', { id: booking.id })
  }
}
