import { type BlockchainClient } from '../types/BlockchainClient'
import type { IChainInfo } from '@summerfi/sdk-common'

/**
 * @name IBlockchainClientProvider
 * @description Interface for the configuration provider, which is used to retrieve configuration items which are
 *              typically stored in environment variables, although it could also fetch them from other sources
 */
export interface IBlockchainClientProvider {
  /**
   * @name getBlockchainClient
   * @description Retrieves a configuration item from the configuration provider
   * @param name The name of the configuration item to retrieve
   * @returns The value of the configuration item
   */
  getBlockchainClient(params: { chainInfo: IChainInfo }): BlockchainClient
}
