import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { BaseRewardFetcher } from './BaseRewardFetcher'
import { RewardRate } from '../rewards-service'

interface EulerReward {
  startTimestamp: number
  endTimestamp: number
  apr: number
  rewardToken: {
    address: string
    symbol: string
    decimals: number
  }
}

export class EulerRewardFetcher extends BaseRewardFetcher {
  private readonly EULER_API_URL = 'https://app.euler.finance/api/v2/rewards/merkl?chainId='

  constructor(logger: Logger) {
    super(logger)
  }

  async getRewardRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    const currentTimestamp = Math.floor(Date.now() / 1000)
    this.logger.info(
      `[EulerRewardFetcher] Getting Euler rewards for ${products.length} products on chain ${chainId}`,
    )

    try {
      const response = await this.fetchWithRetry(`${this.EULER_API_URL}${chainId}`)
      const data = (await response
        .json()
        .then((originalData) =>
          Object.fromEntries(
            Object.entries(originalData).map(([key, value]) => [key.toLowerCase(), value]),
          ),
        )) as Record<string, EulerReward[]>

      return products.reduce(
        (acc, product) => {
          const rewards = data[product.pool.toLowerCase()] || []

          acc[product.id] = rewards
            .filter(
              (reward) =>
                reward.startTimestamp <= currentTimestamp &&
                reward.endTimestamp >= currentTimestamp,
            )
            .map((reward, index) => {
              const apr = this.validateAndParseNumber(reward.apr, 'apr')
              if (apr === null) {
                this.logger.warn(
                  `[EulerRewardFetcher] Invalid APR for vault ${product.pool}: ${reward.apr}`,
                )
                return null
              }

              return {
                rewardToken: reward.rewardToken.address,
                rate: apr.toString(),
                index,
                token: {
                  address: reward.rewardToken.address,
                  symbol: reward.rewardToken.symbol,
                  decimals: reward.rewardToken.decimals,
                  precision: (10n ** BigInt(reward.rewardToken.decimals)).toString(),
                },
              }
            })
            .filter((reward): reward is RewardRate => reward !== null)

          return acc
        },
        {} as Record<string, RewardRate[]>,
      )
    } catch (error) {
      this.logger.error('[EulerRewardFetcher] Error fetching Euler rewards:', {
        error: error as Error,
      })
      return this.createEmptyResults(products)
    }
  }
}
