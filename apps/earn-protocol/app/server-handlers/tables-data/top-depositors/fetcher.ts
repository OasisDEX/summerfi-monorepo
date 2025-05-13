import { GetTopDepositorsDocument, type Position } from '@summerfi/subgraph-manager-common'
import { type GraphQLClient } from 'graphql-request'

import { SUBGRAPH_BATCH_SIZE } from '@/app/server-handlers/tables-data/consts'

interface GraphQLResponse {
  positions: Position[]
}

/**
 * Fetches the top depositors from the GraphQL subgraph in batches.
 *
 * This function retrieves top depositor positions by making multiple requests to the GraphQL endpoint
 * with pagination. It keeps requesting until all positions are fetched, determined by the batch size.
 *
 * @param {GraphQLClient} client - The GraphQL client used to send requests to the subgraph.
 * @returns {Promise<Position[]>} - A promise that resolves to an array containing all the top depositor positions.
 *
 * @example
 * const topDepositors = await fetchTopDepositors(client)
 */
export async function fetchTopDepositors(client: GraphQLClient) {
  let allPositions: Position[] = []
  let skip = 0
  let hasMorePositions = true

  while (hasMorePositions) {
    const response = await client.request<GraphQLResponse>(GetTopDepositorsDocument, {
      first: SUBGRAPH_BATCH_SIZE,
      skip,
    })

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const positions = response.positions || []

    allPositions = [...allPositions, ...positions]

    // If we got less than the batch size for both, we've reached the end
    if (positions.length < SUBGRAPH_BATCH_SIZE) {
      hasMorePositions = false
    }

    if (hasMorePositions) {
      skip += SUBGRAPH_BATCH_SIZE
    }
  }

  return allPositions
}
