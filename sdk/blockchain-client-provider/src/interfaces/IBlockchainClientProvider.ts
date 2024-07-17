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
   * @param chainInfo The chain information for the chain
   * @returns IBlockchainClient The client for a particular chain
   */
  getBlockchainClient(params: { chainInfo: IChainInfo }): IBlockchainClient

  /**
   * @name getCustomBlockchainClient
   *  @description Gets a custom blockchain client
   *
   * @param rpcUrl RPC URL to be used for this client
   * @param chainInfo Chain for which we want to get the blockchain client
   *
   * @returns The custom blockchain client
   */
  getCustomBlockchainClient(params: { rpcUrl: string; chainInfo: IChainInfo }): IBlockchainClient
}
