import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { BaseRewardFetcher } from './BaseRewardFetcher'
import { RewardRate } from '../rewards-service'

const morphoTokenByChainId: Partial<Record<ChainId, string>> = {
  [ChainId.BASE]: '0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842',
  [ChainId.MAINNET]: '0x58D97B57BB95320F9a05dC918Aef65434969c2B2',
}

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
              symbol: string
            }
          }[]
        }
      }
      supplyAssetsUsd: number | null
    }[]
  }
}

export class MorphoRewardFetcher extends BaseRewardFetcher {
  private readonly MORPHO_API_URL = 'https://blue-api.morpho.org/graphql'

  constructor(logger: Logger) {
    super(logger)
  }

  async getRewardRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    this.logger.info(
      `[MorphoRewardFetcher] Getting Morpho rewards for ${products.length} products on chain ${chainId}`,
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
                        symbol
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

      // Create a map for quick lookup
      const vaultMap = new Map(vaultItems.map((v) => [v.address.toLowerCase(), v]))

      return products.reduce(
        (acc, product) => {
          const vaultData = vaultMap.get(product.pool.toLowerCase())
          acc[product.id] = vaultData ? this.processMorphoVault(vaultData, chainId) : []
          return acc
        },
        {} as Record<string, RewardRate[]>,
      )
    } catch (error) {
      this.logger.error('[MorphoRewardFetcher] Error fetching Morpho rewards:', {
        error: error as Error,
      })
      return this.createEmptyResults(products)
    }
  }

  private processMorphoVault(vaultData: MorphoVaultReward, chainId: ChainId): RewardRate[] {
    if (!morphoTokenByChainId[chainId]) {
      return []
    }

    // Calculate total allocated assets in USD
    const totalAssetsAllocated = vaultData.state.allocation.reduce(
      (sum, alloc) => sum + (alloc.supplyAssetsUsd ?? 0),
      0,
    )

    // Calculate weighted rewards across all markets
    const weightedMorphoTokenRewardsApy =
      totalAssetsAllocated == 0
        ? []
        : vaultData.state.allocation.reduce((acc, allocation) => {
            const marketRewards = allocation.market.state.rewards
              .filter((reward) => reward.asset.symbol === 'MORPHO')
              .map((reward) => {
                return (
                  (reward.supplyApr ?? 0) *
                  ((allocation.supplyAssetsUsd ?? 0) / totalAssetsAllocated)
                )
              })

            return acc.concat(marketRewards)
          }, [] as number[])

    // Calculate total rewards APY
    const morphoTokenRewardsApy = weightedMorphoTokenRewardsApy.reduce(
      (sum, reward) => sum + reward,
      0,
    )

    // Create reward rates array
    const rewards = vaultData.state.rewards
      .map((reward, index) => {
        const supplyApr = this.validateAndParseNumber(reward.supplyApr ?? 0, 'supplyApr')
        if (supplyApr === null) return null

        return {
          rewardToken: reward.asset.address,
          rate: (supplyApr * 100).toString(), // Convert to percentage
          index,
          token: {
            address: reward.asset.address,
            symbol: reward.asset.symbol,
            decimals: reward.asset.decimals,
            precision: (10n ** BigInt(reward.asset.decimals)).toString(),
          },
        }
      })
      .filter((reward): reward is RewardRate => reward !== null)

    // Add Morpho token reward
    const morphoTokenAddress = morphoTokenByChainId[chainId]!
    const morphoRewardApr = morphoTokenRewardsApy > 10 ? 0 : morphoTokenRewardsApy * 100

    return [
      ...rewards,
      {
        rewardToken: morphoTokenAddress,
        rate: morphoRewardApr.toString(), // Convert to percentage
        index: rewards.length,
        token: {
          address: morphoTokenAddress,
          symbol: 'Morpho',
          decimals: 18,
          precision: (10n ** BigInt(18)).toString(),
        },
      },
    ]
  }
}
