import { request } from 'graphql-request'

import type { Address } from '@summerfi/serverless-shared'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { CollateralLockedDocument, GetInterestRatesDocument } from './types/graphql/generated'

const chainIdSubgraphMap: Partial<Record<ChainId, string>> = {
  [ChainId.MAINNET]: 'summer-ajna-v2',
  [ChainId.BASE]: 'summer-ajna-v2-base',
  [ChainId.OPTIMISM]: 'summer-ajna-v2-optimism',
  [ChainId.ARBITRUM]: 'summer-ajna-v2-arbitrum',
}

const getEndpoint = (chainId: ChainId, baseUrl: string) => {
  const subgraph = chainIdSubgraphMap[chainId]
  if (!subgraph) {
    throw new Error(`No subgraph for chainId ${chainId}`)
  }
  return `${baseUrl}/${subgraph}`
}
interface SubgraphClientConfig {
  chainId: ChainId
  urlBase: string
  logger?: Logger
}

export interface GetCollateralLockedParams {
  collaterals: { address: Address; decimals: number }[]
  blockNumber: number
}

export interface CollateralLocked {
  collateral: Address
  amount: string
  owner: Address
}

export interface CollateralLockedResult {
  lockedCollaterals: CollateralLocked[]
}

export type GetCollateralLocked = (
  params: GetCollateralLockedParams,
) => Promise<CollateralLockedResult>

export interface GetInterestRateParams {
  poolId: `0x${string}`
  fromTimestamp: number
  toTimestamp: number
}

export interface InterestRate {
  rate: number
  type: 'borrow' | 'lend'
  toTimestamp: number
  fromTimestamp: number
  duration: number
}

export interface AjnaPoolInterestRateResult {
  poolId: `0x${string}`
  collateralToken: {
    symbol: string
    address: Address
  }
  quoteToken: {
    symbol: string
    address: Address
  }
  interestRates: {
    borrow: InterestRate[]
    lend: InterestRate[]
  }
}

export type GetInterestRate = (params: GetInterestRateParams) => Promise<AjnaPoolInterestRateResult>

async function getCollateralLocked(
  params: GetCollateralLockedParams,
  config: SubgraphClientConfig,
): Promise<CollateralLockedResult> {
  const url = getEndpoint(config.chainId, config.urlBase)
  const result = await request(url, CollateralLockedDocument, {
    collateralAddresses: params.collaterals.map((c) => c.address),
    block: params.blockNumber,
  })

  const mapped: CollateralLocked[] = result.borrowPositions.map((c) => ({
    collateral: c.pool.collateralToken?.address as Address,
    amount: c.collateral.toString(),
    owner: (c.account?.user.address ?? `0x0`) as Address,
  }))

  return {
    lockedCollaterals: mapped,
  }
}

