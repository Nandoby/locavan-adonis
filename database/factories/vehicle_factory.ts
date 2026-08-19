import factory from '@adonisjs/lucid/factories'
import { fakerFR as faker } from '@faker-js/faker'
import Vehicle from '#models/vehicle'
import Type from '#models/type'
import { UserFactory } from '#database/factories/user_factory'
import { PictureFactory } from '#database/factories/picture_factory'
import { CommentFactory } from '#database/factories/comment_factory'

export const VehicleFactory = factory
  .define(Vehicle, async ({ $trx }) => {
    const types = await Type.query({ client: $trx }).exec()
    return {
      price: faker.number.float({
        min: 50,
        max: 100,
        fractionDigits: 2,
      }),
      year: faker.number.int({ min: 1900, max: 2026 }),
      length: faker.number.int({ min: 6, max: 10 }),
      height: faker.number.int({ min: 2, max: 4 }),
      width: faker.number.int({ min: 2, max: 3 }),
      km: faker.number.int({ min: 1000, max: 100000 }),
      model: faker.lorem.words(3),
      cleanWater: faker.number.int({ min: 50, max: 100 }),
      wasteWater: faker.number.int({ min: 50, max: 100 }),
      seats: faker.number.int({ min: 2, max: 5 }),
      beds: faker.number.int({ min: 2, max: 5 }),
      city: faker.location.city(),
      description: faker.lorem.sentences(3),
      animals: faker.datatype.boolean(),
      travelAbroad: faker.datatype.boolean(),
      typeId: faker.helpers.arrayElement(types).id,
    }
  })
  .relation('user', () => UserFactory)
  .relation('pictures', () => PictureFactory)
  .relation('comments', () => CommentFactory)
  .build()
