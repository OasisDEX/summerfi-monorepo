import { IArmadaManagerGovernanceClient } from './IArmadaManagerGovernanceClient'
import { IArmadaManagerKeepersClient } from './IArmadaManagerKeepersClient'
import { IArmadaManagerUsersClient } from './IArmadaManagerUsersClient'

/**
 * @interface IArmadaManagerClient
 * @description Interface of the FleetCommander manager for the SDK Client. Allows to instantiate
 *              FleetCommanders to interact with them
 */
export interface IArmadaManagerClient {
  /** Users API for the Armada protocol */
  users: IArmadaManagerUsersClient
  /** Keepers API for the Armada protocol */
  keepers: IArmadaManagerKeepersClient
  /** Governance API for the Armada protocol */
  governance: IArmadaManagerGovernanceClient
}
