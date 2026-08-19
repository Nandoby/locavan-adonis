import { CommentSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Vehicle from '#models/vehicle'
import Memory from '#models/memory'

export default class Comment extends CommentSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Vehicle)
  declare vehicle: BelongsTo<typeof Vehicle>

  @hasMany(() => Memory)
  declare memories: HasMany<typeof Memory>
}
