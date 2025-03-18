import { type SDKSupportedNetwork } from '@summerfi/app-types'
import { getHumanReadableFleetName } from '@summerfi/app-utils'
import { type Network, type SummerProtocolDB } from '@summerfi/summer-protocol-db'

import { DB_BATCH_SIZE, sdkNetworkToDbNetworkMap } from '@/app/server-handlers/tables-data/consts'
import { type UserActivity } from '@/app/server-handlers/tables-data/users-activities/types'

export async function insertUsersActivitiesInBatches(
  db: SummerProtocolDB['db'],
  activities: UserActivity[],
  batchSize: number = DB_BATCH_SIZE,
) {
  for (let i = 0; i < activities.length; i += batchSize) {
    const batch = activities.slice(i, i + batchSize)

    await db
      .insertInto('latestActivity')
      .values(
        batch.map((activity) => ({
          amount: activity.amount,
          amountUsd: activity.amountUSD,
          userAddress: activity.position.account.id,
          vaultId: activity.position.vault.id,
          vaultName: activity.position.vault.name ?? 'n/a',
          strategy: activity.position.vault.name
            ? getHumanReadableFleetName(
                activity.position.vault.protocol.network as unknown as SDKSupportedNetwork,
                activity.position.vault.name,
              )
            : 'n/a',
          balance: activity.position.inputTokenBalance,
          balanceUsd: activity.position.inputTokenBalanceNormalizedInUSD,
          network: sdkNetworkToDbNetworkMap[
            activity.position.vault.protocol.network as unknown as SDKSupportedNetwork
          ] as Network,
          inputTokenPriceUsd: activity.position.vault.inputTokenPriceUSD ?? '0',
          inputTokenSymbol: activity.position.vault.inputToken.symbol,
          inputTokenDecimals: activity.position.vault.inputToken.decimals,
          txHash: activity.hash,
          actionType: activity.type,
          timestamp: activity.timestamp,
        })),
      )
      .execute()
  }
}
