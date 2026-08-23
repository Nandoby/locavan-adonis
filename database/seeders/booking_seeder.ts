import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { BookingFactory } from '#database/factories/booking_factory'

export default class extends BaseSeeder {
  async run() {
    await BookingFactory.createMany(10)
  }
}
