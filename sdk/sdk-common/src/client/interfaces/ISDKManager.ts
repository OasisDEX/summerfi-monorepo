import { SimulationsManager } from '~sdk-common/simulations'
import type { UsersManager, ChainsManager, PortfolioManager } from '~sdk-common/client'

/**
 * @interface ISDKManager
 * @description The SDKManager is the main entry point to interact with the SDK. It contains all the managers that allow to interact
 *              with the different functionality of the SDK
 */
export interface ISDKManager {
  simulator: SimulationsManager
  chains: ChainsManager
  users: UsersManager
  portfolio: PortfolioManager
}
