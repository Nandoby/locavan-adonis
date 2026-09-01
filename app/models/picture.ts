import { PictureSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import Vehicle from '#models/vehicle'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Picture extends PictureSchema {
  @belongsTo(() => Vehicle)
  declare vehicle: BelongsTo<typeof Vehicle>
}
