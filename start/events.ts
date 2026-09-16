import emitter from '@adonisjs/core/services/emitter'
import BookingRequested from '#events/booking_requested'
import BookingDecided from '#events/booking_decided'
import BookingCancelled from '#events/booking_cancelled'
import logger from '@adonisjs/core/services/logger'

const SendBookingEmails = () => import('#listeners/send_booking_emails')

emitter.on(BookingRequested, [SendBookingEmails, 'onRequested'])
emitter.on(BookingDecided, [SendBookingEmails, 'onDecided'])
emitter.on(BookingCancelled, [SendBookingEmails, 'onCancelled'])
emitter.on('queued:mail:error', ({ error }) =>
  logger.error({ err: error }, "Échec d'envoi d'un mail")
)
