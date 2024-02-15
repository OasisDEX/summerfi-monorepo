import request from 'graphql-request'
import { PricesDocument, PricesQuery } from './types/graphql/generated'
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

export type LatestPrice = Required<
  Pick<
    PricesQuery['derivedPrices'][0],
    'denomination' | 'token' | 'tokenRoundId' | 'denominationRoundId'
  >
>
export type GetLatestPrice = (params: GetLatestPriceParams) => Promise<LatestPrice | undefined>

async function getLatestPrice(
  params: GetLatestPriceParams,
  config: SubgraphClientConfig,
): Promise<LatestPrice | undefined> {
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

export interface AutomationSubgraphClient {
  getLatestPrice: GetLatestPrice
}

export function getPricesSubgraphClient(config: SubgraphClientConfig): AutomationSubgraphClient {
  return {
    getLatestPrice: (params: GetLatestPriceParams) => getLatestPrice(params, config),
  }
}
