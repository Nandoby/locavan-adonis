import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import limiter from '@adonisjs/limiter/services/main'
import User from '#models/user'

test.group('Retour après connexion (AUD-018)', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => limiter.clear())

  test('un visiteur qui demande à réserver est renvoyé vers la connexion, annonce mémorisée', async ({
    client,
  }) => {
    const res = await client
      .post('/vehicles/1/bookings')
      .header('referer', 'http://localhost:3333/vehicles/1')
      .withCsrfToken()
      .redirects(0)

    res.assertStatus(302)
    res.assertHeader('location', '/login')
    res.assertSession('intendedUrl', '/vehicles/1')
  })

  test('une page protégée demandée en GET est mémorisée', async ({ client }) => {
    const res = await client.get('/bookings?page=2').redirects(0)

    res.assertStatus(302)
    res.assertSession('intendedUrl', '/bookings?page=2')
  })

  test('un referer qui sortirait du site est ignoré', async ({ client }) => {
    const res = await client
      .post('/vehicles/1/bookings')
      .header('referer', 'http://localhost:3333//evil.example/phish')
      .withCsrfToken()
      .redirects(0)

    res.assertHeader('location', '/login')
    res.assertSessionMissing('intendedUrl')
  })

  test('après connexion, retour sur la page mémorisée', async ({ client }) => {
    await User.create({
      firstName: 'J',
      lastName: 'D',
      email: 'intended@t.dev',
      password: 'goodpassword',
    })

    const res = await client
      .post('/login')
      .withSession({ intendedUrl: '/vehicles/1' })
      .withCsrfToken()
      .form({ email: 'intended@t.dev', password: 'goodpassword' })
      .redirects(0)

    res.assertStatus(302)
    res.assertHeader('location', '/vehicles/1')
  })

  test('après inscription, retour sur la page mémorisée', async ({ client }) => {
    const res = await client
      .post('/signup')
      .withSession({ intendedUrl: '/vehicles/1' })
      .withCsrfToken()
      .form({
        firstName: 'J',
        lastName: 'D',
        email: 'signup-intended@t.dev',
        password: 'goodpassword',
        passwordConfirmation: 'goodpassword',
      })
      .redirects(0)

    res.assertStatus(302)
    res.assertHeader('location', '/vehicles/1')
  })
})
