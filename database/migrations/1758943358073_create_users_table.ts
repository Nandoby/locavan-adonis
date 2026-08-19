import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('first_name')
      table.string('last_name')
      table.string('email').notNullable().unique()
      table.string('password')
      table.string('avatar_path').defaultTo('/images/default.webp')
      table.boolean('is_admin').defaultTo(0).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
