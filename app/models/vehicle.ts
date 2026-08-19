import { VehicleSchema } from '#database/schema'
import db from '@adonisjs/lucid/services/db'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Type from '#models/type'
import User from '#models/user'
import Picture from '#models/picture'
import Comment from '#models/comment'

export default class Vehicle extends VehicleSchema {
  @belongsTo(() => Type)
  declare type: BelongsTo<typeof Type>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Picture)
  declare pictures: HasMany<typeof Picture>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  async ratingAverage(): Promise<number> {
    const [result] = await db.from('comments').where('vehicle_id', this.id).avg('rating', 'avg')
    return Math.trunc(Number(result.avg ?? 0))
  }
}
