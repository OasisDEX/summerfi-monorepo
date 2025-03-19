import { type SDKNetwork } from '@summerfi/app-types'
import { GetRebalancesDocument, type Rebalance } from '@summerfi/subgraph-manager-common'
import { type GraphQLClient } from 'graphql-request'

interface GraphQLResponse {
  rebalances: Rebalance[]
}

const BATCH_SIZE = 1000

export async function fetchAllRebalanceActivities(
  client: GraphQLClient,
  timestamp: string,
  _network: SDKNetwork,
) {
  let allRebalances: Rebalance[] = []
  let skip = 0
  let hasMoreRebalances = true

  while (hasMoreRebalances) {
    const response = await client.request<GraphQLResponse>(GetRebalancesDocument, {
      timestamp,
      first: BATCH_SIZE,
      skip,
    })

    const rebalances = response.rebalances || []

    allRebalances = [...allRebalances, ...rebalances]

    // If we got less than the batch size for both, we've reached the end
    if (rebalances.length < BATCH_SIZE) {
      hasMoreRebalances = false
    }

    if (hasMoreRebalances) {
      skip += BATCH_SIZE
    }
  }

  return {
    rebalances: allRebalances,
  }
}
