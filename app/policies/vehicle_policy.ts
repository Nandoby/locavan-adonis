import type User from '#models/user'
import type Vehicle from '#models/vehicle'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class VehiclePolicy extends BasePolicy {
  /**
   * Seul le propriétaire d'une annonce peut la modifier ou la supprimer
   */
  update(user: User, vehicle: Vehicle): AuthorizerResponse {
    return user.id === vehicle.userId
  }

  delete(user: User, vehicle: Vehicle): AuthorizerResponse {
    return user.id === vehicle.userId
  }
}
