import { type SDKNetwork } from '@summerfi/app-types'
import { type GraphQLClient } from 'graphql-request'

import {
  type Deposit,
  GetLatestActivityDocument,
  type Withdraw,
} from '@/graphql/clients/latest-activity/client'

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
  let batchNumber = 0

  while (hasMoreDeposits || hasMoreWithdraws) {
    batchNumber++
    const response = await client.request<GraphQLResponse>(GetLatestActivityDocument, {
      timestamp,
      first: BATCH_SIZE,
      skip,
    })

    const deposits = response.deposits || []
    const withdraws = response.withdraws || []

    allDeposits = [...allDeposits, ...deposits]
    allWithdraws = [...allWithdraws, ...withdraws]

    // eslint-disable-next-line no-console
    console.info('--------------------------------')
    // eslint-disable-next-line no-console
    console.info('Fetch all users activities')
    // eslint-disable-next-line no-console
    console.info(`Batch ${batchNumber}:`)
    // eslint-disable-next-line no-console
    console.info(`- Deposits: ${deposits.length} (Total: ${allDeposits.length})`)
    // eslint-disable-next-line no-console
    console.info(`- Withdraws: ${withdraws.length} (Total: ${allWithdraws.length})`)
    // eslint-disable-next-line no-console
    console.info('--------------------------------')

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
