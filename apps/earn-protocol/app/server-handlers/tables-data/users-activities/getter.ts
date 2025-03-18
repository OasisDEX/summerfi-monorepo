import { SDKNetwork } from '@summerfi/app-types'
import { type GraphQLClient } from 'graphql-request'

import { type UserActivity } from '@/app/server-handlers/tables-data/users-activities/types'

import { fetchAllUserActivities } from './fetcher'

export const getAllUserActivities = async ({
  lastTimestamp,
  mainnetGraphQlClient,
  baseGraphQlClient,
  arbitrumGraphQlClient,
}: {
  lastTimestamp: string
  mainnetGraphQlClient: GraphQLClient
  baseGraphQlClient: GraphQLClient
  arbitrumGraphQlClient: GraphQLClient
}): Promise<UserActivity[]> => {
  const [mainnetActivities, baseActivities, arbitrumActivities] = await Promise.all([
    fetchAllUserActivities(mainnetGraphQlClient, lastTimestamp, SDKNetwork.Mainnet),
    fetchAllUserActivities(baseGraphQlClient, lastTimestamp, SDKNetwork.Base),
    fetchAllUserActivities(arbitrumGraphQlClient, lastTimestamp, SDKNetwork.ArbitrumOne),
  ])

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
