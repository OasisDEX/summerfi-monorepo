import { Maybe } from '~sdk-common/utils'
import { Chain, ChainInfo } from '~sdk-common/chains'

/**
 * @interface ChainsManager
 * @description Manages the list of chains supported by the SDK and allows to retrive a chains by its name or chain ID
 */
export interface ChainsManager {
  /**
   * @method getSupportedChains
   * @description Retrieves the list of supported chains
   *
   * @returns The list of supported chains
   */
  getSupportedChains(): Promise<ChainInfo[]>

  /**
   * @method getChain
   * @description Retrieves a chain by its chain info
   *
   * @param chainInfo The info associated with the chain to retrieve
   *
   * @returns The chain for the given chain info
   */
  getChain(params: { chainInfo: ChainInfo }): Promise<Maybe<Chain>>

  /**
   * @method getChainByName
   * @description Retrieves a chain by its name
   *
   * @param name The name of the chain to retrieve
   *
   * @returns The chain with the given name
   */
  getChainByName(params: { name: string }): Promise<Maybe<Chain>>

  /**
   * @method getChainById
   * @description Retrieves a network by its chain ID
   *
   * @param chainId The chain ID of the network to retrieve
   *
   * @returns The network with the given chain ID
   */
  getChainById(params: { chainId: number }): Promise<Maybe<Chain>>
}
