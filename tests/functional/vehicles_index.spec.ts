import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Type from '#models/type'
import Vehicle from '#models/vehicle'

test.group('Liste des véhicules - pagination (B8)', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('paginate /vehicles à 12 par page', async ({ client }) => {
    const owner = await User.create({
      firstName: 'O',
      lastName: 'w',
      email: 'o@t.dev',
      password: 'password',
    })
    const type = await Type.create({ name: 'Van' })
    for (let i = 0; i < 13; i++) {
      await Vehicle.create({
        model: `V${i}`,
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
    }

    const page1 = await client.get('/vehicles')
    page1.assertStatus(200)
    page1.assertTextIncludes('Suivant')

    const page2 = await client.get('/vehicles?page=2')
    page2.assertStatus(200)
  })

  test('/listing affiche les compteurs sans planter (B9)', async ({ client }) => {
    const owner = await User.create({
      firstName: 'O',
      lastName: 'w',
      email: 'o2@t.dev',
      password: 'password',
    })
    const type = await Type.create({ name: 'Van' })
    await Vehicle.create({
      model: 'Solo',
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

    const res = await client.get('/listing').loginAs(owner)
    res.assertStatus(200)
  })
})
