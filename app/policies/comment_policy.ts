import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import type Booking from '#models/booking'
import { DateTime } from 'luxon'

export default class CommentPolicy extends BasePolicy {
  /**
   * Un utilisateur ne peut laisser un avis que sur sa propre réservation,
   * et seulement une fois le séjour terminé.
   */
  create(user: User, booking: Booking): AuthorizerResponse {
    if (!booking.endDate) return false
    return user.id === booking.userId && DateTime.now() > booking.endDate
  }
}
