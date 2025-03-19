import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type GraphQLClient } from 'graphql-request'

import { getAllUserActivities } from './getter'
import { insertUsersActivitiesInBatches } from './inserter'

export const updateUsersActivities = async ({
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

  const allUserActivities = await getAllUserActivities({
    lastTimestamp,
    mainnetGraphQlClient,
    baseGraphQlClient,
    arbitrumGraphQlClient,
  })

  // Insert activities in batches to avoid parameter limit
  const { updated } = await insertUsersActivitiesInBatches(db, allUserActivities)

  const endTime = Date.now()
  const duration = `${((endTime - startTime) / 1000).toFixed(2)}s`

  return {
    updated,
    startingFrom: lastTimestamp,
    duration,
  }
}
