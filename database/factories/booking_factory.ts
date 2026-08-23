import factory from '@adonisjs/lucid/factories'
import Booking from '#models/booking'
import { DateTime } from 'luxon'
import User from '#models/user'
import Vehicle from '#models/vehicle'

export const BookingFactory = factory
  .define(Booking, async ({ faker, $trx }) => {
    const startDate = DateTime.fromJSDate(faker.date.anytime())
    const user = await User.query({ client: $trx }).exec()
    const vehicle = await Vehicle.query({ client: $trx }).exec()
    return {
      startDate,
      endDate: startDate.plus({ days: faker.number.int({ min: 3, max: 10 }) }),
      userId: faker.helpers.arrayElement(user).id,
      vehicleId: faker.helpers.arrayElement(vehicle).id,
    }
  })
  .build()
