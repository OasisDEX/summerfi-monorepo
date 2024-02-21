import request from 'graphql-request'
import {
  MaxPriceFromDocument,
  PriceByRoundIdsDocument,
  PricesDocument,
  PricesQuery,
} from './types/graphql/generated'
import { Address, ChainId } from '@summerfi/serverless-shared/domain-types'
import { Logger } from '@aws-lambda-powertools/logger'

const chainIdSubgraphMap: Partial<Record<ChainId, string>> = {
  [ChainId.ARBITRUM]: 'prices-arbitrum',
  [ChainId.MAINNET]: 'prices',
  [ChainId.OPTIMISM]: 'prices-optimism',
  [ChainId.BASE]: 'prices-base',
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

export interface GetLatestPriceParams {
  token: Address
  denomination: Address
}

export interface GetMaxPriceParams {
  token: Address
  denomination: Address
  from: bigint
}

export interface GetPriceByRoundIdsParams {
  tokenRoundId: bigint
  denominationRoundId: bigint
}

export type DerivedPrices = Required<
  Pick<
    PricesQuery['derivedPrices'][0],
    'denomination' | 'token' | 'tokenRoundId' | 'denominationRoundId' | 'derivedPrice'
  >
>
export type GetLatestPrice = (params: GetLatestPriceParams) => Promise<DerivedPrices | undefined>
export type GetMaxPrice = (params: GetMaxPriceParams) => Promise<DerivedPrices | undefined>
export type GetPriceByRoundIds = (
  params: GetPriceByRoundIdsParams,
) => Promise<DerivedPrices | undefined>

async function getLatestPrice(
  params: GetLatestPriceParams,
  config: SubgraphClientConfig,
): Promise<DerivedPrices | undefined> {
  const url = getEndpoint(config.chainId, config.urlBase)
  config.logger?.info('Fetching latest price for', {
    token: params.token,
    denomination: params.denomination,
    url,
  })
  const prices = await request(url, PricesDocument, {
    token: params.token,
    denomination: params.denomination,
  })

  const price = prices.derivedPrices[0]

  config.logger?.debug('Received latest price for', {
    token: params.token,
    denomination: params.denomination,
    price,
  })

  return price
}

async function getMaxPrice(
  params: GetMaxPriceParams,
  config: SubgraphClientConfig,
): Promise<DerivedPrices | undefined> {
  const url = getEndpoint(config.chainId, config.urlBase)
  config.logger?.info('Fetching max price for', {
    token: params.token,
    denomination: params.denomination,
    from: params.from,
    url,
  })
  const prices = await request(url, MaxPriceFromDocument, {
    token: params.token,
    denomination: params.denomination,
    from: params.from,
  })

  const price = prices.derivedPrices[0]

  config.logger?.debug('Received max price for', {
    token: params.token,
    denomination: params.denomination,
    from: params.from,
    price,
  })

  return price
}

async function getPriceByRoundIds(params: GetPriceByRoundIdsParams, config: SubgraphClientConfig) {
  const url = getEndpoint(config.chainId, config.urlBase)
  config.logger?.info('Fetching price by round ids for', {
    tokenRoundId: params.tokenRoundId.toString(),
    denominationRoundId: params.denominationRoundId.toString(),
    url,
  })
  const prices = await request(url, PriceByRoundIdsDocument, {
    tokenRoundId: params.tokenRoundId.toString(),
    denominationRoundId: params.denominationRoundId.toString(),
  })

  const price = prices.derivedPrices[0]

  config.logger?.debug('Received price by round ids for', {
    tokenRoundId: params.tokenRoundId.toString(),
    denominationRoundId: params.denominationRoundId.toString(),
    price,
  })

  return price
}

export interface PricesSubgraphClient {
  getLatestPrice: GetLatestPrice
  getMaxPrice: GetMaxPrice
  getPriceByRoundIds: GetPriceByRoundIds
}

export function getPricesSubgraphClient(config: SubgraphClientConfig): PricesSubgraphClient {
  return {
    getLatestPrice: (params: GetLatestPriceParams) => getLatestPrice(params, config),
    getMaxPrice: (params: GetMaxPriceParams) => getMaxPrice(params, config),
    getPriceByRoundIds: (params: GetPriceByRoundIdsParams) => getPriceByRoundIds(params, config),
  }
}
