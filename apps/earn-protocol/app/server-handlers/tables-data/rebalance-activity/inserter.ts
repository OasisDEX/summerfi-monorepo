import {
  getHumanReadableFleetName,
  mapChainIdToDbNetwork,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { type Network, type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import BigNumber from 'bignumber.js'

import { DB_BATCH_SIZE } from '@/app/server-handlers/tables-data/consts'

import { type RebalanceActivity } from './types'

/**
 * Inserts a batch of rebalance activities into the database.
 *
 * This function processes the provided rebalance activities in batches and inserts them into the `rebalanceActivity` table in
 * the database. Each activity is mapped to the corresponding database fields with normalization applied to the token amounts
 * and balances. The insertion is performed in batches to optimize performance and avoid exceeding the database's insert limit.
 *
 * @param {SummerProtocolDB['db']} db - The database instance used to perform the insert operation.
 * @param {RebalanceActivity[]} activities - An array of `RebalanceActivity` objects to be inserted into the database.
 * @param {number} [batchSize=DB_BATCH_SIZE] - The number of activities to insert in each batch. Defaults to `DB_BATCH_SIZE`.
 * @returns {Promise<{ updated: number }>} - A promise that resolves to an object containing the number of inserted or updated rows.
 *
 * @example
 * const result = await insertRebalanceActivitiesInBatches(db, activities)
 * console.log(result.updated) // Logs the number of rows inserted or updated
 */
export async function insertRebalanceActivitiesInBatches(
  db: SummerProtocolDB['db'],
  activities: RebalanceActivity[],
  batchSize: number = DB_BATCH_SIZE,
) {
  let updated = 0

  for (let i = 0; i < activities.length; i += batchSize) {
    const batch = activities.slice(i, i + batchSize)

    const result = await db
      .insertInto('rebalanceActivity')
      .values(
        batch.map((activity) => ({
          id: `${activity.id}-${activity.vault.protocol.network}-${activity.timestamp}`,
          rebalanceId: activity.id,
          amount: activity.amount.toString(),
          amountNormalized: new BigNumber(activity.amount.toString())
            .shiftedBy(-activity.vault.inputToken.decimals)
            .toString(),
          amountUsd: activity.amountUSD.toString(),
          vaultId: activity.vault.id,
          vaultName: activity.vault.name ?? 'n/a',
          strategy: activity.vault.name
            ? getHumanReadableFleetName(
                supportedSDKNetwork(activity.vault.protocol.network),
                activity.vault.name,
              )
            : 'n/a',
          strategyId: `${activity.vault.id}-${activity.vault.protocol.network}`,
          fromName: activity.from.name ?? 'n/a',
          fromDepositLimit: activity.fromPostAction.depositLimit.toString(),
          fromDepositLimitNormalized: new BigNumber(activity.fromPostAction.depositLimit.toString())
            .shiftedBy(-activity.vault.inputToken.decimals)
            .toString(),
          fromTotalValueLockedUsd: activity.from.totalValueLockedUSD.toString(),
          toName: activity.to.name ?? 'n/a',
          toDepositLimit: activity.toPostAction.depositLimit.toString(),
          toDepositLimitNormalized: new BigNumber(activity.toPostAction.depositLimit.toString())
            .shiftedBy(-activity.vault.inputToken.decimals)
            .toString(),
          toTotalValueLockedUsd: activity.to.totalValueLockedUSD,
          network: mapChainIdToDbNetwork(
            subgraphNetworkToSDKId(supportedSDKNetwork(activity.vault.protocol.network)),
          ) as Network,
          actionType: activity.actionType,
          inputTokenPriceUsd: activity.vault.inputTokenPriceUSD ?? '0',
          inputTokenSymbol: activity.vault.inputToken.symbol,
          inputTokenDecimals: activity.vault.inputToken.decimals,
          txHash: activity.hash,
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
