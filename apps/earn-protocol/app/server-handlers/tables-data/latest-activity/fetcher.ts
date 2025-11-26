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

/**
 * Fetches all latest deposit and withdraw activities from the GraphQL subgraph in batches.
 *
 * This function makes multiple requests to the GraphQL endpoint until all activities are retrieved.
 * It handles pagination by using the `skip` and `first` arguments in the GraphQL request.
 * The process continues until there are no more deposits or withdraws to fetch.
 *
 * @param {GraphQLClient} client - The GraphQL client used to send requests to the subgraph.
 * @param {string} timestamp - The timestamp used as a filter for the latest activities.
 * @returns {Promise<{ deposits: Deposit[], withdraws: Withdraw[] }>} - A promise that resolves to an object containing all the deposits and withdraws.
 *
 * @example
 * const { deposits, withdraws } = await fetchAllLatestActivities(client, '1625461923')
 */
export async function fetchAllLatestActivities(client: GraphQLClient, timestamp: string) {
  let allDeposits: Deposit[] = []
  let allWithdraws: Withdraw[] = []
  let skip = 0
  let hasMoreDeposits = true
  let hasMoreWithdraws = true

  while (hasMoreDeposits || hasMoreWithdraws) {
    const response = await client.request<GraphQLResponse>(
      GetLatestActivityDocument,
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
    const deposits = response.deposits || []
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
