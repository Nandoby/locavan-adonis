import factory from '@adonisjs/lucid/factories'
import { fakerFR as faker } from '@faker-js/faker'
import Picture from '#models/picture'

export const PictureFactory = factory
  .define(Picture, async () => {
    const id = faker.number.int({ min: 1, max: 80 })
    return {
      title: faker.lorem.words(2),
      path: `https://picsum.photos/id/${id}/800/800`,
    }
  })
  .build()
