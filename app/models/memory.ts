import { MemorySchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import Comment from '#models/comment'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Memory extends MemorySchema {
  @belongsTo(() => Comment)
  declare comment: BelongsTo<typeof Comment>
}
