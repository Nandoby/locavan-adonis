import { BaseEvent } from '@adonisjs/core/events'
import type Booking from '#models/booking'

export default class BookingRequested extends BaseEvent {
  constructor(public booking: Booking) {
    super()
  }
}
