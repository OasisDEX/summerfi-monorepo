import { request } from 'graphql-request'

import { ChainId } from '@summerfi/serverless-shared'
import type { Address } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { CollateralLockedDocument } from './types/graphql/generated'

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

/**
 * The key of the first record is the owner of the collaterals, second record is the collateral address
 */
export type CollateralLockedRecord = Record<Address, Record<Address, CollateralLocked>>

export interface CollateralLockedResult {
  lockedCollaterals: CollateralLocked[]
}

export type GetCollateralLocked = (
  params: GetCollateralLockedParams,
) => Promise<CollateralLockedResult>

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

export interface AaveSparkSubgraphClient {
  getCollateralLocked: GetCollateralLocked
}

export function getAaveSparkSubgraphClient(config: SubgraphClientConfig): AaveSparkSubgraphClient {
  return {
    getCollateralLocked: (params: GetCollateralLockedParams) => getCollateralLocked(params, config),
  }
}
