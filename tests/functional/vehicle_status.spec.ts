import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Type from '#models/type'
import Vehicle from '#models/vehicle'

test.group("Status d'annonce (F1b)", (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  async function scenario(status = 'published') {
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
      status,
    })
    return { owner, stranger, vehicle }
  }

  test('une annonce en pause est absente de /vehicles', async ({ client, assert }) => {
    const { vehicle } = await scenario('paused')
    const res = await client.get('/vehicles')
    res.assertStatus(200)
    assert.notInclude(res.text(), `/vehicles/${vehicle.id}`)
  })

  test('une annonce en pause est absente de la recherche', async ({ client, assert }) => {
    const { vehicle } = await scenario('paused')
    const res = await client.get('/search?city=Mons')
    res.assertStatus(200)
    assert.notInclude(res.text(), `/vehicles/${vehicle.id}"`)
  })

  test('un visiteur reçoit 404 sur une annonce en pause', async ({ client }) => {
    const { vehicle } = await scenario('paused')
    const res = await client.get(`/vehicles/${vehicle.id}`)
    res.assertStatus(404)
  })

  test('le propriétaire voit son annonce en pause', async ({ client }) => {
    const { owner, vehicle } = await scenario('paused')
    const res = await client.get(`/vehicles/${vehicle.id}`).loginAs(owner)
    res.assertStatus(200)
  })

  test('le propriétaire met son annonce en pause', async ({ client, assert }) => {
    const { owner, vehicle } = await scenario('published')
    const res = await client
      .post(`/vehicles/${vehicle.id}/status`)
      .loginAs(owner)
      .withCsrfToken()
      .form({ status: 'paused' })
      .redirects(0)

    res.assertStatus(302)
    await vehicle.refresh()
    assert.equal(vehicle.status, 'paused')
  })

  test('un tiers ne peut pas changer le statut', async ({ client, assert }) => {
    const { stranger, vehicle } = await scenario('published')
    const res = await client
      .post(`/vehicles/${vehicle.id}/status`)
      .loginAs(stranger)
      .withCsrfToken()
      .form({ status: 'paused' })
      .redirects(0)

    res.assertStatus(302)
    await vehicle.refresh()
    assert.equal(vehicle.status, 'published')
  })
})
