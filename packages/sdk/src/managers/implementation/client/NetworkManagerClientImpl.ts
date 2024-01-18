import { NetworkManager } from '~sdk/managers'
import { Network, NetworkId } from '~sdk/network'
import { Maybe } from '~sdk/utils'

/**
 * @class NetworkManagerClientImpl
 * @see NetworkManager
 */
export class NetworkManagerClientImpl implements NetworkManager {
  /// Class Attributes
  private static _instance: NetworkManagerClientImpl

  /// Constructor
  private constructor() {
    // Empty on purpose
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

  public static getInstance(): NetworkManagerClientImpl {
    if (!this._instance) {
      this._instance = new NetworkManagerClientImpl()
    }
    return this._instance
  }
}
