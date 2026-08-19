import factory from '@adonisjs/lucid/factories'
import { fakerFR as faker } from '@faker-js/faker'
import User from '#models/user'
import { VehicleFactory } from '#database/factories/vehicle_factory'

export const UserFactory = factory
  .define(User, async () => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: 'password',
    }
  })
  .relation('vehicles', () => VehicleFactory)
  .build()
