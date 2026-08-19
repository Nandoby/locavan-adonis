import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries insid15e the run method
    await UserFactory.with('vehicles', 1, (v) =>
      v.with('pictures', 4).with('comments', 5, (c) => c.with('memories', 2))
    ).createMany(10)
  }
}
