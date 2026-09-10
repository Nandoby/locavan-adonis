import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import User from '#models/user'
import Type from '#models/type'
import Vehicle from '#models/vehicle'
import Booking from '#models/booking'

test.group("Édition / suppression d'annonce (F1)", (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  async function scenario() {
    const owner = await User.create({
      firstName: 'O',
      lastName: 'w',
      email: 'owner@t.dev',
      password: 'password',
    })
    const stranger = await User.create({
      firstName: 'S',
      lastName: 't',
      email: 'stranger@t.dev',
      password: 'password',
    })
    const type = await Type.create({ name: 'Van' })
    const type2 = await Type.create({ name: 'Fourgon' })
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
    return { owner, stranger, type, type2, vehicle }
  }

  const form = (over = {}) => ({
    model: 'Cali',
    type: 0,
    price: 95,
    year: 2020,
    length: 5,
    height: 2,
    width: 2,
    km: 1200,
    city: 'Namur',
    cleanWater: 100,
    wasteWater: 100,
    seats: 4,
    beds: 2,
    animals: '0',
    travelAbroad: '1',
    description: 'maj',
    ...over,
  })

  test("le propriétaire accède au formulaire d'édition", async ({ client }) => {
    const { owner, vehicle } = await scenario()
    const res = await client.get(`/vehicles/${vehicle.id}/edit`).loginAs(owner)
    res.assertStatus(200)
  })

  test("un tiers ne peut pas ouvrir le formulaire d'édition", async ({ client }) => {
    const { stranger, vehicle } = await scenario()
    const res = await client.get(`/vehicles/${vehicle.id}/edit`).loginAs(stranger)
    res.assertStatus(403)
  })

  test('le propriétaire met à jour son annonce', async ({ client, assert }) => {
    const { owner, type2, vehicle } = await scenario()
    const res = await client
      .post(`/vehicles/${vehicle.id}`)
      .loginAs(owner)
      .withCsrfToken()
      .form(form({ type: type2.id, city: 'Namur', km: 1200 }))
      .redirects(0)

    res.assertStatus(302)
    await vehicle.refresh()
    assert.equal(vehicle.city, 'Namur')
    assert.equal(vehicle.km, 1200)
    assert.equal(vehicle.typeId, type2.id)
  })

  test("un tiers ne peut pas mettre à jour l'annonce", async ({ client, assert }) => {
    const { stranger, type2, vehicle } = await scenario()
    const res = await client
      .post(`/vehicles/${vehicle.id}`)
      .loginAs(stranger)
      .withCsrfToken()
      .form(form({ type: type2.id }))
      .redirects(0)

    res.assertStatus(302)
    await vehicle.refresh()
    assert.equal(vehicle.city, 'Mons')
  })

  test('le propriétaire supprime une annonce sans historique', async ({ client, assert }) => {
    const { owner, vehicle } = await scenario()
    const res = await client
      .post(`/vehicles/${vehicle.id}/delete`)
      .loginAs(owner)
      .withCsrfToken()
      .redirects(0)

    res.assertStatus(302)
    assert.isNull(await Vehicle.find(vehicle.id))
  })

  test("suppression refusée si l'annonce a des réservations", async ({ client, assert }) => {
    const { owner, vehicle } = await scenario()
    await Booking.create({
      userId: owner.id,
      vehicleId: vehicle.id,
      startDate: DateTime.now().minus({ days: 10 }),
      endDate: DateTime.now().minus({ days: 3 }),
    })

    const res = await client
      .post(`/vehicles/${vehicle.id}/delete`)
      .loginAs(owner)
      .withCsrfToken()
      .redirects(0)

    res.assertStatus(302)
    res.assertFlashMessage('error')
    assert.isNotNull(await Vehicle.find(vehicle.id))
  })

  test("un tiers ne peut pas supprimer l'annonce", async ({ client, assert }) => {
    const { stranger, vehicle } = await scenario()
    const res = await client
      .post(`/vehicles/${vehicle.id}/delete`)
      .loginAs(stranger)
      .withCsrfToken()
      .redirects(0)

    res.assertStatus(302)
    assert.isNotNull(await Vehicle.find(vehicle.id))
  })
})
