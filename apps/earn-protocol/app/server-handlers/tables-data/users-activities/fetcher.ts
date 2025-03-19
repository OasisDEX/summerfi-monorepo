import { type SDKNetwork } from '@summerfi/app-types'
import {
  type Deposit,
  GetLatestActivityDocument,
  type Withdraw,
} from '@summerfi/subgraph-manager-common'
import { type GraphQLClient } from 'graphql-request'

interface GraphQLResponse {
  deposits: Deposit[]
  withdraws: Withdraw[]
}

const BATCH_SIZE = 1000

export async function fetchAllUserActivities(
  client: GraphQLClient,
  timestamp: string,
  _network: SDKNetwork,
) {
  let allDeposits: Deposit[] = []
  let allWithdraws: Withdraw[] = []
  let skip = 0
  let hasMoreDeposits = true
  let hasMoreWithdraws = true

  while (hasMoreDeposits || hasMoreWithdraws) {
    const response = await client.request<GraphQLResponse>(GetLatestActivityDocument, {
      timestamp,
      first: BATCH_SIZE,
      skip,
    })

    const deposits = response.deposits || []
    const withdraws = response.withdraws || []

    allDeposits = [...allDeposits, ...deposits]
    allWithdraws = [...allWithdraws, ...withdraws]

    // If we got less than the batch size for both, we've reached the end
    if (deposits.length < BATCH_SIZE) {
      hasMoreDeposits = false
    }
    if (withdraws.length < BATCH_SIZE) {
      hasMoreWithdraws = false
    }

    if (hasMoreDeposits || hasMoreWithdraws) {
      skip += BATCH_SIZE
    }
  }

  return {
    deposits: allDeposits,
    withdraws: allWithdraws,
  }
}
