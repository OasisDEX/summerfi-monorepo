import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { IRewardFetcher } from './IRewardFetcher'
import { RewardRate } from '../rewards-service'

interface MorphoVaultV2Reward {
  address: string
  rewards: {
    supplyApr: number | null
    asset: {
      address: string
      symbol: string
      decimals: number
    }
  }[]
}

export class MorphoV2RewardFetcher implements IRewardFetcher {
  private readonly MORPHO_API_URL = 'https://blue-api.morpho.org/graphql'
  private readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  async getRewardRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    this.logger.debug(
      `[MorphoV2RewardFetcher] Getting rewards for ${products.length} products on chain ${chainId}`,
    )

    const vaults = products.map((product) => product.pool)
    const uniqueVaults = [...new Set(vaults)]
    const query = `
      query GetVaultRewards($vaults: [String!]!, $chainId: Int!) {
        vaultV2s(where: { address_in: $vaults, chainId_in: [$chainId] }) {
          items {
            address
            rewards {
              supplyApr
              asset {
                address
                symbol
                decimals
              }
            }
          }
        }
      }
    `

    try {
      const response = await this.fetchWithRetry(this.MORPHO_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables: { vaults: uniqueVaults, chainId },
        }),
      })

      const { data } = await response.json()
      const vaultItems: MorphoVaultV2Reward[] = data?.vaultV2s?.items || []

      const vaultMap = new Map(vaultItems.map((v) => [v.address.toLowerCase(), v]))

      return products.reduce(
        (acc, product) => {
          const vaultData = vaultMap.get(product.pool.toLowerCase())
          acc[product.id] = vaultData ? this.processMorphoVaultV2(vaultData) : []
          return acc
        },
        {} as Record<string, RewardRate[]>,
      )
    } catch (error) {
      this.logger.error('[MorphoV2RewardFetcher] Error fetching Morpho V2 rewards', {
        error: error as Error,
      })
      return Object.fromEntries(products.map((p) => [p.id, []]))
    }
  }

  private processMorphoVaultV2(vaultData: MorphoVaultV2Reward): RewardRate[] {
    return (vaultData.rewards ?? [])
      .filter((r) => r.supplyApr != null && Number.isFinite(r.supplyApr) && r.supplyApr > 0)
      .map((reward, index) => ({
        rewardToken: reward.asset.address,
        rate: ((reward.supplyApr ?? 0) * 100).toString(),
        index,
        token: {
          address: reward.asset.address,
          symbol: reward.asset.symbol,
          decimals: reward.asset.decimals,
          precision: (10n ** BigInt(reward.asset.decimals)).toString(),
        },
      }))
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
            `[MorphoV2RewardFetcher] Max retries (${maxRetries}) reached for ${url}`,
          )
          throw error
        }
        const delay = initialDelay * Math.pow(backoffFactor, attempt - 1)
        this.logger.warn(
          `[MorphoV2RewardFetcher] Attempt ${attempt} failed. Retrying in ${delay}ms...`,
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    throw new Error('Unexpected error in fetchWithRetry')
  }
}
