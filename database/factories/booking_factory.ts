import factory from '@adonisjs/lucid/factories'
import Booking from '#models/booking'
import { DateTime } from 'luxon'
import User from '#models/user'
import Vehicle from '#models/vehicle'

export const BookingFactory = factory
  .define(Booking, async ({ faker, $trx }) => {
    const startDate = DateTime.fromJSDate(faker.date.anytime())
    const nights = faker.number.int({ min: 3, max: 10 })
    const user = await User.query({ client: $trx }).exec()
    const vehicle = await Vehicle.query({ client: $trx }).exec()
    const selectedVehicle = faker.helpers.arrayElement(vehicle)
    return {
      startDate,
      endDate: startDate.plus({ days: nights }),
      nights,
      totalPrice: Math.round(nights * (selectedVehicle.price ?? 0) * 100) / 100,
      userId: faker.helpers.arrayElement(user).id,
      vehicleId: selectedVehicle.id,
    }
  })
  .build()
