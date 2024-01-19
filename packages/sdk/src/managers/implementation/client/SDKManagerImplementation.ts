import {
  NetworkManager,
  PortfolioManager,
  SDKManager,
  SimulationManager,
  UserManager,
} from '~sdk/managers'
import { SimulationManagerClientImpl } from './SimulationManagerClientImpl'
import { NetworkManagerClientImpl } from './NetworkManagerClientImpl'
import { PortfolioManagerClientImpl } from './PortfolioManagerClientImpl'
import { UserManagerClientImpl } from './UserManagerClientImpl'

/**
 * @class SDKManagerClientImpl
 * @see SDKManager
 */
export class SDKManagerClientImpl implements SDKManager {
  /// Class Attributes
  private static _instance: SDKManagerClientImpl

  public readonly simulator: SimulationManager
  public readonly networks: NetworkManager
  public readonly users: UserManager
  public readonly portfolio: PortfolioManager

  /// Constructor
  private constructor() {
    this.simulator = SimulationManagerClientImpl.getInstance()
    this.networks = NetworkManagerClientImpl.getInstance()
    this.users = UserManagerClientImpl.getInstance()
    this.portfolio = PortfolioManagerClientImpl.getInstance()
  }

  /// Static Methods

  public static getInstance(): SDKManagerClientImpl {
    if (!this._instance) {
      this._instance = new SDKManagerClientImpl()
    }
    return this._instance
  }
}
