import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  async run() {
    // Write your database queries inside the run method
    await this.seed(await import('#database/seeders/type_seeder'))
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/booking_seeder'))
  }
}
