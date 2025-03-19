import {
  getHumanReadableFleetName,
  mapChainIdToDbNetwork,
  subgraphNetworkToSDKId,
} from '@summerfi/app-utils'
import { type Network, type SummerProtocolDB } from '@summerfi/summer-protocol-db'

import { DB_BATCH_SIZE } from '@/app/server-handlers/tables-data/consts'

import { type RebalanceActivity } from './types'

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
          rebalanceId: activity.id,
          amount: activity.amount.toString(),
          amountUsd: activity.amountUSD.toString(),
          vaultId: activity.vault.id,
          vaultName: activity.vault.name ?? 'n/a',
          strategy: activity.vault.name
            ? getHumanReadableFleetName(activity.vault.protocol.network, activity.vault.name)
            : 'n/a',
          strategyId: `${activity.vault.id}-${activity.vault.protocol.network}`,
          fromName: activity.from.name ?? 'n/a',
          fromDepositLimit: activity.fromPostAction.depositLimit.toString(),
          fromTotalValueLockedUsd: activity.from.totalValueLockedUSD.toString(),
          toName: activity.to.name ?? 'n/a',
          toDepositLimit: activity.toPostAction.depositLimit.toString(),
          toTotalValueLockedUsd: activity.to.totalValueLockedUSD,
          network: mapChainIdToDbNetwork(
            subgraphNetworkToSDKId(activity.vault.protocol.network),
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
