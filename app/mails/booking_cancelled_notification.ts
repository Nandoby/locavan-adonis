import { BaseMail } from '@adonisjs/mail'
import type Booking from '#models/booking'

export default class BookingCancelledNotification extends BaseMail {
  subject = 'Une réservation a été annulée'

  constructor(private booking: Booking) {
    super()
  }

  prepare() {
    this.message
      .to(this.booking.vehicle.user.email)
      .htmlView('emails/booking_cancelled', { booking: this.booking })
  }
}
