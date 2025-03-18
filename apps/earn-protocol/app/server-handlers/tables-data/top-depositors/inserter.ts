import { type SDKSupportedNetwork } from '@summerfi/app-types'
import { getHumanReadableFleetName } from '@summerfi/app-utils'
import { type Network, type SummerProtocolDB } from '@summerfi/summer-protocol-db'

import { DB_BATCH_SIZE, sdkNetworkToDbNetworkMap } from '@/app/server-handlers/tables-data/consts'

import { type TopDepositorPosition } from './types'

export async function insertTopDepositorsInBatches(
  db: SummerProtocolDB['db'],
  topDepositors: TopDepositorPosition[],
  batchSize: number = DB_BATCH_SIZE,
) {
  for (let i = 0; i < topDepositors.length; i += batchSize) {
    const batch = topDepositors.slice(i, i + batchSize)

    const updatedAt = BigInt(new Date().getTime())

    await db
      .insertInto('topDepositors')
      .values(
        batch.map((topDepositor) => ({
          userAddress: topDepositor.account.id,
          vaultId: topDepositor.vault.id,
          vaultName: topDepositor.vault.name ?? 'n/a',
          strategy: topDepositor.vault.name
            ? getHumanReadableFleetName(
                topDepositor.vault.protocol.network as unknown as SDKSupportedNetwork,
                topDepositor.vault.name,
              )
            : 'n/a',
          balance: topDepositor.inputTokenBalanceNormalized,
          balanceUsd: topDepositor.inputTokenBalanceNormalizedInUSD,
          network: sdkNetworkToDbNetworkMap[
            topDepositor.vault.protocol.network as unknown as SDKSupportedNetwork
          ] as Network,
          changeSevenDays: topDepositor.change7d,
          noOfDeposits: topDepositor.deposits.length,
          noOfWithdrawals: topDepositor.withdrawals.length,
          projectedOneYearEarnings: topDepositor.projected1yEarnings,
          projectedOneYearEarningsUsd: topDepositor.projected1yEarningsInUSD,
          earningStreak: topDepositor.earningStreak,
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
          earningStreak: (eb) => eb.ref('excluded.earningStreak'),
          inputTokenPriceUsd: (eb) => eb.ref('excluded.inputTokenPriceUsd'),
          inputTokenSymbol: (eb) => eb.ref('excluded.inputTokenSymbol'),
          inputTokenDecimals: (eb) => eb.ref('excluded.inputTokenDecimals'),
          updatedAt: (eb) => eb.ref('excluded.updatedAt'),
        }),
      )
      .execute()
  }
}
