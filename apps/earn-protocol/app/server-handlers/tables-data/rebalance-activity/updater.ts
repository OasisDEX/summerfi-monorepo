import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type GraphQLClient } from 'graphql-request'

import { getLatestTimestamp } from '@/app/server-handlers/tables-data/helpers'

import { fetchAllRebalanceActivities } from './fetcher'
import { getAllRebalanceActivities } from './getter'
import { rebalancesActionTypeMapper } from './helpers'
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

  // RWA rebalances from the institutions deployments (one client per RWA network) — full-scan from 0
  // + idempotent insert (RWA rows share the standard per-network watermark). Per-client fault
  // tolerance so one RWA network failing never breaks standard ingestion or the other RWA networks.
  // Likely few/none for rounds-based RWA vaults.
  const rwaRebalanceActivities = (
    await Promise.all(
      (rwaGraphQlClients ?? []).map((client) =>
        fetchAllRebalanceActivities(client, '0')
          .then((rwa) =>
            rwa.rebalances.map((rebalance) => ({
              ...rebalance,
              actionType: rebalancesActionTypeMapper(rebalance),
            })),
          )
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to fetch RWA rebalance activities', error)

            return []
          }),
      ),
    )
  ).flat()

  const { updated } = await insertRebalanceActivitiesInBatches(db, [
    ...allRebalanceActivities,
    ...rwaRebalanceActivities,
  ])

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
