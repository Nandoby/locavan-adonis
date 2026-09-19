import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import edge from 'edge.js'
import User from '#models/user'
import Type from '#models/type'
import Vehicle from '#models/vehicle'

test.group("Pages d'erreur (AUD-017)", (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('une URL inconnue affiche la 404 du site, en français', async ({ client, assert }) => {
    const res = await client.get('/cette-page-n-existe-pas')

    res.assertStatus(404)
    assert.include(res.text(), '<html lang="fr">')
    assert.include(res.text(), 'Cette page n')
    assert.include(res.text(), 'Voir les véhicules')
  })

  test('une annonce en pause affiche la même 404', async ({ client, assert }) => {
    const owner = await User.create({
      firstName: 'O',
      lastName: 'w',
      email: 'owner@t.dev',
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
      status: 'paused',
    })

    const res = await client.get(`/vehicles/${vehicle.id}`)

    res.assertStatus(404)
    assert.include(res.text(), 'Cette page n')
    assert.notInclude(res.text(), 'Cali')
  })

  test('la page 500 est en français et sans détail technique', async ({ assert }) => {
    const html = await edge.render('pages/errors/server_error', {
      error: new Error('secret interne'),
    })

    assert.include(html, 'Une erreur est survenue')
    assert.notInclude(html, 'secret interne')
  })
})
