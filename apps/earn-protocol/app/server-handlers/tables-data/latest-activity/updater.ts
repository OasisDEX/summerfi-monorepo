import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type GraphQLClient } from 'graphql-request'

import { getAllLatestActivities } from './getter'
import { insertLatestActivitiesInBatches } from './inserter'

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
