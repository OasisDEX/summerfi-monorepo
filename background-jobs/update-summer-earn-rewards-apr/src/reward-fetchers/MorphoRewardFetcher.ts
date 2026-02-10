import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { IRewardFetcher } from './IRewardFetcher'
import { RewardRate } from '../rewards-service'

interface MorphoVaultReward {
  address: string
  state: {
    rewards: {
      supplyApr: number | null
      asset: {
        address: string
        symbol: string
        decimals: number
      }
    }[]
    allocation: {
      market: {
        state: {
          rewards: {
            supplyApr: number | null
            asset: {
              address: string
              symbol: string
              decimals: number
            }
          }[]
        }
      }
      supplyAssetsUsd: number | null
    }[]
  }
}

export class MorphoRewardFetcher implements IRewardFetcher {
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
      `[MorphoRewardFetcher] Getting rewards for ${products.length} products on chain ${chainId}`,
    )

    const vaults = products.map((product) => product.pool)
    const uniqueVaults = [...new Set(vaults)]
    const query = `
      query GetVaultRewards($vaults: [String!]!, $chainId: Int!) {
        vaults(where: { address_in: $vaults, chainId_in: [$chainId] }) {
          items {
            address
            state {
              rewards {
                supplyApr
                asset {
                  address
                  symbol
                  decimals
                }
              }
              allocation {
                market {
                  state {
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
                supplyAssetsUsd
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
      const vaultItems: MorphoVaultReward[] = data?.vaults?.items || []

      const vaultMap = new Map(vaultItems.map((v) => [v.address.toLowerCase(), v]))

      return products.reduce(
        (acc, product) => {
          const vaultData = vaultMap.get(product.pool.toLowerCase())
          acc[product.id] = vaultData ? this.processMorphoVault(vaultData) : []
          return acc
        },
        {} as Record<string, RewardRate[]>,
      )
    } catch (error) {
      this.logger.error('[MorphoRewardFetcher] Error fetching Morpho rewards', {
        error: error as Error,
      })
      return Object.fromEntries(products.map((p) => [p.id, []]))
    }
  }

  private processMorphoVault(vaultData: MorphoVaultReward): RewardRate[] {
    const totalAssetsAllocated = vaultData.state.allocation.reduce(
      (sum, alloc) => sum + (alloc.supplyAssetsUsd ?? 0),
      0,
    )

    const rewards = vaultData.state.rewards.map((reward, index) => ({
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

    if (totalAssetsAllocated === 0) {
      return rewards
    }

    const uniqueTokens = new Map<string, { address: string; symbol: string; decimals: number }>()
    vaultData.state.allocation.forEach((allocation) => {
      allocation.market.state.rewards.forEach((reward) => {
        uniqueTokens.set(reward.asset.address, {
          address: reward.asset.address,
          symbol: reward.asset.symbol,
          decimals: reward.asset.decimals,
        })
      })
    })

    const additionalRewards: RewardRate[] = []
    let nextIndex = rewards.length

    uniqueTokens.forEach((tokenInfo, tokenAddress) => {
      const weightedTokenRewardsApy = vaultData.state.allocation.reduce((acc, allocation) => {
        const marketRewards = allocation.market.state.rewards
          .filter((reward) => reward.asset.address === tokenAddress)
          .map(
            (reward) =>
              (reward.supplyApr ?? 0) * ((allocation.supplyAssetsUsd ?? 0) / totalAssetsAllocated),
          )
        return acc.concat(marketRewards)
      }, [] as number[])

      const totalWeightedApy = weightedTokenRewardsApy.reduce((sum, r) => sum + r, 0)

      if (totalWeightedApy > 0) {
        additionalRewards.push({
          rewardToken: tokenInfo.address,
          rate: (totalWeightedApy > 10 ? 0 : totalWeightedApy * 100).toString(),
          index: nextIndex++,
          token: {
            address: tokenInfo.address,
            symbol: tokenInfo.symbol,
            decimals: tokenInfo.decimals,
            precision: (10n ** BigInt(tokenInfo.decimals)).toString(),
          },
        })
      }
    })

    return [...rewards, ...additionalRewards]
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
          this.logger.error(`[MorphoRewardFetcher] Max retries (${maxRetries}) reached for ${url}`)
          throw error
        }
        const delay = initialDelay * Math.pow(backoffFactor, attempt - 1)
        this.logger.warn(
          `[MorphoRewardFetcher] Attempt ${attempt} failed. Retrying in ${delay}ms...`,
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    throw new Error('Unexpected error in fetchWithRetry')
  }
}
