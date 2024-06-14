import { request } from 'graphql-request'

import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@summerfi/abstractions'
import {
  SummerPointsDocument,
  SummerPointsQuery,
  SummerPointsQueryVariables,
} from './types/graphql/generated'

const chainIdSubgraphMap: Partial<Record<ChainId, string>> = {
  [ChainId.MAINNET]: 'summer-events',
  [ChainId.BASE]: 'summer-events-base',
  [ChainId.OPTIMISM]: 'summer-events-optimism',
  [ChainId.ARBITRUM]: 'summer-events-arbitrum',
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

export interface GetUsersPointsParams {
  startTimestamp: number // In seconds.
  endTimestamp: number // In seconds.
}

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number]
export type User = ArrayElement<SummerPointsQuery['users']>
export type Position = ArrayElement<User['positions']>
export type MigrationEvent = ArrayElement<Position['migration']>
export type RecentSwapInPosition = ArrayElement<Position['recentSwaps']>
export type RecentSwapInUser = ArrayElement<User['recentSwaps']>
export type UsersData = SummerPointsQuery['users']

export interface GetUsersPointsResult {
  users: User[]
}

export type GetUsersPoints = (params: GetUsersPointsParams) => Promise<GetUsersPointsResult>

export const START_POINTS_TIMESTAMP = 1718841600
export const STAGING_START_POINTS_TIMESTAMP = 1718884800

async function getUsersPoints(
  params: GetUsersPointsParams,
  config: SubgraphClientConfig,
): Promise<GetUsersPointsResult> {
  const url = getEndpoint(config.chainId, config.urlBase)
  const first = 1000
  let lastId = ''
  const results: SummerPointsQuery = { users: [] }

  const { startTimestamp, endTimestamp } = params

  let data: SummerPointsQuery
  do {
    const variables: SummerPointsQueryVariables = {
      first,
      lastId, // Use lastID as the id_gt parameter
      startTimestamp,
      endTimestamp,
      pointsStartTimestamp: START_POINTS_TIMESTAMP,
    }

    data = await request(url, SummerPointsDocument, variables)
    results.users.push(...data.users)

    // Set lastID to the ID of the last item in the fetched data
    lastId = data.users[data.users.length - 1].id
  } while (data.users.length >= first)

  return {
    users: results.users,
  }
}

export interface SummerPointsSubgraphClient {
  getUsersPoints: GetUsersPoints
}

export function getSummerPointsSubgraphClient(
  config: SubgraphClientConfig,
): SummerPointsSubgraphClient {
  return {
    getUsersPoints: (params: GetUsersPointsParams) => getUsersPoints(params, config),
  }
}
