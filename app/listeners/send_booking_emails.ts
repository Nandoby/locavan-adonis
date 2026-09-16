import mail from '@adonisjs/mail/services/main'
import Booking from '#models/booking'
import type BookingRequested from '#events/booking_requested'
import type BookingDecided from '#events/booking_decided'
import type BookingCancelled from '#events/booking_cancelled'
import BookingRequestedNotification from '#mails/booking_requested_notification'
import BookingDecidedNotification from '#mails/booking_decided_notification'
import BookingCancelledNotification from '#mails/booking_cancelled_notification'

export default class SendBookingEmails {
  async onRequested({ booking }: BookingRequested) {
    await mail.sendLater(new BookingRequestedNotification(await this.load(booking)))
  }

  async onDecided({ booking }: BookingDecided) {
    await mail.sendLater(new BookingDecidedNotification(await this.load(booking)))
  }

  async onCancelled({ booking }: BookingCancelled) {
    await mail.sendLater(new BookingCancelledNotification(await this.load(booking)))
  }

  /**
   * Recharge la réservation avec les relations lues par les templates
   * (locataire, véhicule, type, propriétaire)
   */
  private load(booking: Booking) {
    return Booking.query()
      .where('id', booking.id)
      .preload('user')
      .preload('vehicle', (v) => v.preload('type').preload('user'))
      .firstOrFail()
  }
}
