import { type IBlockchainClient } from './IBlockchainClient'
import type { IChainInfo } from '@summerfi/sdk-common'

/**
 * @name IBlockchainClientProvider
 * @description Interface for the BlockchainClient provider, which is used to retrieve a BlockchainClient for a particular chain
 */
export interface IBlockchainClientProvider {
  /**
   * @name getBlockchainClient
   * @description Retrieves a BlockchainClient for a particular chain
   * @param chainInfo The chain information for the chain
   * @returns IBlockchainClient The client for a particular chain
   */
  getBlockchainClient(params: { chainInfo: IChainInfo }): IBlockchainClient
}
