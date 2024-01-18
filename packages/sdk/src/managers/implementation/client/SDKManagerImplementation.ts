import { NetworkManager, PortfolioManager, SimulationManager, UserManager } from '~sdk/managers'
import { Network, NetworkId } from '~sdk/network'
import { Maybe } from '~sdk/utils'
import { SimulationManagerClientImpl } from './SimulationManagerClientImpl'
import { NetworkManagerClientImpl } from './NetworkManagerClientImpl'
import { PortfolioManagerClientImpl } from './PortfolioManagerClientImpl'
import { UserManagerClientImpl } from './UserManagerClientImpl'

/**
 * @class SDKManagerClientImpl
 * @see SDKManager
 */
export class SDKManagerClientImpl implements NetworkManager {
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

  /// Instance Methods

  /**
   * @method getSupportedNetworks
   * @see NetworkManager#getSupportedNetworks
   */
  public async getSupportedNetworks(): Promise<NetworkId[]> {
    // TODO: Implement
    return [] as NetworkId[]
  }

  /**
   * @method getNetworkByName
   * @see NetworkManager#getNetworkByName
   */
  public async getNetworkByName(name: string): Promise<Maybe<Network>> {
    // TODO: Implement
    return undefined
  }

  /**
   * @method getNetworkByChainId
   * @see NetworkManager#getNetworkByChainId
   */
  public async getNetworkByChainId(chainId: number): Promise<Maybe<Network>> {
    // TODO: Implement
    return undefined
  }

  /// Static Methods

  public static getInstance(): SDKManagerClientImpl {
    if (!this._instance) {
      this._instance = new SDKManagerClientImpl()
    }
    return this._instance
  }
}
