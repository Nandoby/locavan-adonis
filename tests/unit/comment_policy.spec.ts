import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import CommentPolicy from '#policies/comment_policy'

test.group('CommentPolicy.create', () => {
  const policy = new CommentPolicy()
  const user = { id: 1 } as any
  const booking = (attrs: Partial<{ userId: number; endDate: DateTime | null }> = {}) =>
    ({ userId: 1, endDate: DateTime.now().minus({ days: 1 }), ...attrs }) as any

  test('autorise le locataire une fois le séjour terminé', ({ assert }) => {
    assert.isTrue(policy.create(user, booking()))
  })

  test("refuse la réservation d'un autre utilisateur", ({ assert }) => {
    assert.isFalse(policy.create(user, booking({ userId: 2 })))
  })

  test("refuse si le séjour n'est pas terminé", ({ assert }) => {
    assert.isFalse(policy.create(user, booking({ endDate: DateTime.now().plus({ days: 3 }) })))
  })

  test('refuse si endDate est nul', ({ assert }) => {
    assert.isFalse(policy.create(user, booking({ endDate: null })))
  })
})
