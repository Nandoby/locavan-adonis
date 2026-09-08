import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import limiter from '@adonisjs/limiter/services/main'

test.group('Login throttle (B11)', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(async () => {
    await limiter.clear()
  })

  test('bloque après 5 tentatives en une minute', async ({ client }) => {
    for (let i = 0; i < 5; i++) {
      const r = await client
        .post('/login')
        .withCsrfToken()
        .form({ email: 'x@t.dev', password: 'wrong' })
        .redirects(0)
      r.assertStatus(302)
    }

    const blocked = await client
      .post('/login')
      .withCsrfToken()
      .form({ email: 'x@t.dev', password: 'wrong' })
      .redirects(0)

    blocked.assertStatus(302)
    blocked.assertFlashMessage(
      'error',
      'Trop de tentatives de connexion. Réessayez dans quelques minutes.'
    )
  })
})
