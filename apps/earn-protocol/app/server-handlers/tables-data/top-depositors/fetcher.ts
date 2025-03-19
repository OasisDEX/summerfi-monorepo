import { type SDKNetwork } from '@summerfi/app-types'
import { GetTopDepositorsDocument, type Position } from '@summerfi/subgraph-manager-common'
import { type GraphQLClient } from 'graphql-request'

import { SUBGRAPH_BATCH_SIZE } from '@/app/server-handlers/tables-data/consts'

interface GraphQLResponse {
  positions: Position[]
}

export async function fetchTopDepositors(client: GraphQLClient, _network: SDKNetwork) {
  let allPositions: Position[] = []
  let skip = 0
  let hasMorePositions = true

  while (hasMorePositions) {
    const response = await client.request<GraphQLResponse>(GetTopDepositorsDocument, {
      first: SUBGRAPH_BATCH_SIZE,
      skip,
    })

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
