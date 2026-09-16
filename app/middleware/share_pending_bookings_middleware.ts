import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Booking from '#models/booking'

/**
 * Partage aux vues le nombre de demandes en attente sur les annonces
 * de l'utilisateur connecté (badge du header).
 */
export default class SharePendingBookingsMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (user && 'view' in ctx) {
      const [row] = await Booking.query()
        .where('status', 'pending')
        .whereHas('vehicle', (v) => v.where('userId', user.id))
        .count('* as total')

      ctx.view.share({ pendingBookingsCount: Number(row.$extras.total) })
    }

    return next()
  }
}
