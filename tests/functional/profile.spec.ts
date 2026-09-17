import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

test.group('Profil - nom + mot de passe (B3)', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  const createUser = () =>
    User.create({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'j@t.dev',
      password: 'oldpassword',
    })

  test('met à jour le nom ET le mot de passe en une soumission', async ({ client, assert }) => {
    const user = await createUser()

    const res = await client
      .post('/profile')
      .loginAs(user)
      .withCsrfToken()
      .form({
        firstname: 'Jeanne',
        lastname: 'Durand',
        currentPassword: 'oldpassword',
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

  test('refuse le changement si le mot de passe actuel est faux', async ({ client, assert }) => {
    const user = await createUser()

    const res = await client
      .post('/profile')
      .loginAs(user)
      .withCsrfToken()
      .form({
        firstname: 'Jeanne',
        lastname: 'Durand',
        currentPassword: 'mauvais-mdp',
        password: 'newpassword',
        passwordConfirm: 'newpassword',
      })
      .redirects(0)

    res.assertStatus(302)
    res.assertFlashMessage('error', 'Mot de passe actuel incorrect.')

    const updated = await User.findOrFail(user.id)
    assert.equal(updated.firstName, 'Jean')
    assert.isTrue(await hash.verify(updated.password!, 'oldpassword'))
  })

  test('met à jour le nom seul, sans mot de passe actuel', async ({ client, assert }) => {
    const user = await createUser()

    const res = await client
      .post('/profile')
      .loginAs(user)
      .withCsrfToken()
      .form({ firstname: 'Jeanne', lastname: 'Durand', password: '', passwordConfirm: '' })
      .redirects(0)

    res.assertStatus(302)
    const updated = await User.findOrFail(user.id)
    assert.equal(updated.firstName, 'Jeanne')
    assert.isTrue(await hash.verify(updated.password!, 'oldpassword'))
  })
})
