import { request } from 'graphql-request'

import type { Address } from '@summerfi/serverless-shared'
import { ChainId, ProtocolId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { CollateralLockedDocument, GetInterestRatesDocument } from './types/graphql/generated'

const chainIdSubgraphMap: Partial<Record<ChainId, string>> = {
  [ChainId.MAINNET]: 'summer-oasis-history',
  [ChainId.BASE]: 'summer-oasis-history-base',
  [ChainId.OPTIMISM]: 'summer-oasis-history-optimism',
  [ChainId.ARBITRUM]: 'summer-oasis-history-arbitrum',
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
  token: Address
  protocol: ProtocolId.AAVE_V3 | ProtocolId.AAVE_V2 | ProtocolId.SPARK | ProtocolId.AAVE3
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

export interface AaveSparkInterestRateResult {
  protocol: ProtocolId.AAVE_V3 | ProtocolId.AAVE_V2 | ProtocolId.SPARK | ProtocolId.AAVE3
  token: {
    address: Address
    symbol: string
    decimals: bigint
  }
  interestRates: {
    borrow: InterestRate[]
    lend: InterestRate[]
  }
}

export type GetInterestRate = (
  params: GetInterestRateParams,
) => Promise<AaveSparkInterestRateResult>

async function getCollateralLocked(
  params: GetCollateralLockedParams,
  config: SubgraphClientConfig,
): Promise<CollateralLockedResult> {
  const url = getEndpoint(config.chainId, config.urlBase)
  const result = await request(url, CollateralLockedDocument, {
    collateralAddresses: params.collaterals.map((c) => c.address),
    block: params.blockNumber,
  })

  const mapped: CollateralLocked[] = result.positions.map((c) => ({
    collateral: c.collateralAddress as Address,
    amount: c.collateral,
    owner: c.proxy.owner as Address,
  }))

  return {
    lockedCollaterals: mapped,
  }
}

const protocolIdToSubgraphProtocol = (protocolId: ProtocolId) => {
  switch (protocolId) {
    case ProtocolId.AAVE_V2:
      return 'aave_v2'
    case ProtocolId.AAVE_V3:
    case ProtocolId.AAVE3:
      return 'aave_v3'
    case ProtocolId.SPARK:
      return 'spark'
    default:
      throw new Error(`Unsupported protocolId ${protocolId}`)
  }
}

async function getInterestRates(
  params: GetInterestRateParams,
  config: SubgraphClientConfig,
): Promise<AaveSparkInterestRateResult> {
  const url = getEndpoint(config.chainId, config.urlBase)
  const protocol = protocolIdToSubgraphProtocol(params.protocol)
  config.logger?.info('Fetching interest rates', { url, params })
  let skip = 0
  const first = 1000
  const result = await request(url, GetInterestRatesDocument, {
    token: params.token.toLowerCase(),
    tokenBytes: params.token.toLowerCase(),
    fromTimestamp: params.fromTimestamp.toFixed(),
    toTimestamp: params.toTimestamp.toFixed(),
    protocol: protocol,
    skip,
    first,
  })

  const token = result.token

  if (token == null) {
    config.logger?.warn('No token found for provided token', { token: params.token })
    return {
      protocol: params.protocol,
      token: {
        address: `0x0`,
        symbol: 'UNKNOWN',
        decimals: 0n,
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
    token: params.token,
    tokenSymbol: token.symbol,
  })

  let interestRatesRequests = 1
  while (currentResponseInterestRates === first) {
    if (interestRatesRequests > 10) {
      throw new Error('Too many requests')
    }
    skip = skip + first
    const nextResult = await request(url, GetInterestRatesDocument, {
      token: params.token.toLowerCase(),
      tokenBytes: params.token.toLowerCase(),
      fromTimestamp: params.fromTimestamp.toFixed(),
      toTimestamp: params.toTimestamp.toFixed(),
      protocol: protocol,
      skip,
      first,
    })

    interestRatesRequests++

    config.logger?.info('Next Interest rates found', {
      length: nextResult.interestRates.length,
      totalLength: interestRates.length,
      token: params.token,
      tokenSymbol: token.symbol,
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
    if (rate.type === 'borrow-variable') {
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
    protocol: params.protocol,
    token: {
      address: params.token,
      symbol: token.symbol,
      decimals: token.decimals,
    },
    interestRates: {
      lend,
      borrow,
    },
  }
}

export interface AaveSparkSubgraphClient {
  getCollateralLocked: GetCollateralLocked
  getInterestRate: GetInterestRate
}

export function getAaveSparkSubgraphClient(config: SubgraphClientConfig): AaveSparkSubgraphClient {
  return {
    getCollateralLocked: (params: GetCollateralLockedParams) => getCollateralLocked(params, config),
    getInterestRate: (params: GetInterestRateParams) => getInterestRates(params, config),
  }
}
