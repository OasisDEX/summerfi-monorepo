import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId, NetworkByChainID } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { BaseRewardFetcher } from './BaseRewardFetcher'
import { RewardRate } from '../rewards-service'

interface AaveMeritResponse {
  previousAPR: number | null
  currentAPR: {
    actionsAPR: Record<string, number>
  }
}

export class AaveRewardFetcher extends BaseRewardFetcher {
  private readonly AAVE_API_URL = 'https://apps.aavechan.com/api/merit/aprs'

  constructor(logger: Logger) {
    super(logger)
  }

  async getRewardRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    try {
      const response = await this.fetchWithRetry(this.AAVE_API_URL)
      const data = (await response.json()) as AaveMeritResponse

      const network = chainId === ChainId.MAINNET ? 'ethereum' : NetworkByChainID[chainId]
      const rewards: Record<string, RewardRate[]> = this.createEmptyResults(products)

      for (const product of products) {
        // lowercased without special characters
        const normalizedSymbol = product.token.symbol.toLowerCase().replace(/[^a-z0-9]/g, '')
        const currentApr = data.currentAPR.actionsAPR[`${network}-supply-${normalizedSymbol}`]

        if (!currentApr) {
          continue
        }

        const parsedApr = this.validateAndParseNumber(currentApr, 'currentAPR')
        if (parsedApr === null) {
          this.logger.warn(
            `[AaveRewardFetcher] Invalid APR for ${product.token.symbol}: ${currentApr}`,
          )
          continue
        }

        const rewardRate = {
          rewardToken: '0x0000000000000000000000000000000000000000',
          rate: parsedApr.toString(),
          index: 0,
          token: {
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'Aave Merit',
            decimals: 18,
            precision: (10n ** BigInt(18)).toString(),
          },
        }
        rewards[product.id] = [rewardRate]
      }

      return rewards
    } catch (error) {
      this.logger.error('[AaveRewardFetcher] Error fetching Aave Merit rewards:', {
        error: error as Error,
      })
      return this.createEmptyResults(products)
    }
  }
}
