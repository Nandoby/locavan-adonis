import factory from '@adonisjs/lucid/factories'
import Comment from '#models/comment'
import { MemoryFactory } from '#database/factories/memory_factory'
import User from '#models/user'

export const CommentFactory = factory
  .define(Comment, async ({ faker, $trx }) => {
    const user = await User.query({ client: $trx }).exec()
    return {
      content: faker.lorem.text(),
      rating: faker.number.int({ min: 0, max: 5 }),
      userId: faker.helpers.arrayElement(user).id,
    }
  })
  .relation('memories', () => MemoryFactory)
  .build()
