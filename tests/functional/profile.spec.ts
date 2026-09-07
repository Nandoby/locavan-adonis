import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Profil - nom + mot de passe (B3)', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('met à jour le nom ET le mot de passe en une soumission', async ({ client, assert }) => {
    const user = await User.create({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'j@t.dev',
      password: 'oldpassword',
    })

    const res = await client
      .post('/profile')
      .loginAs(user)
      .withCsrfToken()
      .form({
        firstname: 'Jeanne',
        lastname: 'Durand',
        password: 'newpassword',
        passwordConfirm: 'newpassword',
      })
      .redirects(0)

    res.assertStatus(302)
    const updated = await User.findOrFail(user.id)
    assert.equal(updated.firstName, 'Jeanne')
    assert.equal(updated.lastName, 'Durand')
    await User.verifyCredentials('j@t.dev', 'newpassword')
  })
})
