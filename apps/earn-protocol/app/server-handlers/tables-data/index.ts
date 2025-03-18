import { SDKNetwork } from '@summerfi/app-types'
import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { GraphQLClient } from 'graphql-request'
import { type NextRequest, NextResponse } from 'next/server'

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

  await updateUsersActivities({
    db,
    mainnetGraphQlClient,
    baseGraphQlClient,
    arbitrumGraphQlClient,
  })

  await updateTopDepositors({
    db,
    mainnetGraphQlClient,
    baseGraphQlClient,
    arbitrumGraphQlClient,
  })

  return NextResponse.json({
    // latestActivity,
    // topDepositors,
    // newActivities,
  })
}
