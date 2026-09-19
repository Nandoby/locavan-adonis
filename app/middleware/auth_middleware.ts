import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    } catch (error) {
      const intendedUrl = this.#intendedUrl(ctx)
      if (intendedUrl) ctx.session.put('intendedUrl', intendedUrl)
      throw error
    }
    return next()
  }

  /**
   * Page à retrouver après connexion : l'URL demandée pour un GET, sinon la page
   * d'où vient le formulaire (ex. « Demander à réserver » sur une annonce).
   * Toujours un chemin local, pour ne jamais rediriger hors du site.
   */
  #intendedUrl({ request }: HttpContext) {
    const url = request.method() === 'GET' ? request.url(true) : request.header('referer')
    if (!url) return null

    try {
      const { pathname, search } = new URL(url, 'http://localhost')
      return pathname.startsWith('//') ? null : pathname + search
    } catch {
      return null
    }
  }
}
