import type { IChainInfo } from '@summerfi/sdk-common'
import { type IBlockchainClient } from './IBlockchainClient'

/**
 * @name IBlockchainClientProvider
 * @description Interface for the BlockchainClient provider, which is used to retrieve a BlockchainClient for a particular chain
 */
export interface IBlockchainClientProvider {
  /**
   * @name getBlockchainClient
   * @description Retrieves a BlockchainClient for a particular chain
   *
   * @param chainInfo The chain information for the chain
   * @param rpcUrl Custom RPC URL for the chain (optional)
   *
   * @returns IBlockchainClient The client for a particular chain
   *
   * @dev The custom RPC url can be used to create a blockchain client for a fork, for example
   */
  getBlockchainClient(params: { chainInfo: IChainInfo; rpcUrl?: string }): IBlockchainClient
}
