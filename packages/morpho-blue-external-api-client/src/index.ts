import { request } from 'graphql-request'

import { Logger } from '@aws-lambda-powertools/logger'
import { Address } from '@summerfi/serverless-shared'
import { MetaMorphoDetailsDocument } from './types/graphql/generated'

const ApiUrl = 'https://blue-api.morpho.org/graphql'

export interface MorphoBlueApiConfig {
  logger?: Logger
}

export interface GetVaultDetailsParams {
  metaMorphoAddresses: Address[]
}

export interface MorphoAsset {
  address: Address
  symbol: string
  decimals: number
  priceUsd: number | undefined
}
export interface MorphoMarket {
  marketId: `0x${string}`
  collateral: MorphoAsset
  liquidationLtv: number
  loan: MorphoAsset
}

export interface MetaMorphoVaultAllocation {
  market: MorphoMarket
  allocation: number
}

export interface MetaMorphoVault {
  address: Address
  weeklyApy: number
  monthlyApy: number
  dailyApy: number
  apy: number
  fee: number
  totalAssets: bigint
  asset: {
    address: Address
    symbol: string
    decimals: number
    priceUsd: number | undefined
  }
}

export interface MetaMorphoAllocations {
  vault: MetaMorphoVault
  allocations: MetaMorphoVaultAllocation[]
}

const getVaultAllocations = async (
  { metaMorphoAddresses }: GetVaultDetailsParams,
  { logger }: MorphoBlueApiConfig,
): Promise<MetaMorphoAllocations[]> => {
  const result = await request(ApiUrl, MetaMorphoDetailsDocument, {
    metaMorphoAddresses: metaMorphoAddresses,
  })

  const vaults = result.vaults.items
  if (vaults == null) {
    logger?.warn('No vaults found for the given addresses', { metaMorphoAddresses })
    return []
  }

  const markets = result.markets.items

  if (markets == null) {
    logger?.warn('No markets found for the given vaults')
    return []
  }

  return vaults
    .map((vault) => {
      return {
        vault: {
          address: vault.address as Address,
          dailyApy: vault.dailyApy ?? 0,
          weeklyApy: vault.weeklyApy ?? 0,
          monthlyApy: vault.monthlyApy ?? 0,
          apy: vault.state?.apy ?? 0,
          fee: vault.state?.fee ?? 0,
          totalAssets: vault.state?.totalAssets ?? 0n,
          asset: {
            address: vault.asset.address as Address,
            symbol: vault.asset.symbol,
            decimals: vault.asset.decimals,
            priceUsd: vault.asset.priceUsd ?? undefined,
          },
        },
        allocations: vault.state?.allocation
          ? vault.state.allocation
              .filter((allocation) => allocation.supplyAssets > 0)
              .map((allocation) => {
                const market = markets.find((m) => m.id === allocation.market.id)
                if (market == null) {
                  throw new Error(`No market found for allocation ${allocation.id}`)
                }

                logger?.debug('Found allocation', {
                  market: market.uniqueKey,
                  collateral: market.collateralAsset?.symbol,
                  debt: market.loanAsset?.symbol,
                  allocation: allocation.supplyAssets,
                })

                if (market.collateralAsset == null || market.loanAsset == null) {
                  throw new Error(`Market ${market.id} has no collateral or loan asset`)
                }

                const resultMarket: MorphoMarket = {
                  marketId: market.uniqueKey as `0x${string}`,
                  liquidationLtv: Number(market.lltv) / 10 ** market.collateralAsset.decimals,
                  collateral: {
                    address: market.collateralAsset.address as Address,
                    symbol: market.collateralAsset.symbol,
                    priceUsd: market.collateralAsset.priceUsd ?? undefined,
                    decimals: market.collateralAsset.decimals,
                  },
                  loan: {
                    address: market.loanAsset.address as Address,
                    symbol: market.loanAsset.symbol,
                    priceUsd: market.loanAsset.priceUsd ?? undefined,
                    decimals: market.loanAsset.decimals,
                  },
                }
                return {
                  market: resultMarket,
                  supplyAssets: BigInt(allocation.supplyAssets),
                }
              })
          : [],
      }
    })
    .map((vault): MetaMorphoAllocations => {
      const totalAllocation = vault.allocations.reduce(
        (acc, allocation) => acc + allocation.supplyAssets,
        0n,
      )

      logger?.debug('Total allocation for vault', { totalAllocation, vault: vault.vault.address })

      return {
        ...vault,
        allocations: vault.allocations.map((allocation) => {
          return {
            market: allocation.market,
            allocation: Number((allocation.supplyAssets * 10_000n) / totalAllocation) / 10_000,
          }
        }),
      }
    })
}

export interface MorphoBlueApiClient {
  allocations: (params: GetVaultDetailsParams) => Promise<MetaMorphoAllocations[]>
}

export function getMorphoBlueApiClient(config: MorphoBlueApiConfig): MorphoBlueApiClient {
  return {
    allocations: (params: GetVaultDetailsParams) => getVaultAllocations(params, config),
  }
}
