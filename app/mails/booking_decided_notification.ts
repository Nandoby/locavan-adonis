import { BaseMail } from '@adonisjs/mail'
import type Booking from '#models/booking'

export default class BookingDecidedNotification extends BaseMail {
  constructor(private booking: Booking) {
    super()
  }

  prepare() {
    const accepted = this.booking.status === 'confirmed'

    this.message
      .to(this.booking.user.email)
      .subject(
        accepted ? 'Votre réservation est confirmée' : 'Votre demande de réservation a été refusée'
      )
      .htmlView('emails/booking_decided', { booking: this.booking, accepted })
  }
}
