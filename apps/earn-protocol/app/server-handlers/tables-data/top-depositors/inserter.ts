import {
  getHumanReadableFleetName,
  mapChainIdToDbNetwork,
  subgraphNetworkToSDKId,
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
 * @returns {Promise<{ updated: number }>} - A promise that resolves to an object containing the number of inserted or updated rows.
 *
 * @example
 * const result = await insertTopDepositorsInBatches(db, topDepositors)
 * console.log(result.updated) // Logs the number of rows inserted or updated
 */
export async function insertTopDepositorsInBatches(
  db: SummerProtocolDB['db'],
  topDepositors: TopDepositorPosition[],
  batchSize: number = DB_BATCH_SIZE,
) {
  let updated = 0

  for (let i = 0; i < topDepositors.length; i += batchSize) {
    const batch = topDepositors.slice(i, i + batchSize)

    const updatedAt = BigInt(new Date().getTime())

    const result = await db
      .insertInto('topDepositors')
      .values(
        batch.map((topDepositor) => ({
          id: `${topDepositor.vault.id}-${topDepositor.account.id}-${topDepositor.vault.protocol.network}`,
          userAddress: topDepositor.account.id.toLowerCase(),
          vaultId: topDepositor.vault.id,
          vaultName: topDepositor.vault.name ?? 'n/a',
          strategy: topDepositor.vault.name
            ? getHumanReadableFleetName(
                topDepositor.vault.protocol.network,
                topDepositor.vault.name,
              )
            : 'n/a',
          strategyId: `${topDepositor.vault.id}-${topDepositor.vault.protocol.network}`,
          balance: topDepositor.inputTokenBalance.toString(),
          balanceNormalized: topDepositor.inputTokenBalanceNormalized,
          balanceUsd: topDepositor.inputTokenBalanceNormalizedInUSD,
          network: mapChainIdToDbNetwork(
            subgraphNetworkToSDKId(topDepositor.vault.protocol.network),
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
          inputTokenSymbol: (eb) => eb.ref('excluded.inputTokenSymbol'),
          inputTokenDecimals: (eb) => eb.ref('excluded.inputTokenDecimals'),
          updatedAt: (eb) => eb.ref('excluded.updatedAt'),
        }),
      )
      .execute()

    updated += Number(result[0].numInsertedOrUpdatedRows ?? 0)
  }

  return {
    updated,
  }
}
