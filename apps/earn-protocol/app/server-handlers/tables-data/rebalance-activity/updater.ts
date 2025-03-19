import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type GraphQLClient } from 'graphql-request'

import { getAllRebalanceActivities } from './getter'
import { insertRebalanceActivitiesInBatches } from './inserter'

export const updateRebalanceActivity = async ({
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
  const [latestRebalanceActivity] = await Promise.all([
    db.selectFrom('rebalanceActivity').selectAll().orderBy('timestamp', 'desc').limit(1).execute(),
  ])

  // Get the most recent timestamp from the database, or 0 if no records exist
  const lastTimestamp = latestRebalanceActivity[0]?.timestamp || '0'

  const allRebalanceActivities = await getAllRebalanceActivities({
    lastTimestamp,
    mainnetGraphQlClient,
    baseGraphQlClient,
    arbitrumGraphQlClient,
  })

  // Insert activities in batches to avoid parameter limit
  const { updated } = await insertRebalanceActivitiesInBatches(db, allRebalanceActivities)

  const endTime = Date.now()
  const duration = `${((endTime - startTime) / 1000).toFixed(2)}s`

  return {
    updated,
    startingFrom: lastTimestamp,
    duration,
  }
}
