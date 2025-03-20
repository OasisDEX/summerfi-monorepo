import { SDKNetwork } from '@summerfi/app-types'
import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { GraphQLClient } from 'graphql-request'
import { type NextRequest, NextResponse } from 'next/server'

import { updateRebalanceActivity } from './rebalance-activity/updater'
import { updateTopDepositors } from './top-depositors/updater'
import { updateUsersActivities } from './users-activities/updater'

export const updateTablesData = async ({
  _req,
  db,
}: {
  _req: NextRequest
  db: SummerProtocolDB['db']
}) => {
  // reusable
  const subgraphsMap = {
    [SDKNetwork.Mainnet]: `${process.env.SUBGRAPH_BASE}/summer-protocol`,
    [SDKNetwork.Base]: `${process.env.SUBGRAPH_BASE}/summer-protocol-base`,
    [SDKNetwork.ArbitrumOne]: `${process.env.SUBGRAPH_BASE}/summer-protocol-arbitrum`,
  }

  const mainnetGraphQlClient = new GraphQLClient(subgraphsMap[SDKNetwork.Mainnet])
  const baseGraphQlClient = new GraphQLClient(subgraphsMap[SDKNetwork.Base])
  const arbitrumGraphQlClient = new GraphQLClient(subgraphsMap[SDKNetwork.ArbitrumOne])

  try {
    const updatedUsersActivities = await updateUsersActivities({
      db,
      mainnetGraphQlClient,
      baseGraphQlClient,
      arbitrumGraphQlClient,
    })

    const updatedTopDepositors = await updateTopDepositors({
      db,
      mainnetGraphQlClient,
      baseGraphQlClient,
      arbitrumGraphQlClient,
    })

    const updatedRebalanceActivity = await updateRebalanceActivity({
      db,
      mainnetGraphQlClient,
      baseGraphQlClient,
      arbitrumGraphQlClient,
    })

    return NextResponse.json({
      updatedUsersActivities,
      updatedTopDepositors,
      updatedRebalanceActivity,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    // eslint-disable-next-line no-console
    console.error('Error updating tables data:', errorMessage)

    return NextResponse.json(
      { error: 'Failed to update tables data', details: errorMessage },
      { status: 500 },
    )
  }
}
