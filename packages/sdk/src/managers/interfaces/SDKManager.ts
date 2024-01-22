import { SimulationManager } from './SimulationManager'
import { ChainManager } from './NetworkManager'
import { UserManager } from './UserManager'
import { PortfolioManager } from './PortfolioManager'

/**
 * @interface SDKManager
 * @description The SDKManager is the main entry point to interact with the SDK. It contains all the managers that allow to interact
 *              with the different functionality of the SDK
 */
export interface SDKManager {
  simulator: SimulationManager
  networks: ChainManager
  users: UserManager
  portfolio: PortfolioManager
}
