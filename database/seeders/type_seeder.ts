import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Type from '#models/type'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const types = [
      { name: 'Caravane' },
      { name: 'Van' },
      { name: 'Fourgon aménage' },
      { name: 'Intégral' },
    ]

    await Type.createMany(types)
  }
}
