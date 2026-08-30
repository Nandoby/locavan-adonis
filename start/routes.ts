/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', [controllers.Home, 'index'])

router.get('/vehicles', [controllers.Vehicles, 'index'])
router.get('/vehicles/:id', [controllers.Vehicles, 'show'])
router.post('/vehicles/:id/bookings', [controllers.Bookings, 'store']).use(middleware.auth())

/**
 * Gestion des réservations
 */
router
  .group(() => {
    router.get('/bookings', [controllers.Bookings, 'bookings'])
    router.get('/bookings/:id', [controllers.Bookings, 'show'])
    router.post('/bookings/:id/comment', [controllers.Bookings, 'storeComment'])
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

/** Gestion du profil **/
router
  .group(() => {
    router.get('/profile', [controllers.Users, 'edit']).as('profile')
    router.post('/profile', [controllers.Users, 'update']).as('profile.update')
  })
  .use(middleware.auth())

// Recherche
router.get('/search', [controllers.Vehicles, 'search'])
