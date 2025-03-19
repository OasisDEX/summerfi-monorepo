import { type SDKSupportedNetwork } from '@summerfi/app-types'
import { getHumanReadableFleetName } from '@summerfi/app-utils'
import { type Network, type SummerProtocolDB } from '@summerfi/summer-protocol-db'

import { DB_BATCH_SIZE, sdkNetworkToDbNetworkMap } from '@/app/server-handlers/tables-data/consts'
import { type Rebalance } from '@/graphql/clients/latest-activity/client'

export async function insertRebalanceActivitiesInBatches(
  db: SummerProtocolDB['db'],
  activities: Rebalance[],
  batchSize: number = DB_BATCH_SIZE,
) {
  for (let i = 0; i < activities.length; i += batchSize) {
    const batch = activities.slice(i, i + batchSize)

    await db
      .insertInto('rebalanceActivity')
      .values(
        batch.map((activity) => ({
          rebalanceId: activity.id,
          amount: activity.amount,
          amountUsd: activity.amountUSD,
          vaultId: activity.vault.id,
          vaultName: activity.vault.name ?? 'n/a',
          strategy: activity.vault.name
            ? getHumanReadableFleetName(
                activity.vault.protocol.network as unknown as SDKSupportedNetwork,
                activity.vault.name,
              )
            : 'n/a',
          strategyId: `${activity.vault.id}-${activity.vault.protocol.network}`,
          fromName: activity.from.name ?? 'n/a',
          fromDepositLimit: activity.from.depositLimit,
          fromTotalValueLockedUsd: activity.from.totalValueLockedUSD,
          toName: activity.to.name ?? 'n/a',
          toDepositLimit: activity.to.depositLimit,
          toTotalValueLockedUsd: activity.to.totalValueLockedUSD,
          network: sdkNetworkToDbNetworkMap[
            activity.vault.protocol.network as unknown as SDKSupportedNetwork
          ] as Network,
          inputTokenPriceUsd: activity.vault.inputTokenPriceUSD ?? '0',
          inputTokenSymbol: activity.vault.inputToken.symbol,
          inputTokenDecimals: activity.vault.inputToken.decimals,
          txHash: activity.hash,
          actionType: activity.type,
          timestamp: activity.timestamp,
        })),
      )
      .execute()
  }
}
