import { IArmadaManagerAdminClient } from './IArmadaManagerAdminClient'
import { IArmadaManagerUsersClient } from './IArmadaManagerUsersClient'

/**
 * @interface IArmadaManagerClient
 * @description Interface of the FleetCommander manager for the SDK Client. Allows to instantiate
 *              FleetCommanders to interact with them
 */
export interface IArmadaManagerClient {
  /** Users API for the Armada protocol */
  users: IArmadaManagerUsersClient
  /** Admin API for the Armada protocol - consolidated administrative operations */
  admin: IArmadaManagerAdminClient
}
