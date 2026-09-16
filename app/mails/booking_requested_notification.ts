import { BaseMail } from '@adonisjs/mail'
import type Booking from '#models/booking'

export default class BookingRequestedNotification extends BaseMail {
  subject = 'Nouvelle demande de réservation'

  constructor(private booking: Booking) {
    super()
  }

  prepare() {
    this.message
      .to(this.booking.vehicle.user.email)
      .htmlView('emails/booking_requested', { booking: this.booking })
  }
}
