import { type SDKNetwork } from '@summerfi/app-types'
import { GetRebalancesDocument, type Rebalance } from '@summerfi/subgraph-manager-common'
import { type GraphQLClient } from 'graphql-request'

import { SUBGRAPH_BATCH_SIZE } from '@/app/server-handlers/tables-data/consts'

interface GraphQLResponse {
  rebalances: Rebalance[]
}

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
      first: SUBGRAPH_BATCH_SIZE,
      skip,
    })

    const rebalances = response.rebalances || []

    allRebalances = [...allRebalances, ...rebalances]

    // If we got less than the batch size for both, we've reached the end
    if (rebalances.length < SUBGRAPH_BATCH_SIZE) {
      hasMoreRebalances = false
    }

    if (hasMoreRebalances) {
      skip += SUBGRAPH_BATCH_SIZE
    }
  }

  return {
    rebalances: allRebalances,
  }
}
