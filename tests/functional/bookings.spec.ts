import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import User from '#models/user'
import Type from '#models/type'
import Vehicle from '#models/vehicle'
import Booking from '#models/booking'

test.group('Réservation - chevauchement (B5)', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

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
    return { owner, renter, vehicle }
  }

  test('refuse une réservation qui chevauche une existante', async ({ client, assert }) => {
    const { renter, vehicle } = await scenario()
    await Booking.create({
      userId: renter.id,
      vehicleId: vehicle.id,
      startDate: DateTime.fromISO('2027-06-10'),
      endDate: DateTime.fromISO('2027-06-20'),
    })

    const res = await client
      .post(`/vehicles/${vehicle.id}/bookings`)
      .loginAs(renter)
      .withCsrfToken()
      .form({ booking_startDate: '15/06/2027', booking_endDate: '25/06/2027' })
      .redirects(0)

    res.assertStatus(302)
    res.assertFlashMessage('error')
    const count = await Booking.query().where('vehicleId', vehicle.id).count('* as total')
    assert.equal(Number(count[0].$extras.total), 1)
  })

  test('accepte une réservation sur une période libre', async ({ client, assert }) => {
    const { renter, vehicle } = await scenario()
    await Booking.create({
      userId: renter.id,
      vehicleId: vehicle.id,
      startDate: DateTime.fromISO('2027-06-10'),
      endDate: DateTime.fromISO('2027-06-20'),
    })

    const res = await client
      .post(`/vehicles/${vehicle.id}/bookings`)
      .loginAs(renter)
      .withCsrfToken()
      .form({ booking_startDate: '21/06/2027', booking_endDate: '30/06/2027' })
      .redirects(0)

    res.assertStatus(302)
    const count = await Booking.query().where('vehicleId', vehicle.id).count('* as total')
    assert.equal(Number(count[0].$extras.total), 2)
  })
})
