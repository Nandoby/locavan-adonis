import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'
import User from '#models/user'
import Type from '#models/type'
import Vehicle from '#models/vehicle'
import Booking from '#models/booking'
import BookingRequestedNotification from '#mails/booking_requested_notification'
import BookingDecidedNotification from '#mails/booking_decided_notification'
import BookingCancelledNotification from '#mails/booking_cancelled_notification'

test.group('Emails de réservation (F6)', (group) => {
  let mails: ReturnType<typeof mail.fake>['mails']

  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => {
    mails = mail.fake().mails
    return () => mail.restore()
  })

  async function scenario() {
    const owner = await User.create({
      firstName: 'O',
      lastName: 'w',
      email: 'owner@t.dev',
      password: 'password',
    })
    const renter = await User.create({
      firstName: 'R',
      lastName: 'e',
      email: 'renter@t.dev',
      password: 'password',
    })
    const type = await Type.create({ name: 'Van' })
    const vehicle = await Vehicle.create({
      model: 'Cali',
      typeId: type.id,
      userId: owner.id,
      price: 90,
      year: 2020,
      length: 5,
      height: 2,
      width: 2,
      km: 1000,
      city: 'Mons',
      cleanWater: 100,
      wasteWater: 100,
      seats: 4,
      beds: 2,
      animals: false,
      travelAbroad: true,
      description: 'x',
    })
    const booking = await Booking.create({
      userId: renter.id,
      vehicleId: vehicle.id,
      startDate: DateTime.now().plus({ days: 10 }),
      endDate: DateTime.now().plus({ days: 15 }),
    })
    return { owner, renter, vehicle, booking }
  }

  test('une demande de réservation prévient le propriétaire', async ({ client }) => {
    const { owner, renter, vehicle } = await scenario()

    const res = await client
      .post(`/vehicles/${vehicle.id}/bookings`)
      .loginAs(renter)
      .withCsrfToken()
      .form({ booking_startDate: '10/06/2027', booking_endDate: '15/06/2027' })
      .redirects(0)

    res.assertStatus(302)
    mails.assertQueued(BookingRequestedNotification, (m) => m.message.hasTo(owner.email))
  })

  test('accepter une demande prévient le locataire', async ({ client }) => {
    const { owner, renter, booking } = await scenario()

    await client.post(`/bookings/${booking.id}/accept`).loginAs(owner).withCsrfToken().redirects(0)

    mails.assertQueued(BookingDecidedNotification, (m) => m.message.hasTo(renter.email))
  })

  test('refuser une demande prévient le locataire', async ({ client }) => {
    const { owner, renter, booking } = await scenario()

    await client.post(`/bookings/${booking.id}/decline`).loginAs(owner).withCsrfToken().redirects(0)

    mails.assertQueued(BookingDecidedNotification, (m) => m.message.hasTo(renter.email))
  })

  test('annuler une réservation prévient le propriétaire', async ({ client }) => {
    const { owner, renter, booking } = await scenario()

    await client.post(`/bookings/${booking.id}/cancel`).loginAs(renter).withCsrfToken().redirects(0)

    mails.assertQueued(BookingCancelledNotification, (m) => m.message.hasTo(owner.email))
  })

  test("aucun mail si l'action est refusée", async ({ client }) => {
    const { renter, booking } = await scenario()

    await client.post(`/bookings/${booking.id}/accept`).loginAs(renter).withCsrfToken().redirects(0)

    mails.assertNoneQueued()
  })
})
