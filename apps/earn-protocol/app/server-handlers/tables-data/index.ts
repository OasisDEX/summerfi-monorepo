import { SDKNetwork } from '@summerfi/app-types'
import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { GraphQLClient } from 'graphql-request'
import { NextResponse } from 'next/server'

import { updateLatestActivities } from './latest-activity/updater'
import { updateRebalanceActivity } from './rebalance-activity/updater'
import { updateTopDepositors } from './top-depositors/updater'
import { UpdateTables } from './types'

/**
 * Updates the specified tables in the database by fetching the latest data from subgraphs.
 *
 * @param tablesToUpdate - An array of tables to update.
 * @param db - The database instance for performing the updates.
 *
 * @returns A JSON response containing the results of the updates for each table, or an error message if the update fails.
 */
export const updateTablesData = async ({
  tablesToUpdate,
  db,
}: {
  tablesToUpdate: UpdateTables[]
  db: SummerProtocolDB['db']
}) => {
  try {
    const baseUrl = process.env.SUBGRAPH_BASE

    if (!baseUrl) {
      throw new Error('SUBGRAPH_BASE is not set')
    }

    const subgraphsMap = {
      [SDKNetwork.Mainnet]: `${baseUrl}/summer-protocol`,
      [SDKNetwork.Base]: `${baseUrl}/summer-protocol-base`,
      [SDKNetwork.ArbitrumOne]: `${baseUrl}/summer-protocol-arbitrum`,
      [SDKNetwork.SonicMainnet]: `${baseUrl}/summer-protocol-sonic`,
    }

    const mainnetGraphQlClient = new GraphQLClient(subgraphsMap[SDKNetwork.Mainnet])
    const baseGraphQlClient = new GraphQLClient(subgraphsMap[SDKNetwork.Base])
    const arbitrumGraphQlClient = new GraphQLClient(subgraphsMap[SDKNetwork.ArbitrumOne])
    const sonicGraphQlClient = new GraphQLClient(subgraphsMap[SDKNetwork.SonicMainnet])

    let updatedLatestActivities
    let updatedTopDepositors
    let updatedRebalanceActivity

    if (tablesToUpdate.includes(UpdateTables.LatestActivity)) {
      updatedLatestActivities = await updateLatestActivities({
        db,
        mainnetGraphQlClient,
        baseGraphQlClient,
        arbitrumGraphQlClient,
        sonicGraphQlClient,
      })
    }

    if (tablesToUpdate.includes(UpdateTables.TopDepositors)) {
      updatedTopDepositors = await updateTopDepositors({
        db,
        mainnetGraphQlClient,
        baseGraphQlClient,
        arbitrumGraphQlClient,
        sonicGraphQlClient,
      })
    }

    if (tablesToUpdate.includes(UpdateTables.RebalanceActivity)) {
      updatedRebalanceActivity = await updateRebalanceActivity({
        db,
        mainnetGraphQlClient,
        baseGraphQlClient,
        arbitrumGraphQlClient,
        sonicGraphQlClient,
      })
    }

    return NextResponse.json({
      updatedLatestActivities,
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
  } finally {
    await db.destroy().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error closing database connection:', err)
    })
  }
}
