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
 * @param {Object} params - The parameters for the function.
 * @param {Object} params.timestamps - The timestamps from which to fetch the latest rebalance activities.
 * @param {Object} params.clients - The GraphQL clients for the different networks.
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
  timestamps,
  clients,
}: {
  timestamps: {
    mainnet: string
    base: string
    arbitrum: string
    sonic: string
    hyperliquid: string
  }
  clients: {
    mainnetGraphQlClient: GraphQLClient
    baseGraphQlClient: GraphQLClient
    arbitrumGraphQlClient: GraphQLClient
    sonicGraphQlClient: GraphQLClient
    hyperliquidGraphQlClient: GraphQLClient
  }
}): Promise<RebalanceActivity[]> => {
  const [
    mainnetRebalances,
    baseRebalances,
    arbitrumRebalances,
    sonicRebalances,
    hyperliquidRebalances,
  ] = await Promise.all([
    fetchAllRebalanceActivities(clients.mainnetGraphQlClient, timestamps.mainnet),
    fetchAllRebalanceActivities(clients.baseGraphQlClient, timestamps.base),
    fetchAllRebalanceActivities(clients.arbitrumGraphQlClient, timestamps.arbitrum),
    fetchAllRebalanceActivities(clients.sonicGraphQlClient, timestamps.sonic),
    fetchAllRebalanceActivities(clients.hyperliquidGraphQlClient, timestamps.hyperliquid),
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
    ...sonicRebalances.rebalances.map((rebalance) => ({
      ...rebalance,
      actionType: rebalancesActionTypeMapper(rebalance),
    })),
    ...hyperliquidRebalances.rebalances.map((rebalance) => ({
      ...rebalance,
      actionType: rebalancesActionTypeMapper(rebalance),
    })),
  ].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
}
