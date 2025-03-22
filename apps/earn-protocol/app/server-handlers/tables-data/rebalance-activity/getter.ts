import { SDKNetwork } from '@summerfi/app-types'
import { type GraphQLClient } from 'graphql-request'

import { fetchAllRebalanceActivities } from './fetcher'
import { rebalancesActionTypeMapper } from './helpers'
import { type RebalanceActivity } from './types'

/**
 * Fetches all rebalance activities from multiple networks (Mainnet, Base, Arbitrum) and maps each
 * rebalance activity with an action type.
 *
 * This function fetches the rebalance activities from three different networks using GraphQL clients.
 * It combines the activities, adds an `actionType` property to each rebalance (using a helper function),
 * and sorts the activities in descending order by timestamp.
 *
 * @param {string} lastTimestamp - The timestamp from which to fetch the latest rebalance activities.
 * @param {GraphQLClient} mainnetGraphQlClient - The GraphQL client for the Mainnet network.
 * @param {GraphQLClient} baseGraphQlClient - The GraphQL client for the Base network.
 * @param {GraphQLClient} arbitrumGraphQlClient - The GraphQL client for the Arbitrum network.
 * @returns {Promise<RebalanceActivity[]>} - A promise that resolves to an array of rebalance activities from all networks, each having an `actionType` property.
 *
 * @example
 * const rebalanceActivities = await getAllRebalanceActivities({
 *   lastTimestamp: '1620000000',
 *   mainnetGraphQlClient,
 *   baseGraphQlClient,
 *   arbitrumGraphQlClient
 * })
 */
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
