import type User from '#models/user'
import type Booking from '#models/booking'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class BookingPolicy extends BasePolicy {
  view(user: User, booking: Booking): AuthorizerResponse {
    return user.id === booking.userId
  }

  /**
   * Seul le propriétaire du véhicule peut accepter/refuser, et seulement
   * tant que la demande est en attente
   */
  manage(user: User, booking: Booking): AuthorizerResponse {
    return user.id === booking.vehicle.userId && booking.status === 'pending'
  }

  /**
   * Seul le locataire peut annuler sa réservation, tant qu'elle est annulable
   */
  cancel(user: User, booking: Booking): AuthorizerResponse {
    return user.id === booking.userId && booking.isCancellable
  }
}
