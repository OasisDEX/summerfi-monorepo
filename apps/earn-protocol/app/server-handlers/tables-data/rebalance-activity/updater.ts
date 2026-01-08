import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type GraphQLClient } from 'graphql-request'

import { getLatestTimestamp } from '@/app/server-handlers/tables-data/helpers'

import { getAllRebalanceActivities } from './getter'
import { insertRebalanceActivitiesInBatches } from './inserter'

const table = 'rebalanceActivity'

/**
 * Updates the rebalance activities by fetching the latest data and inserting it into the database in batches.
 *
 * @param db - The database instance for performing insert operations.
 * @param mainnetGraphQlClient - The GraphQL client instance for the mainnet.
 * @param baseGraphQlClient - The GraphQL client instance for the base network.
 * @param arbitrumGraphQlClient - The GraphQL client instance for the arbitrum network.
 * @param sonicGraphQlClient - The GraphQL client instance for the sonic network.
 * @param hyperliquidGraphQlClient - The GraphQL client instance for the hyperliquid network.
 *
 * @returns {Promise<{ updated: number, startingFrom: string, duration: string }>} - A promise that resolves to an object containing:
 *   - `updated`: The number of rows inserted or updated in the database.
 *   - `startingFrom`: The timestamp from which the activities were fetched.
 *   - `duration`: The time it took to fetch and insert the activities, in seconds.
 *
 */
export const updateRebalanceActivity = async ({
  db,
  mainnetGraphQlClient,
  baseGraphQlClient,
  arbitrumGraphQlClient,
  sonicGraphQlClient,
  hyperliquidGraphQlClient,
}: {
  db: SummerProtocolDB['db']
  mainnetGraphQlClient: GraphQLClient
  baseGraphQlClient: GraphQLClient
  arbitrumGraphQlClient: GraphQLClient
  sonicGraphQlClient: GraphQLClient
  hyperliquidGraphQlClient: GraphQLClient
}) => {
  const startTime = Date.now()
  const [
    latestRebalanceActivityMainnet,
    latestRebalanceActivityBase,
    latestRebalanceActivityArbitrum,
    latestRebalanceActivitySonic,
    latestRebalanceActivityHyperliquid,
  ] = await Promise.all([
    getLatestTimestamp({ network: 'mainnet', db, table }),
    getLatestTimestamp({ network: 'base', db, table }),
    getLatestTimestamp({ network: 'arbitrum', db, table }),
    getLatestTimestamp({ network: 'sonic', db, table }),
    getLatestTimestamp({ network: 'hyperliquid', db, table }),
  ])

  const allRebalanceActivities = await getAllRebalanceActivities({
    timestamps: {
      mainnet: latestRebalanceActivityMainnet,
      base: latestRebalanceActivityBase,
      arbitrum: latestRebalanceActivityArbitrum,
      sonic: latestRebalanceActivitySonic,
      hyperliquid: latestRebalanceActivityHyperliquid,
    },
    clients: {
      mainnetGraphQlClient,
      baseGraphQlClient,
      arbitrumGraphQlClient,
      sonicGraphQlClient,
      hyperliquidGraphQlClient,
    },
  })

  const { updated } = await insertRebalanceActivitiesInBatches(db, allRebalanceActivities)

  const endTime = Date.now()
  const duration = `${((endTime - startTime) / 1000).toFixed(2)}s`

  return {
    updated,
    startingFrom: {
      mainnet: latestRebalanceActivityMainnet,
      base: latestRebalanceActivityBase,
      arbitrum: latestRebalanceActivityArbitrum,
      sonic: latestRebalanceActivitySonic,
      hyperliquid: latestRebalanceActivityHyperliquid,
    },
    duration,
  }
}
