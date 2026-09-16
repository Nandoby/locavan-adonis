import { BookingSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Vehicle from '#models/vehicle'
import { DateTime } from 'luxon'

export default class Booking extends BookingSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Vehicle)
  declare vehicle: BelongsTo<typeof Vehicle>

  /**
   * Le locataire peut annuler tant que la demande est en attente ou
   * confirmée, et que le séjour n'a pas commencé
   */
  get isCancellable(): boolean {
    const notStarted = !this.startDate || this.startDate > DateTime.now()
    return ['pending', 'confirmed'].includes(this.status) && notStarted
  }
}
