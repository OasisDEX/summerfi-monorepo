import { Maybe } from '~sdk/utils'
import { Network, NetworkId } from '~sdk/network'

/**
 * @interface NetworkManager
 * @description Manages the list of networks supported by the SDK and allows to retrive a network by its name or chain ID
 */
export interface NetworkManager {
  /**
   * @method getSupportedNetworks
   * @description Retrieves the list of supported networks
   *
   * @returns The list of supported networks
   */
  getSupportedNetworks(): Promise<NetworkId[]>

  /**
   * @method getNetworkByName
   * @description Retrieves a network by its name
   *
   * @param name The name of the network to retrieve
   *
   * @returns The network with the given name
   */
  getNetworkByName(name: string): Promise<Maybe<Network>>

  /**
   * @method getNetworkByChainId
   * @description Retrieves a network by its chain ID
   *
   * @param chainId The chain ID of the network to retrieve
   *
   * @returns The network with the given chain ID
   */
  getNetworkByChainId(chainId: number): Promise<Maybe<Network>>
}
