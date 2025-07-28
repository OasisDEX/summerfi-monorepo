import {
  getHumanReadableFleetName,
  mapChainIdToDbNetwork,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'

import { DB_BATCH_SIZE } from '@/app/server-handlers/tables-data/consts'

import { type TopDepositorPosition } from './types'

/**
 * Inserts a batch of top depositors into the database.
 *
 * This function processes the provided top depositor positions in batches and inserts them into the `topDepositors` table in the
 * database. It updates existing records when conflicts occur, and inserts new records when necessary. The insertion is performed
 * in batches to optimize performance and avoid exceeding the database's insert limit.
 *
 * @param {SummerProtocolDB['db']} db - The database instance used to perform the insert operation.
 * @param {TopDepositorPosition[]} topDepositors - An array of `TopDepositorPosition` objects to be inserted into the database.
 * @param {number} [batchSize=DB_BATCH_SIZE] - The number of top depositor positions to insert in each batch. Defaults to `DB_BATCH_SIZE`.
 * @returns {Promise<{ updated: number; deleted: number }>} - A promise that resolves to an object containing the number of inserted/updated rows and deleted rows.
 *
 * @example
 * const result = await insertTopDepositorsInBatches(db, topDepositors)
 * console.log(result.updated) // Logs the number of rows inserted or updated
 * console.log(result.deleted) // Logs the number of rows deleted
 */
export async function insertTopDepositorsInBatches(
  db: SummerProtocolDB['db'],
  topDepositors: TopDepositorPosition[],
  batchSize: number = DB_BATCH_SIZE,
) {
  let updated = 0
  let deleted = 0

  // Get all existing records from the database
  const existingRecords = await db
    .selectFrom('topDepositors')
    .select(['vaultId', 'userAddress', 'network'])
    .execute()

  // Create a set of unique identifiers for the incoming records
  const incomingRecordIds = new Set(
    topDepositors.map(
      (depositor) =>
        `${depositor.vault.id}-${depositor.account.id.toLowerCase()}-${mapChainIdToDbNetwork(
          subgraphNetworkToSDKId(supportedSDKNetwork(depositor.vault.protocol.network)),
        )}`,
    ),
  )

  // Find records to delete (those that exist in DB but not in incoming data)
  const recordsToDelete = existingRecords.filter(
    (record) => !incomingRecordIds.has(`${record.vaultId}-${record.userAddress}-${record.network}`),
  )

  // Process all operations in a single transaction
  await db.transaction().execute(async (trx) => {
    // Delete records that are no longer in the incoming data
    if (recordsToDelete.length > 0) {
      const deleteResult = await trx
        .deleteFrom('topDepositors')
        .where((eb) =>
          eb.or(
            recordsToDelete.map((record) =>
              eb.and([
                eb('vaultId', '=', record.vaultId),
                eb('userAddress', '=', record.userAddress),
                eb('network', '=', record.network),
              ]),
            ),
          ),
        )
        .execute()

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      deleted = Number(deleteResult[0].numDeletedRows ?? 0)
    }

    // Process and insert/update the incoming records
    for (let i = 0; i < topDepositors.length; i += batchSize) {
      const batch = topDepositors.slice(i, i + batchSize)

      const updatedAt = BigInt(new Date().getTime())

      const result = await trx
        .insertInto('topDepositors')
        .values(
          batch.map((topDepositor) => ({
            id: `${topDepositor.vault.id}-${topDepositor.account.id}-${topDepositor.vault.protocol.network}`,
            userAddress: topDepositor.account.id.toLowerCase(),
            vaultId: topDepositor.vault.id,
            vaultName: topDepositor.vault.name ?? 'n/a',
            strategy: topDepositor.vault.name
              ? getHumanReadableFleetName(
                  supportedSDKNetwork(topDepositor.vault.protocol.network),
                  topDepositor.vault.name,
                )
              : 'n/a',
            strategyId: `${topDepositor.vault.id}-${topDepositor.vault.protocol.network}`,
            balance: topDepositor.inputTokenBalance.toString(),
            balanceNormalized: topDepositor.inputTokenBalanceNormalized,
            balanceUsd: topDepositor.inputTokenBalanceNormalizedInUSD,
            network: mapChainIdToDbNetwork(
              subgraphNetworkToSDKId(supportedSDKNetwork(topDepositor.vault.protocol.network)),
            ),
            changeSevenDays: topDepositor.changeSevenDays,
            noOfDeposits: topDepositor.deposits.length,
            noOfWithdrawals: topDepositor.withdrawals.length,
            projectedOneYearEarnings: topDepositor.projectedOneYearEarnings,
            projectedOneYearEarningsUsd: topDepositor.projectedOneYearEarningsUsd,
            earningsStreak: topDepositor.earningsStreak,
            inputTokenPriceUsd: topDepositor.vault.inputTokenPriceUSD ?? '0',
            inputTokenSymbol: topDepositor.vault.inputToken.symbol,
            inputTokenDecimals: topDepositor.vault.inputToken.decimals,
            updatedAt,
          })),
        )
        .onConflict((oc) =>
          oc.columns(['vaultId', 'userAddress', 'network']).doUpdateSet({
            balance: (eb) => eb.ref('excluded.balance'),
            balanceUsd: (eb) => eb.ref('excluded.balanceUsd'),
            changeSevenDays: (eb) => eb.ref('excluded.changeSevenDays'),
            noOfDeposits: (eb) => eb.ref('excluded.noOfDeposits'),
            noOfWithdrawals: (eb) => eb.ref('excluded.noOfWithdrawals'),
            projectedOneYearEarnings: (eb) => eb.ref('excluded.projectedOneYearEarnings'),
            projectedOneYearEarningsUsd: (eb) => eb.ref('excluded.projectedOneYearEarningsUsd'),
            earningsStreak: (eb) => eb.ref('excluded.earningsStreak'),
            inputTokenPriceUsd: (eb) => eb.ref('excluded.inputTokenPriceUsd'),
            updatedAt: (eb) => eb.ref('excluded.updatedAt'),
          }),
        )
        .execute()

      updated += Number(result[0].numInsertedOrUpdatedRows ?? 0)
    }
  })

  return {
    updated,
    deleted,
  }
}
