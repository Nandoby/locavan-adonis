import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vehicles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.decimal('price')
      table.integer('year')
      table.integer('length')
      table.integer('height')
      table.integer('width')
      table.integer('km')
      table.string('model')
      table.integer('clean_water')
      table.integer('waste_water')
      table.boolean('travel_abroad')
      table.boolean('animals')
      table.integer('seats')
      table.integer('beds')
      table.text('description')
      table.string('city')

      table.integer('type_id')
      table.integer('user_id')

      table.foreign('type_id').references('types.id')
      table.foreign('user_id').references('users.id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
