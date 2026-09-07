import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import User from '#models/user'
import Type from '#models/type'
import Vehicle from '#models/vehicle'
import Booking from '#models/booking'
import Comment from '#models/comment'

test.group('Avis - autorisation (B2)', (group) => {
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
    const stranger = await User.create({
      firstName: 'S',
      lastName: 't',
      email: 'stranger@t.dev',
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
    return { owner, renter, stranger, vehicle }
  }

  const past = () => ({
    startDate: DateTime.now().minus({ days: 10 }),
    endDate: DateTime.now().minus({ days: 3 }),
  })
  const future = () => ({
    startDate: DateTime.now().plus({ days: 3 }),
    endDate: DateTime.now().plus({ days: 10 }),
  })

  test("un tiers ne peut pas commenter la réservation d'autrui", async ({ client, assert }) => {
    const { renter, stranger, vehicle } = await scenario()
    const booking = await Booking.create({ userId: renter.id, vehicleId: vehicle.id, ...past() })

    const res = await client
      .post(`/bookings/${booking.id}/comment`)
      .loginAs(stranger)
      .withCsrfToken()
      .form({ content: 'top', rating: 5 })
      .redirects(0)

    res.assertStatus(302)
    res.assertFlashMessage('error')
    const count = await Comment.query().where('vehicleId', vehicle.id).count('* as total')
    assert.equal(Number(count[0].$extras.total), 0)
  })

  test('pas de commentaire sur une réservation non terminée', async ({ client }) => {
    const { renter, vehicle } = await scenario()
    const booking = await Booking.create({ userId: renter.id, vehicleId: vehicle.id, ...future() })

    const res = await client
      .post(`/bookings/${booking.id}/comment`)
      .loginAs(renter)
      .withCsrfToken()
      .form({ content: 'top', rating: 5 })
      .redirects(0)

    res.assertStatus(302)
  })

  test('le locataire peut commenter sa réservation terminée', async ({ client, assert }) => {
    const { renter, vehicle } = await scenario()
    const booking = await Booking.create({ userId: renter.id, vehicleId: vehicle.id, ...past() })

    const res = await client
      .post(`/bookings/${booking.id}/comment`)
      .loginAs(renter)
      .withCsrfToken()
      .form({ content: 'séjour génial', rating: 5 })
      .redirects(0)

    res.assertStatus(302)
    const comment = await Comment.query()
      .where('vehicleId', vehicle.id)
      .where('userId', renter.id)
      .first()
    assert.isNotNull(comment)
  })
})
