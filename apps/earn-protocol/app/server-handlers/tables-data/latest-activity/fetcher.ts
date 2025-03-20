import {
  type Deposit,
  GetLatestActivityDocument,
  type Withdraw,
} from '@summerfi/subgraph-manager-common'
import { type GraphQLClient } from 'graphql-request'

import { SUBGRAPH_BATCH_SIZE } from '@/app/server-handlers/tables-data/consts'

interface GraphQLResponse {
  deposits: Deposit[]
  withdraws: Withdraw[]
}

export async function fetchAllLatestActivities(client: GraphQLClient, timestamp: string) {
  let allDeposits: Deposit[] = []
  let allWithdraws: Withdraw[] = []
  let skip = 0
  let hasMoreDeposits = true
  let hasMoreWithdraws = true

  while (hasMoreDeposits || hasMoreWithdraws) {
    const response = await client.request<GraphQLResponse>(GetLatestActivityDocument, {
      timestamp,
      first: SUBGRAPH_BATCH_SIZE,
      skip,
    })

    const deposits = response.deposits || []
    const withdraws = response.withdraws || []

    allDeposits = [...allDeposits, ...deposits]
    allWithdraws = [...allWithdraws, ...withdraws]

    // If we got less than the batch size for both, we've reached the end
    if (deposits.length < SUBGRAPH_BATCH_SIZE) {
      hasMoreDeposits = false
    }
    if (withdraws.length < SUBGRAPH_BATCH_SIZE) {
      hasMoreWithdraws = false
    }

    if (hasMoreDeposits || hasMoreWithdraws) {
      skip += SUBGRAPH_BATCH_SIZE
    }
  }

  return {
    deposits: allDeposits,
    withdraws: allWithdraws,
  }
}
