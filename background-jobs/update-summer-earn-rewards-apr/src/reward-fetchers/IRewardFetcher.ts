import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { RewardRate } from '../rewards-service'

export interface IRewardFetcher {
  /**
   * Fetches reward rates for a batch of products
   * @param products Array of products to fetch rewards for
   * @param chainId Chain ID to fetch rewards on
   * @returns Promise resolving to a record of product IDs to their reward rates
   */
  getRewardRates(products: Product[], chainId: ChainId): Promise<Record<string, RewardRate[]>>
}
