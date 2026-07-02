import { ChainInfo, Maybe } from '@summerfi/sdk-common'
import { Chain } from '../implementation/Chain'

/**
 * Interface for the ChainsManager client implementation. Allows to retrieve information for
 * a Chain given its ChainInfo. It also supports to lookup a chain by its name or chain ID
 */
export interface IChainsManagerClient {
  /**
   * Retrieves a chain by its chain info
   *
   * @param params.chainInfo The info associated with the chain to retrieve
   *
   * @returns The chain for the given chain info
   */
  getChain(params: { chainInfo: ChainInfo }): Promise<Chain>

  /**
   * Retrieves a network by its chain ID
   *
   * @param params.chainId The chain ID of the network to retrieve
   *
   * @returns The network with the given chain ID
   */
  getChainById(params: { chainId: number }): Promise<Maybe<Chain>>
}
