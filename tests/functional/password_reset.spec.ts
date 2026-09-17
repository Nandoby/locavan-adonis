import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import mail from '@adonisjs/mail/services/main'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import User from '#models/user'
import PasswordResetToken from '#models/password_reset_token'
import PasswordResetNotification from '#mails/password_reset_notification'

test.group('Réinitialisation du mot de passe (F7)', (group) => {
  let mails: ReturnType<typeof mail.fake>['mails']

  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(async () => {
    mails = mail.fake().mails
    return () => mail.restore()
  })

  const createUser = () =>
    User.create({ firstName: 'U', lastName: 's', email: 'user@t.dev', password: 'ancien-mdp' })

  test('une demande pour un compte existant envoie le lien', async ({ client, assert }) => {
    const user = await createUser()

    const res = await client
      .post('/forgot-password')
      .withCsrfToken()
      .form({ email: user.email })
      .redirects(0)

    res.assertStatus(302)
    res.assertFlashMessage('success')
    mails.assertQueued(PasswordResetNotification, (m) => m.message.hasTo(user.email))
    const tokens = await PasswordResetToken.query().where('userId', user.id)
    assert.lengthOf(tokens, 1)
  })

  test('même réponse pour une adresse inconnue, sans mail', async ({ client }) => {
    const res = await client
      .post('/forgot-password')
      .withCsrfToken()
      .form({ email: 'inconnu@t.dev' })
      .redirects(0)

    res.assertStatus(302)
    res.assertFlashMessage('success')
    mails.assertNoneQueued()
  })

  test("un lien valide change le mot de passe et ne sert qu'une fois", async ({
    client,
    assert,
  }) => {
    const user = await createUser()
    const token = await PasswordResetToken.generateFor(user)

    const res = await client
      .post(`/reset-password/${token}`)
      .withCsrfToken()
      .form({ password: 'nouveau-mdp', passwordConfirmation: 'nouveau-mdp' })
      .redirects(0)

    res.assertHeader('location', '/login')
    await user.refresh()
    assert.isTrue(await hash.verify(user.password!, 'nouveau-mdp'))

    const reuse = await client
      .post(`/reset-password/${token}`)
      .withCsrfToken()
      .form({ password: 'autre-mdp1', passwordConfirmation: 'autre-mdp1' })
      .redirects(0)

    reuse.assertFlashMessage('error')
    await user.refresh()
    assert.isTrue(await hash.verify(user.password!, 'nouveau-mdp'))
  })

  test('un lien expiré est refusé', async ({ client, assert }) => {
    const user = await createUser()
    const token = await PasswordResetToken.generateFor(user)
    const record = await PasswordResetToken.findByOrFail('userId', user.id)
    record.expiresAt = DateTime.now().minus({ minutes: 1 })
    await record.save()

    const res = await client
      .post(`/reset-password/${token}`)
      .withCsrfToken()
      .form({ password: 'nouveau-mdp', passwordConfirmation: 'nouveau-mdp' })
      .redirects(0)

    res.assertFlashMessage('error')
    await user.refresh()
    assert.isTrue(await hash.verify(user.password!, 'ancien-mdp'))
  })

  test('demander un nouveau lien invalide le précédent', async ({ assert }) => {
    const user = await createUser()
    const first = await PasswordResetToken.generateFor(user)
    await PasswordResetToken.generateFor(user)

    assert.isNull(await PasswordResetToken.findValid(first))
  })
})
