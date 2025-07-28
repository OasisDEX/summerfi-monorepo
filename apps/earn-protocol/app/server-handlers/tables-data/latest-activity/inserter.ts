import {
  getHumanReadableFleetName,
  mapChainIdToDbNetwork,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { type Network, type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import BigNumber from 'bignumber.js'

import { DB_BATCH_SIZE } from '@/app/server-handlers/tables-data/consts'
import { type LatestActivity } from '@/app/server-handlers/tables-data/latest-activity/types'

/**
 * Inserts a batch of latest activities into the database.
 *
 * This function processes the provided activities in batches and inserts them into the `latestActivity` table in
 * the database. Each activity is mapped to the corresponding database fields with normalization applied to the
 * token amounts and balances. The insertion is performed in batches to optimize performance and avoid exceeding
 * the database's insert limit.
 *
 * @param {SummerProtocolDB['db']} db - The database instance used to perform the insert operation.
 * @param {LatestActivity[]} activities - An array of `LatestActivity` objects to be inserted into the database.
 * @param {number} [batchSize=DB_BATCH_SIZE] - The number of activities to insert in each batch. Defaults to `DB_BATCH_SIZE`.
 * @returns {Promise<{ updated: number }>} - A promise that resolves to an object containing the number of inserted or updated rows.
 *
 * @example
 * const result = await insertLatestActivitiesInBatches(db, activities)
 * console.log(result.updated) // Logs the number of rows inserted or updated
 */
export async function insertLatestActivitiesInBatches(
  db: SummerProtocolDB['db'],
  activities: LatestActivity[],
  batchSize: number = DB_BATCH_SIZE,
) {
  let updated = 0

  for (let i = 0; i < activities.length; i += batchSize) {
    const batch = activities.slice(i, i + batchSize)

    const result = await db
      .insertInto('latestActivity')
      .values(
        batch.map((activity) => ({
          id: `${activity.position.vault.id}-${activity.position.account.id}-${activity.position.vault.protocol.network}-${activity.timestamp}`,
          amount: activity.amount.toString(),
          amountNormalized: new BigNumber(activity.amount.toString())
            .shiftedBy(-activity.position.vault.inputToken.decimals)
            .toString(),
          amountUsd: activity.amountUSD.toString(),
          userAddress: activity.position.account.id.toLowerCase(),
          vaultId: activity.position.vault.id,
          vaultName: activity.position.vault.name ?? 'n/a',
          strategy: activity.position.vault.name
            ? getHumanReadableFleetName(
                supportedSDKNetwork(activity.position.vault.protocol.network),
                activity.position.vault.name,
              )
            : 'n/a',
          strategyId: `${activity.position.vault.id}-${activity.position.vault.protocol.network}`,
          balance: activity.position.inputTokenBalance.toString(),
          balanceNormalized: activity.position.inputTokenBalanceNormalized,
          balanceUsd: activity.position.inputTokenBalanceNormalizedInUSD,
          network: mapChainIdToDbNetwork(
            subgraphNetworkToSDKId(supportedSDKNetwork(activity.position.vault.protocol.network)),
          ) as Network,
          inputTokenPriceUsd: activity.position.vault.inputTokenPriceUSD ?? '0',
          inputTokenSymbol: activity.position.vault.inputToken.symbol,
          inputTokenDecimals: activity.position.vault.inputToken.decimals,
          txHash: activity.hash,
          actionType: activity.type,
          timestamp: activity.timestamp,
        })),
      )
      .execute()

    updated += Number(result[0].numInsertedOrUpdatedRows ?? 0)
  }

  return {
    updated,
  }
}
