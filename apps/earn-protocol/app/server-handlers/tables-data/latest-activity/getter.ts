import { type GraphQLClient } from 'graphql-request'

import { type LatestActivity } from '@/app/server-handlers/tables-data/latest-activity/types'

import { fetchAllLatestActivities } from './fetcher'

/**
 * Fetches all the latest deposit and withdraw activities from multiple networks (Mainnet, Base, Arbitrum).
 *
 * This function fetches the latest activity data (deposits and withdraws) from three different networks
 * using GraphQL clients. It combines the activities, adds a `type` property to each item to distinguish
 * between deposits and withdraws, and sorts them in descending order by timestamp.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Object} params.timestamps - The timestamps from which to fetch the latest activities.
 * @param {Object} params.clients - The GraphQL clients for the different networks.
 * @returns {Promise<LatestActivity[]>} - A promise that resolves to an array of latest activities from all networks.
 *
 * @example
 * const activities = await getAllLatestActivities({
 *   timestamps: {
 *     mainnet: '1620000000',
 *     base: '1620000000',
 *     arbitrum: '1620000000',
 *     sonic: '1620000000',
 *     hyperliquid: '1620000000',
 *   },
 *   clients: {
 *     mainnetGraphQlClient,
 *     baseGraphQlClient,
 *     arbitrumGraphQlClient,
 *     sonicGraphQlClient,
 *     hyperliquidGraphQlClient,
 *   },
 * })
 */
export const getAllLatestActivities = async ({
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
}): Promise<LatestActivity[]> => {
  const results = await Promise.allSettled([
    fetchAllLatestActivities(clients.mainnetGraphQlClient, timestamps.mainnet),
    fetchAllLatestActivities(clients.baseGraphQlClient, timestamps.base),
    fetchAllLatestActivities(clients.arbitrumGraphQlClient, timestamps.arbitrum),
    fetchAllLatestActivities(clients.sonicGraphQlClient, timestamps.sonic),
    fetchAllLatestActivities(clients.hyperliquidGraphQlClient, timestamps.hyperliquid),
  ])

  const [
    mainnetActivities,
    baseActivities,
    arbitrumActivities,
    sonicActivities,
    hyperliquidActivities,
  ] = results.map((result) =>
    result.status === 'fulfilled' ? result.value : { deposits: [], withdraws: [] },
  )

  // Combine all new activities from different networks and add type property
  return [
    ...mainnetActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...baseActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...arbitrumActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...sonicActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...hyperliquidActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...mainnetActivities.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
    ...baseActivities.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
    ...arbitrumActivities.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
    ...sonicActivities.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
    ...hyperliquidActivities.withdraws.map((withdraw) => ({
      ...withdraw,
      type: 'withdraw' as const,
    })),
  ].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
}
