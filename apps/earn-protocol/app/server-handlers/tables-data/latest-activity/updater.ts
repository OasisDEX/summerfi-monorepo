import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type GraphQLClient } from 'graphql-request'

import { getLatestTimestamp } from '@/app/server-handlers/tables-data/helpers'

import { fetchAllLatestActivities } from './fetcher'
import { getAllLatestActivities } from './getter'
import { insertLatestActivitiesInBatches } from './inserter'

const table = 'latestActivity'

/**
 * Updates the latest activities in the database by fetching and inserting them in batches.
 *
 * This function retrieves the most recent timestamp from the database, fetches new activities since that timestamp
 * from multiple GraphQL endpoints, and inserts the fetched activities into the database. The insertion is done in batches
 * to optimize performance.
 *
 * @param {Object} params - The parameters required for the function to execute.
 * @param {SummerProtocolDB['db']} params.db - The database instance used to fetch and insert data.
 * @param {GraphQLClient} params.mainnetGraphQlClient - The GraphQL client for the mainnet network.
 * @param {GraphQLClient} params.baseGraphQlClient - The GraphQL client for the base network.
 * @param {GraphQLClient} params.arbitrumGraphQlClient - The GraphQL client for the Arbitrum network.
 * @returns {Promise<{ updated: number, startingFrom: string, duration: string }>} - A promise that resolves to an object containing:
 *   - `updated`: The number of rows inserted or updated in the database.
 *   - `startingFrom`: The timestamp from which the activities were fetched.
 *   - `duration`: The time it took to fetch and insert the activities, in seconds.
 *
 */
export const updateLatestActivities = async ({
  db,
  mainnetGraphQlClient,
  baseGraphQlClient,
  arbitrumGraphQlClient,
  sonicGraphQlClient,
  hyperliquidGraphQlClient,
  rwaGraphQlClients,
}: {
  db: SummerProtocolDB['db']
  mainnetGraphQlClient: GraphQLClient
  baseGraphQlClient: GraphQLClient
  arbitrumGraphQlClient: GraphQLClient
  sonicGraphQlClient: GraphQLClient
  hyperliquidGraphQlClient: GraphQLClient
  rwaGraphQlClients?: GraphQLClient[]
}) => {
  const startTime = Date.now()
  const [
    latestActivityMainnet,
    latestActivityBase,
    latestActivityArbitrum,
    latestActivitySonic,
    latestActivityHyperliquid,
  ] = await Promise.all([
    getLatestTimestamp({ network: 'mainnet', db, table }),
    getLatestTimestamp({ network: 'base', db, table }),
    getLatestTimestamp({ network: 'arbitrum', db, table }),
    getLatestTimestamp({ network: 'sonic', db, table }),
    getLatestTimestamp({ network: 'hyperliquid', db, table }),
  ])

  const allLatestActivities = await getAllLatestActivities({
    timestamps: {
      mainnet: latestActivityMainnet,
      base: latestActivityBase,
      arbitrum: latestActivityArbitrum,
      sonic: latestActivitySonic,
      hyperliquid: latestActivityHyperliquid,
    },
    clients: {
      mainnetGraphQlClient,
      baseGraphQlClient,
      arbitrumGraphQlClient,
      sonicGraphQlClient,
      hyperliquidGraphQlClient,
    },
  })

  // RWA activity from the institutions deployments (one client per RWA network). Each row is tagged
  // with its own network (BASE/MAINNET) by the inserter (derived from the subgraph data), but since
  // RWA rows share the standard per-network watermark we full-scan from 0 and rely on the idempotent
  // insert (onConflict doNothing). Per-client fault tolerance: one RWA network failing must not break
  // the standard ingestion or the other RWA networks.
  const rwaLatestActivities = (
    await Promise.all(
      (rwaGraphQlClients ?? []).map((client) =>
        fetchAllLatestActivities(client, '0')
          .then((rwa) => [
            ...rwa.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
            ...rwa.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
          ])
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to fetch RWA latest activities', error)

            return []
          }),
      ),
    )
  ).flat()

  const { updated } = await insertLatestActivitiesInBatches(db, [
    ...allLatestActivities,
    ...rwaLatestActivities,
  ])

  const endTime = Date.now()
  const duration = `${((endTime - startTime) / 1000).toFixed(2)}s`

  return {
    updated,
    startingFrom: {
      mainnet: latestActivityMainnet,
      base: latestActivityBase,
      arbitrum: latestActivityArbitrum,
      sonic: latestActivitySonic,
      hyperliquid: latestActivityHyperliquid,
    },
    duration,
  }
}
