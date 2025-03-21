import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type GraphQLClient } from 'graphql-request'

import { getAllLatestActivities } from './getter'
import { insertLatestActivitiesInBatches } from './inserter'

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
}: {
  db: SummerProtocolDB['db']
  mainnetGraphQlClient: GraphQLClient
  baseGraphQlClient: GraphQLClient
  arbitrumGraphQlClient: GraphQLClient
}) => {
  const startTime = Date.now()
  const [latestActivity] = await Promise.all([
    db.selectFrom('latestActivity').selectAll().orderBy('timestamp', 'desc').limit(1).execute(),
  ])

  // Get the most recent timestamp from the database, or 0 if no records exist
  const lastTimestamp = latestActivity[0]?.timestamp || '0'

  const allLatestActivities = await getAllLatestActivities({
    lastTimestamp,
    mainnetGraphQlClient,
    baseGraphQlClient,
    arbitrumGraphQlClient,
  })

  const { updated } = await insertLatestActivitiesInBatches(db, allLatestActivities)

  const endTime = Date.now()
  const duration = `${((endTime - startTime) / 1000).toFixed(2)}s`

  return {
    updated,
    startingFrom: lastTimestamp,
    duration,
  }
}
