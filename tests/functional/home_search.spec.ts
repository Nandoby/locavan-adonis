import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import User from '#models/user'
import Type from '#models/type'
import Vehicle from '#models/vehicle'
import Booking from '#models/booking'

test.group("Recherche depuis l'accueil (DSN-005)", (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  function createVehicle(owner: User, type: Type, model: string, seats: number) {
    return Vehicle.create({
      model,
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
      seats,
      beds: 2,
      animals: false,
      travelAbroad: true,
      description: 'x',
      status: 'published',
    })
  }

  async function scenario() {
    const owner = await User.create({
      firstName: 'O',
      lastName: 'w',
      email: 'owner@t.dev',
      password: 'password',
    })
    const type = await Type.create({ name: 'Van' })
    const small = await createVehicle(owner, type, 'Petit', 2)
    const large = await createVehicle(owner, type, 'Grand', 6)
    return { owner, small, large }
  }

  test("le formulaire de l'accueil envoie les filtres lus par la recherche", async ({
    client,
    assert,
  }) => {
    const res = await client.get('/')

    res.assertStatus(200)
    for (const name of ['city', 'startDate', 'endDate', 'minSeats']) {
      assert.include(res.text(), `name="${name}`)
    }
    assert.notInclude(res.text(), 'name="date"')
    assert.notInclude(res.text(), 'name="voyageur"')
  })

  test('le nombre de voyageurs exclut les véhicules trop petits', async ({ client, assert }) => {
    const { small, large } = await scenario()

    const res = await client.get('/search').qs({ city: 'Mons', minSeats: 4 })

    assert.include(res.text(), `/vehicles/${large.id}`)
    assert.notInclude(res.text(), `/vehicles/${small.id}`)
  })

  test('des dates déjà réservées excluent le véhicule', async ({ client, assert }) => {
    const { owner, small, large } = await scenario()
    const start = DateTime.now().plus({ days: 10 }).startOf('day')
    const end = start.plus({ days: 3 })
    await Booking.create({
      userId: owner.id,
      vehicleId: small.id,
      startDate: start,
      endDate: end,
      nights: 3,
      totalPrice: 270,
      status: 'confirmed',
    })

    const res = await client.get('/search').qs({
      city: 'Mons',
      startDate: start.plus({ days: 1 }).toFormat('dd/MM/yyyy'),
      endDate: end.plus({ days: 2 }).toFormat('dd/MM/yyyy'),
    })

    assert.include(res.text(), `/vehicles/${large.id}`)
    assert.notInclude(res.text(), `/vehicles/${small.id}`)
  })
})
