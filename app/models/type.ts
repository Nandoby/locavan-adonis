import { TypeSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import Vehicle from '#models/vehicle'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Type extends TypeSchema {
  @hasMany(() => Vehicle)
  declare vehicles: HasMany<typeof Vehicle>
}