async function getInterestRates(
  params: GetInterestRateParams,
  config: SubgraphClientConfig,
): Promise<AjnaPoolInterestRateResult> {
  const url = getEndpoint(config.chainId, config.urlBase)
  config.logger?.info('Fetching interest rates', { url, params })
  let skip = 0
  const first = 1000
  const result = await request(url, GetInterestRatesDocument, {
    poolId: params.poolId.toLowerCase(),
    poolIdBytes: params.poolId.toLowerCase(),
    fromTimestamp: params.fromTimestamp.toFixed(),
    toTimestamp: params.toTimestamp.toFixed(),
    skip,
    first,
  })

  const pool = result.pool

  if (pool == null) {
    config.logger?.warn('No pool found for poolId', { poolId: params.poolId })
    return {
      poolId: params.poolId,
      collateralToken: {
        symbol: 'UNKNOWN',
        address: '0x0',
      },
      quoteToken: {
        symbol: 'UNKNOWN',
        address: '0x0',
      },
      interestRates: {
        borrow: [],
        lend: [],
      },
    }
  }

  const previousBorrowRate = result.previousBorrowRate[0]
  const previousLendRate = result.previousLendRate[0]

  let currentResponseInterestRates = result.interestRates.length

  const interestRates = [...result.interestRates]

  config.logger?.info('Interest rates found', {
    length: result.interestRates.length,
    totalLength: interestRates.length,
    poolId: params.poolId,
    collateralToken: pool.collateralToken?.symbol,
    debtToken: pool.quoteToken?.symbol,
  })

  let interestRatesRequests = 1
  while (currentResponseInterestRates === first) {
    if (interestRatesRequests > 10) {
      throw new Error('Too many requests')
    }
    skip = skip + first
    const nextResult = await request(url, GetInterestRatesDocument, {
      poolId: params.poolId.toLowerCase(),
      poolIdBytes: params.poolId.toLowerCase(),
      fromTimestamp: params.fromTimestamp.toFixed(),
      toTimestamp: params.toTimestamp.toFixed(),
      skip,
      first,
    })

    interestRatesRequests++

    config.logger?.info('Next Interest rates found', {
      length: nextResult.interestRates.length,
      totalLength: interestRates.length,
      poolId: params.poolId,
      collateralToken: pool.collateralToken?.symbol,
      debtToken: pool.quoteToken?.symbol,
      requestCount: interestRatesRequests,
    })

    interestRates.push(...nextResult.interestRates)

    currentResponseInterestRates = nextResult.interestRates.length
  }

  const acc = { borrow: [], lend: [] } as {
    borrow: Omit<InterestRate, 'duration' | 'toTimestamp'>[]
    lend: Omit<InterestRate, 'duration' | 'toTimestamp'>[]
  }

  if (previousBorrowRate) {
    acc.borrow.push({
      rate: Number(previousBorrowRate.rate),
      type: 'borrow',
      fromTimestamp: params.fromTimestamp,
    })
  }

  if (previousLendRate) {
    acc.lend.push({
      rate: Number(previousLendRate.rate),
      type: 'lend',
      fromTimestamp: params.fromTimestamp,
    })
  }

  const mapped = interestRates.reduce((acc, rate) => {
    if (rate.type === 'borrow') {
      acc.borrow.push({
        rate: Number(rate.rate),
        type: 'borrow' as const,
        fromTimestamp: Number(rate.timestamp),
      })
    }
    if (rate.type === 'lend') {
      acc.lend.push({
        rate: Number(rate.rate),
        type: 'lend' as const,
        fromTimestamp: Number(rate.timestamp),
      })
    }

    return acc
  }, acc)

  const lend = mapped.lend
    .sort((a, b) => a.fromTimestamp - b.fromTimestamp)
    .map((rate, index): InterestRate => {
      const nextRate = mapped.lend[index + 1]
      const duration = nextRate
        ? nextRate.fromTimestamp - rate.fromTimestamp
        : params.toTimestamp - rate.fromTimestamp

      return {
        ...rate,
        duration,
        toTimestamp: nextRate?.fromTimestamp ?? params.toTimestamp,
      }
    })

  const borrow = mapped.borrow
    .sort((a, b) => a.fromTimestamp - b.fromTimestamp)
    .map((rate, index): InterestRate => {
      const nextRate = mapped.borrow[index + 1]
      const duration = nextRate
        ? nextRate.fromTimestamp - rate.fromTimestamp
        : params.toTimestamp - rate.fromTimestamp

      return {
        ...rate,
        duration,
        toTimestamp: nextRate?.fromTimestamp ?? params.toTimestamp,
      }
    })

  return {
    poolId: pool.id as `0x${string}`,
    collateralToken: {
      symbol: pool.collateralToken!.symbol,
      address: pool.collateralToken!.address as Address,
    },
    quoteToken: {
      symbol: pool.quoteToken!.symbol,
      address: pool.quoteToken!.address as Address,
    },
    interestRates: {
      lend,
      borrow,
    },
  }
}

export interface AjnaSubgraphClient {
  getCollateralLocked: GetCollateralLocked
  getInterestRate: GetInterestRate
}

export function getAjnaSubgraphClient(config: SubgraphClientConfig): AjnaSubgraphClient {
  return {
    getCollateralLocked: (params: GetCollateralLockedParams) => getCollateralLocked(params, config),
    getInterestRate: (params: GetInterestRateParams) => getInterestRates(params, config),
  }
}
