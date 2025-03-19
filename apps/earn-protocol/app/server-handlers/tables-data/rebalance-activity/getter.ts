import { SDKNetwork } from '@summerfi/app-types'
import { type GraphQLClient } from 'graphql-request'

import { fetchAllRebalanceActivities } from './fetcher'
import { rebalancesActionTypeMapper } from './helpers'
import { type RebalanceActivity } from './types'

export const getAllRebalanceActivities = async ({
  lastTimestamp,
  mainnetGraphQlClient,
  baseGraphQlClient,
  arbitrumGraphQlClient,
}: {
  lastTimestamp: string
  mainnetGraphQlClient: GraphQLClient
  baseGraphQlClient: GraphQLClient
  arbitrumGraphQlClient: GraphQLClient
}): Promise<RebalanceActivity[]> => {
  const [mainnetRebalances, baseRebalances, arbitrumRebalances] = await Promise.all([
    fetchAllRebalanceActivities(mainnetGraphQlClient, lastTimestamp, SDKNetwork.Mainnet),
    fetchAllRebalanceActivities(baseGraphQlClient, lastTimestamp, SDKNetwork.Base),
    fetchAllRebalanceActivities(arbitrumGraphQlClient, lastTimestamp, SDKNetwork.ArbitrumOne),
  ])

  // Combine all new activities from different networks and add type property
  return [
    ...mainnetRebalances.rebalances.map((rebalance) => ({
      ...rebalance,
      actionType: rebalancesActionTypeMapper(rebalance),
    })),
    ...baseRebalances.rebalances.map((rebalance) => ({
      ...rebalance,
      actionType: rebalancesActionTypeMapper(rebalance),
    })),
    ...arbitrumRebalances.rebalances.map((rebalance) => ({
      ...rebalance,
      actionType: rebalancesActionTypeMapper(rebalance),
    })),
  ].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
}
