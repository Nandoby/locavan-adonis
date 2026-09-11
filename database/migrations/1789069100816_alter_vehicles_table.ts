import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vehicles'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('status').notNullable().defaultTo('published')
      table.index('status')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex('status')
      table.dropColumn('status')
    })
  }
}
