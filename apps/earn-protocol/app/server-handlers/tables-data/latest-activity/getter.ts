import { type GraphQLClient } from 'graphql-request'

import { type LatestActivity } from '@/app/server-handlers/tables-data/latest-activity/types'

import { fetchAllLatestActivities } from './fetcher'

export const getAllLatestActivities = async ({
  lastTimestamp,
  mainnetGraphQlClient,
  baseGraphQlClient,
  arbitrumGraphQlClient,
}: {
  lastTimestamp: string
  mainnetGraphQlClient: GraphQLClient
  baseGraphQlClient: GraphQLClient
  arbitrumGraphQlClient: GraphQLClient
}): Promise<LatestActivity[]> => {
  const results = await Promise.allSettled([
    fetchAllLatestActivities(mainnetGraphQlClient, lastTimestamp),
    fetchAllLatestActivities(baseGraphQlClient, lastTimestamp),
    fetchAllLatestActivities(arbitrumGraphQlClient, lastTimestamp),
  ])

  const [mainnetActivities, baseActivities, arbitrumActivities] = results.map((result) =>
    result.status === 'fulfilled' ? result.value : { deposits: [], withdraws: [] },
  )

  // Combine all new activities from different networks and add type property
  return [
    ...mainnetActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...baseActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...arbitrumActivities.deposits.map((deposit) => ({ ...deposit, type: 'deposit' as const })),
    ...mainnetActivities.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
    ...baseActivities.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
    ...arbitrumActivities.withdraws.map((withdraw) => ({ ...withdraw, type: 'withdraw' as const })),
  ].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
}
