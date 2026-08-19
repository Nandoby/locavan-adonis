import factory from '@adonisjs/lucid/factories'
import Memory from '#models/memory'

export const MemoryFactory = factory
  .define(Memory, async ({ faker }) => {
    const id = faker.number.int({ min: 1, max: 80 })
    return {
      path: `https://picsum.photos/id/${id}/800/800`,
    }
  })
  .build()
