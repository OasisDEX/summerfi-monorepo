import { IArmadaManagerClient } from './ArmadaManager/IArmadaManagerClient'
import { IChainsManagerClient } from './IChainsManager'
import { IPortfolioManager } from './IPortfolioManager'
import type { ISwapManagerClient } from './ISwapManagerClient'
import { IUsersManager } from './IUsersManager'
import { ISimulationManager } from './simulations/ISimulationManager'

/**
 * SDKManager is the main entry point for interacting with the SDK in the client side
 *
 * It contains all the available services that can be used to interact with the SDK
 */
export interface ISDKManager {
  /** Simulator for all the different operations supported in the SDK */
  readonly simulator: ISimulationManager
  /** Chains Manager for interacting with the different chains supported in the SDK */
  readonly chains: IChainsManagerClient
  /** Users Manager for retrieving information about a user */
  readonly users: IUsersManager
  /** Portfolio Manager for retrieving information about a user's portfolio */
  readonly portfolio: IPortfolioManager
  /** Armada Manager for interacting with the Armada protocol */
  readonly armada: IArmadaManagerClient
  /** Swap Manager for interacting with the swaps */
  readonly swaps: ISwapManagerClient
}
