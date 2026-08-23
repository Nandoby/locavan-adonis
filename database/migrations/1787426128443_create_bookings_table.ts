import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.datetime('start_date')
      table.datetime('end_date')

      table.integer('user_id')
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.integer('vehicle_id')
      table.foreign('vehicle_id').references('vehicles.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
