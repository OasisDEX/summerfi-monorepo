import { SimulationsManager } from '~sdk-common/simulations'
import { ChainsManager } from '~sdk-common/chains'
import { UsersManager } from '~sdk-common/users'
import { PortfolioManager } from '../../portfolio/interfaces/PortfolioManager'

/**
 * @interface SDKManager
 * @description The SDKManager is the main entry point to interact with the SDK. It contains all the managers that allow to interact
 *              with the different functionality of the SDK
 */
export interface SDKManager {
  simulator: SimulationsManager
  chains: ChainsManager
  users: UsersManager
  portfolio: PortfolioManager
}
