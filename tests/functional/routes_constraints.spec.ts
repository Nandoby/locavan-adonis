import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Contrainte de route :id (quick win)', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('un id non numérique renvoie 404', async ({ client }) => {
    const res = await client.get('/vehicles/abc')
    res.assertStatus(404)
  })
})
