import type { IArmadaManagerClient } from './ArmadaManager/IArmadaManagerClient'
import type { IChainsManagerClient } from './IChainsManager'
import type { IOracleManagerClient } from './IOracleManagerClient'
import type { ISwapManagerClient } from './ISwapManagerClient'
import type { IUsersManager } from './IUsersManager'

/**
 * SDKManager is the main entry point for interacting with the SDK in the client side
 *
 * It contains all the available services that can be used to interact with the SDK
 */
export interface ISDKAdminManager {
  /** Chains Manager for interacting with the different chains supported in the SDK */
  readonly chains: IChainsManagerClient
  /** Users Manager for retrieving information about a user */
  readonly users: IUsersManager
  /** Armada Manager for interacting with the Armada protocol */
  readonly armada: IArmadaManagerClient
  /** Swap Manager for interacting with the swaps */
  readonly swaps: ISwapManagerClient
  /** Swap Manager for interacting with the swaps */
  readonly oracle: IOracleManagerClient
}
