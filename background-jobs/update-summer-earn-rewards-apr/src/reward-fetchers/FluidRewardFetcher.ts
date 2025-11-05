import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { IRewardFetcher } from './IRewardFetcher'
import { RewardRate } from '../rewards-service'

type FluidTokenReward = {
  token: {
    address: string
    name: string
    symbol: string
    decimals: number
  }
  rate: string // e.g. "263" => 2.63%
}

type FluidTokenEntry = {
  address: string
  rewards?: FluidTokenReward[]
}

type FluidTokensResponse = {
  data: FluidTokenEntry[]
}

interface FluidFetcherOptions {
  blacklistSymbols?: string[]
}

export class FluidRewardFetcher implements IRewardFetcher {
  private readonly logger: Logger
  private readonly blacklist: Set<string>

  constructor(logger: Logger, options?: FluidFetcherOptions) {
    this.logger = logger
    this.blacklist = new Set((options?.blacklistSymbols || []).map((s) => s.toUpperCase()))
  }

  async getRewardRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    const url = `https://api.fluid.instadapp.io/v2/lending/${chainId}/tokens`
    try {
      const response = await this.fetchWithRetry(url)
      const json = (await response.json()) as FluidTokensResponse
      const entries = json?.data || []

      // Build quick lookup by lowercased address
      const byAddress = new Map<string, FluidTokenEntry>(
        entries
          .filter((e): e is FluidTokenEntry => !!e && typeof e.address === 'string')
          .map((e) => [e.address.toLowerCase(), e]),
      )

      const rewards: Record<string, RewardRate[]> = Object.fromEntries(
        products.map((p) => [p.id, []]),
      )

      for (const product of products) {
        const entry = byAddress.get(product.pool.toLowerCase())
        if (!entry || !entry.rewards || entry.rewards.length === 0) continue

        const filtered = entry.rewards.filter((r) => {
          const sym = r?.token?.symbol
          if (!sym) return false
          return !this.blacklist.has(sym.toUpperCase())
        })

        const mapped: RewardRate[] = []
        let index = 0
        for (const reward of filtered) {
          const rateNum = Number(reward.rate)
          if (!Number.isFinite(rateNum) || rateNum <= 0) continue
          // API provides e.g. 263 -> 2.63%
          const ratePercent = rateNum / 100

          const addr = reward.token.address
          const symbol = reward.token.symbol
          const decimals = reward.token.decimals

          mapped.push({
            rewardToken: addr,
            rate: ratePercent.toString(),
            index: index++,
            token: {
              address: addr,
              symbol,
              decimals,
              precision: (10n ** BigInt(decimals)).toString(),
            },
          })
        }

        if (mapped.length > 0) {
          rewards[product.id] = mapped
        }
      }

      return rewards
    } catch (error) {
      this.logger.error('[FluidRewardFetcher] Error fetching Fluid rewards', {
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
          this.logger.error(`[FluidRewardFetcher] Max retries (${maxRetries}) reached for ${url}`)
          throw error
        }
        const delay = initialDelay * Math.pow(backoffFactor, attempt - 1)
        this.logger.warn(
          `[FluidRewardFetcher] Attempt ${attempt} failed. Retrying in ${delay}ms...`,
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    throw new Error('Unexpected error in fetchWithRetry')
  }
}
