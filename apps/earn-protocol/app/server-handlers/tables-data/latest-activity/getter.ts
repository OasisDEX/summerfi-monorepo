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
 * @param {string} lastTimestamp - The timestamp from which to fetch the latest activities.
 * @param {GraphQLClient} mainnetGraphQlClient - The GraphQL client for the Mainnet network.
 * @param {GraphQLClient} baseGraphQlClient - The GraphQL client for the Base network.
 * @param {GraphQLClient} arbitrumGraphQlClient - The GraphQL client for the Arbitrum network.
 * @returns {Promise<LatestActivity[]>} - A promise that resolves to an array of latest activities from all networks.
 *
 * @example
 * const activities = await getAllLatestActivities({
 *   lastTimestamp: '1620000000',
 *   mainnetGraphQlClient,
 *   baseGraphQlClient,
 *   arbitrumGraphQlClient
 * })
 */
export const getAllLatestActivities = async ({
  lastTimestamp,
  mainnetGraphQlClient,
  baseGraphQlClient,
  arbitrumGraphQlClient,
  sonicGraphQlClient,
}: {
  lastTimestamp: string
  mainnetGraphQlClient: GraphQLClient
  baseGraphQlClient: GraphQLClient
  arbitrumGraphQlClient: GraphQLClient
  sonicGraphQlClient: GraphQLClient
}): Promise<LatestActivity[]> => {
  const results = await Promise.allSettled([
    fetchAllLatestActivities(mainnetGraphQlClient, lastTimestamp),
    fetchAllLatestActivities(baseGraphQlClient, lastTimestamp),
    fetchAllLatestActivities(arbitrumGraphQlClient, lastTimestamp),
    fetchAllLatestActivities(sonicGraphQlClient, lastTimestamp),
  ])

  const [mainnetActivities, baseActivities, arbitrumActivities, sonicActivities] = results.map(
    (result) => (result.status === 'fulfilled' ? result.value : { deposits: [], withdraws: [] }),
  )

  // Combine all new activities from different networks and add type property
  return [
    ...mainnetActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...baseActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...arbitrumActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...sonicActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...mainnetActivities.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
    ...baseActivities.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
    ...arbitrumActivities.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
    ...sonicActivities.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
  ].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
}
