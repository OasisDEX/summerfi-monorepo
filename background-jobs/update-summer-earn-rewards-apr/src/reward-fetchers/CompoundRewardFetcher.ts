import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { IRewardFetcher } from './IRewardFetcher'
import { RewardRate } from '../rewards-service'

type CompoundRewardsResponse = Array<{
  chain_id: number
  comet: { address: string }
  reward_asset: { address: string; decimals: number; symbol: string }
  earn_rewards_apr?: string
}>

export class CompoundRewardFetcher implements IRewardFetcher {
  private readonly COMPOUND_API_URL =
    'https://v3-api.compound.finance/account/0x0000000000000000000000000000000000000000/rewards'
  private readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  async getRewardRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    try {
      const response = await this.fetchWithRetry(this.COMPOUND_API_URL)
      const data = (await response.json()) as CompoundRewardsResponse

      // Build lookup: key = `${chain_id}-${comet.address.toLowerCase()}`
      const byChainAndComet = new Map<string, (typeof data)[number]>()
      for (const row of data) {
        if (!row?.comet?.address) continue
        byChainAndComet.set(`${row.chain_id}-${row.comet.address.toLowerCase()}`, row)
      }

      const rewards: Record<string, RewardRate[]> = Object.fromEntries(
        products.map((p) => [p.id, []]),
      )

      for (const product of products) {
        const key = `${chainId}-${product.pool.toLowerCase()}`
        const entry = byChainAndComet.get(key)
        if (!entry) continue

        const aprStr = entry.earn_rewards_apr
        if (!aprStr) continue

        const apr = Number(aprStr)
        if (!Number.isFinite(apr) || apr <= 0) continue

        const rate = (apr * 100).toString()
        const { address, symbol, decimals } = entry.reward_asset

        const rewardRate: RewardRate = {
          rewardToken: address,
          rate,
          index: 0,
          token: {
            address,
            symbol,
            decimals,
            precision: (10n ** BigInt(decimals)).toString(),
          },
        }

        rewards[product.id] = [rewardRate]
      }

      return rewards
    } catch (error) {
      this.logger.error('[CompoundRewardFetcher] Error fetching Compound v3 rewards', {
        error: error as Error,
      })
      return Object.fromEntries(products.map((p) => [p.id, []]))
    }
  }

  private async fetchWithRetry(url: string, options?: RequestInit): Promise<Response> {
    const maxRetries = 5
    const initialDelay = 2000
    const backoffFactor = 2
    let attempt = 0

    while (attempt <= maxRetries) {
      try {
        const response = await fetch(url, options)
        if (response.ok) return response
        const text = await response.text().catch(() => '')
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      } catch (error) {
        attempt++
        if (attempt > maxRetries) {
          this.logger.error(
            `[CompoundRewardFetcher] Max retries (${maxRetries}) reached for ${url}`,
          )
          throw error
        }
        const delay = initialDelay * Math.pow(backoffFactor, attempt - 1)
        this.logger.warn(
          `[CompoundRewardFetcher] Attempt ${attempt} failed. Retrying in ${delay}ms...`,
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    throw new Error('Unexpected error in fetchWithRetry')
  }
}
