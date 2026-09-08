/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'

export const loginThrottle = limiter.define('login', () => {
  return limiter
    .allowRequests(5)
    .every('1 minute')
    .blockFor('5 minutes')
    .limitExceeded((error) => {
      error.setMessage('Trop de tentatives de connexion. Réessayez dans quelques minutes.')
    })
})
