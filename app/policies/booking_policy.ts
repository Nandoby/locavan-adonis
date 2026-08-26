import type User from '#models/user'
import type Booking from '#models/booking'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class BookingPolicy extends BasePolicy {
  view(user: User, booking: Booking): AuthorizerResponse {
    return user.id === booking.userId
  }
}
