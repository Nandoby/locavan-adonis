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
    const nights = Math.round(endDate.startOf('day').diff(startDate.startOf('day'), 'days').days)
    const totalPrice = Math.round(nights * (vehicle.price ?? 0) * 100) / 100

    const booking = await db.transaction(async (trx) => {
      const overlap = await Booking.query({ client: trx })
        .where('vehicleId', vehicle.id)
        .whereNotIn('status', ['declined', 'cancelled'])
        .where('startDate', '<=', endDate.toSQL()!)
        .where('endDate', '>=', startDate.toSQL()!)
        .first()

      if (overlap) return null

      return Booking.create(
        {
          userId: auth.user!.id,
          vehicleId: vehicle.id,
          startDate,
          endDate,
          nights,
          totalPrice,
          status: 'pending',
        },
        { client: trx }
      )
    })

    if (!booking) {
      session.flash('error', 'Ce véhicule est déjà réservé sur cette période')
      return response.redirect().back()
    }

    session.flash('success', 'Demande de réservation envoyée au propriétaire !')
    return response.redirect().toRoute('bookings.show', { id: booking.id })
  }

  async bookings({ view, auth }: HttpContext) {
    const bookings = await Booking.query()
      .where('userId', auth.user!.id)
      .preload('vehicle', (v) => v.preload('pictures').preload('type'))
      .orderBy('createdAt', 'desc')
      .exec()
    return view.render('pages/bookings/bookings', { bookings })
  }

  /**
   * Demandes de réservation reçues par le propriétaire, sur ses annonces.
   */
  async received({ view, auth }: HttpContext) {
    const bookings = await Booking.query()
      .whereHas('vehicle', (v) => v.where('userId', auth.user!.id))
      .preload('vehicle', (v) => v.preload('type'))
      .preload('user')
      .orderBy('createdAt', 'desc')
      .exec()
    return view.render('pages/bookings/received', { bookings })
  }

  async accept({ params, response, session, bouncer }: HttpContext) {
    const booking = await Booking.query().where('id', params.id).preload('vehicle').firstOrFail()
    await bouncer.with(BookingPolicy).authorize('manage', booking)

    booking.status = 'confirmed'
    await booking.save()

    session.flash('success', 'Réservation acceptée')
    return response.redirect().back()
  }

  async decline({ params, response, session, bouncer }: HttpContext) {
    const booking = await Booking.query().where('id', params.id).preload('vehicle').firstOrFail()
    await bouncer.with(BookingPolicy).authorize('manage', booking)

    booking.status = 'declined'
    await booking.save()

    session.flash('success', 'Réservation refusée')
    return response.redirect().back()
  }

  async cancel({ params, response, session, bouncer }: HttpContext) {
    const booking = await Booking.findOrFail(params.id)
    await bouncer.with(BookingPolicy).authorize('cancel', booking)

    booking.status = 'cancelled'
    await booking.save()

    session.flash('success', 'Réservation annulée')
    return response.redirect().back()
  }

  async show({ params, view, auth, bouncer }: HttpContext) {
    const booking = await Booking.query()
      .where('id', params.id)
      .preload('vehicle', (v) => v.preload('type'))
      .firstOrFail()

    await bouncer.with(BookingPolicy).authorize('view', booking)

    const bookingCompleted = DateTime.now() > booking.endDate!
    const hasComment = await Comment.query()
      .where({ vehicleId: booking.vehicleId })
      .where({ userId: auth.user!.id })
      .exec()

    return view.render('pages/bookings/show', { booking, bookingCompleted, hasComment })
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
