import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Login (B11)', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('refuse un e-mail mal formé (erreur de champ)', async ({ client, assert }) => {
    const res = await client
      .post('/login')
      .withCsrfToken()
      .form({ email: 'pas-un-email', password: 'peu-importe' })
      .redirects(0)

    res.assertStatus(302)
    assert.property(res.flashMessages().inputErrorsBag ?? {}, 'email')
  })

  test('mauvais mot de passe -> flash FR, non connecté', async ({ client }) => {
    await User.create({
      firstName: 'J',
      lastName: 'D',
      email: 'j@t.dev',
      password: 'goodpassword',
    })

    const res = await client
      .post('/login')
      .withCsrfToken()
      .form({ email: 'j@t.dev', password: 'wrongpassword' })
      .redirects(0)

    res.assertStatus(302)
    res.assertFlashMessage('error', 'E-mail ou mot de passe incorrect.')
  })

  test('bons identifiants -> redirigé vers /', async ({ client }) => {
    await User.create({
      firstName: 'J',
      lastName: 'D',
      email: 'j2@t.dev',
      password: 'goodpassword',
    })

    const res = await client
      .post('/login')
      .withCsrfToken()
      .form({ email: 'j2@t.dev', password: 'goodpassword' })
      .redirects(0)

    res.assertStatus(302)
    res.assertHeader('location', '/')
  })
})
