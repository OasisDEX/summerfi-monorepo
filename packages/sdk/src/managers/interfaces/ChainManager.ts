import { Maybe } from '~sdk/utils'
import { Chain, ChainInfo } from '~sdk/chain'

/**
 * @interface ChainManager
 * @description Manages the list of networks supported by the SDK and allows to retrive a network by its name or chain ID
 */
export interface ChainManager {
  /**
   * @method getSupportedNetworks
   * @description Retrieves the list of supported networks
   *
   * @returns The list of supported networks
   */
  getSupportedChains(): Promise<ChainInfo[]>

  /**
   * @method getNetworkByName
   * @description Retrieves a network by its name
   *
   * @param name The name of the network to retrieve
   *
   * @returns The network with the given name
   */
  getChainByName(name: string): Promise<Maybe<Chain>>

  /**
   * @method getNetworkByChainId
   * @description Retrieves a network by its chain ID
   *
   * @param chainId The chain ID of the network to retrieve
   *
   * @returns The network with the given chain ID
   */
  getChainByChainId(chainId: number): Promise<Maybe<Chain>>
}
