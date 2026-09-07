import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Type from '#models/type'
import Vehicle from '#models/vehicle'

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=',
  'base64'
)

test.group("Création d'annonce - validation (B1/B4/B6)", (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  async function ctx() {
    const user = await User.create({
      firstName: 'A',
      lastName: 'B',
      email: 'a@t.dev',
      password: 'password',
    })
    const type = await Type.create({ name: 'Van' })
    return { user, type }
  }
  const base = (typeId: number) => ({
    model: 'Cali',
    type: typeId,
    price: 90,
    year: 2021,
    length: 5,
    height: 2,
    width: 2,
    km: 1000,
    city: 'Mons',
    cleanWater: 100,
    wasteWater: 100,
    seats: 4,
    beds: 2,
    animals: '0',
    travelAbroad: '1',
    description: 'un van sympa',
  })

  test('refuse sans photo (B1)', async ({ client, assert }) => {
    const { user, type } = await ctx()
    const res = await client
      .post('/vehicles')
      .loginAs(user)
      .withCsrfToken()
      .form(base(type.id))
      .redirects(0)
    res.assertStatus(302)
    assert.property(res.flashMessages().inputErrorsBag ?? {}, 'pictures')
  })

  test('refuse un prix négatif (B6)', async ({ client, assert }) => {
    const { user, type } = await ctx()
    const res = await client
      .post('/vehicles')
      .loginAs(user)
      .withCsrfToken()
      .fields({ ...base(type.id), price: -10 })
      .file('pictures[]', PNG_1X1, { filename: 'p.png', contentType: 'image/png' })
      .redirects(0)
    res.assertStatus(302)
    assert.property(res.flashMessages().inputErrorsBag ?? {}, 'price')
  })

  test('refuse une ville avec des chiffres (B4)', async ({ client, assert }) => {
    const { user, type } = await ctx()
    const res = await client
      .post('/vehicles')
      .loginAs(user)
      .withCsrfToken()
      .fields({ ...base(type.id), city: 'Mons123' })
      .file('pictures[]', PNG_1X1, { filename: 'p.png', contentType: 'image/png' })
      .redirects(0)
    res.assertStatus(302)
    assert.property(res.flashMessages().inputErrorsBag ?? {}, 'city')
  })

  test('accepte une ville avec espaces/accents (B4)', async ({ client, assert }) => {
    const { user, type } = await ctx()
    const res = await client
      .post('/vehicles')
      .loginAs(user)
      .withCsrfToken()
      .fields({ ...base(type.id), city: 'Aix en Provence' })
      .file('pictures[]', PNG_1X1, { filename: 'p.png', contentType: 'image/png' })
      .redirects(0)
    res.assertStatus(302)
    const v = await Vehicle.query().where('userId', user.id).firstOrFail()
    assert.equal(v.city, 'Aix en Provence')
  })
})
