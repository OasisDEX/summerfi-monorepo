import { GetRebalancesDocument, type Rebalance } from '@summerfi/subgraph-manager-common'
import { type GraphQLClient } from 'graphql-request'

import { SUBGRAPH_BATCH_SIZE } from '@/app/server-handlers/tables-data/consts'

interface GraphQLResponse {
  rebalances: Rebalance[]
}

/**
 * Fetches all rebalance activities from the GraphQL subgraph in batches.
 *
 * This function makes multiple requests to the GraphQL endpoint until all rebalance activities
 * are retrieved. It handles pagination by using the `skip` and `first` arguments in the GraphQL request.
 * The process continues until all rebalance activities are fetched, determined by the batch size.
 *
 * @param {GraphQLClient} client - The GraphQL client used to send requests to the subgraph.
 * @param {string} timestamp - The timestamp used as a filter for the rebalance activities.
 * @returns {Promise<Rebalance[]>} - A promise that resolves to an array containing all the rebalances.
 *
 * @example
 * const rebalances = await fetchAllRebalanceActivities(client, '1625461923', network)
 */
export async function fetchAllRebalanceActivities(client: GraphQLClient, timestamp: string) {
  let allRebalances: Rebalance[] = []
  let skip = 0
  let hasMoreRebalances = true

  while (hasMoreRebalances) {
    const response = await client.request<GraphQLResponse>(
      GetRebalancesDocument,
      {
        timestamp,
        first: SUBGRAPH_BATCH_SIZE,
        skip,
      },
      {
        origin: 'earn-protocol-app',
      },
    )

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
