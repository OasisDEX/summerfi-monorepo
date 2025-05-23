import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { BaseRewardFetcher } from './BaseRewardFetcher'
import { RewardRate } from '../rewards-service'

interface MerkleDistribution {
  identifier: string
  chainId: number
  aprRecord: {
    cumulated: number
    breakdowns: {
      value: number
    }[]
  }
  rewardsRecord: {
    breakdowns: {
      token: {
        address: string
        symbol: string
        decimals: number
      }
      value: number
    }[]
  }
}

export class GearboxRewardFetcher extends BaseRewardFetcher {
  private readonly GEARBOX_API_URL =
    'https://api.merkl.xyz/v4/opportunities?mainProtocolId=gearbox&status=LIVE&'

  constructor(logger: Logger) {
    super(logger)
  }

  async getRewardRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    try {
      const MERKL_API_URL = `${this.GEARBOX_API_URL}${chainId}`
      const response = await this.fetchWithRetry(MERKL_API_URL)
      const data = (await response.json()) as MerkleDistribution[]

      const rewardRates: Record<string, RewardRate[]> = this.createEmptyResults(products)

      for (const product of products) {
        const distribution = data.find(
          (d) => d.identifier.toLowerCase() === product.pool.toLowerCase(),
        )

        if (!distribution) {
          continue
        }

        const rewards = distribution.rewardsRecord.breakdowns
          .map((reward, index) => {
            const aprValue = distribution.aprRecord.breakdowns[index]?.value
            if (aprValue === undefined) {
              this.logger.warn(
                `[GearboxRewardFetcher] Missing APR value for reward ${index} in ${product.pool}`,
              )
              return null
            }

            const parsedApr = this.validateAndParseNumber(aprValue, 'APR')
            if (parsedApr === null) {
              this.logger.warn(
                `[GearboxRewardFetcher] Invalid APR for ${reward.token.symbol}: ${aprValue}`,
              )
              return null
            }

            return {
              rewardToken: reward.token.address,
              rate: parsedApr.toString(),
              index,
              token: {
                address: reward.token.address,
                symbol: reward.token.symbol,
                decimals: reward.token.decimals,
                precision: (10n ** BigInt(reward.token.decimals)).toString(),
              },
            }
          })
          .filter((reward): reward is RewardRate => reward !== null)

        if (rewards.length > 0) {
          rewardRates[product.id] = rewards
        }
      }

      return rewardRates
    } catch (error) {
      this.logger.error('[GearboxRewardFetcher] Error fetching Gearbox rewards:', {
        error: error as Error,
      })
      return this.createEmptyResults(products)
    }
  }
}
