import type User from '#models/user'
import type Booking from '#models/booking'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { DateTime } from 'luxon'

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
   * Le locataire peut annuler une demande en attente ou confirmée, tant
   * que le séjour n'a pas commencé
   */
  cancel(user: User, booking: Booking): AuthorizerResponse {
    const notStarted = !booking.startDate || booking.startDate > DateTime.now()
    return (
      user.id === booking.userId && ['pending', 'confirmed'].includes(booking.status) && notStarted
    )
  }
}
