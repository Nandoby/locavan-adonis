import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('vehicles', (table) => {
      table.index('type_id')
      table.index('user_id')
    })
    this.schema.alterTable('pictures', (table) => {
      table.index('vehicle_id')
    })
    this.schema.alterTable('comments', (table) => {
      table.index('vehicle_id')
      table.index('user_id')
    })
    this.schema.alterTable('memories', (table) => {
      table.index('comment_id')
    })
    this.schema.alterTable('bookings', (table) => {
      table.index('user_id')
      table.index(['vehicle_id', 'start_date', 'end_date'], 'bookings_vehicle_dates_index')
    })
  }

  async down() {
    this.schema.alterTable('vehicles', (table) => {
      table.dropIndex('type_id')
      table.dropIndex('user_id')
    })
    this.schema.alterTable('pictures', (table) => {
      table.dropIndex('vehicle_id')
    })
    this.schema.alterTable('comments', (table) => {
      table.dropIndex('vehicle_id')
      table.dropIndex('user_id')
    })
    this.schema.alterTable('memories', (table) => {
      table.dropIndex('comment_id')
    })
    this.schema.alterTable('bookings', (table) => {
      table.dropIndex('user_id')
      table.dropIndex(['vehicle_id', 'start_date', 'end_date'], 'bookings_vehicle_dates_index')
    })
  }
}
