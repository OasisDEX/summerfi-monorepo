import {
  type SDKNetwork,
  type SDKUsersActivityType,
  UserActivityType,
  type UsersActivity,
} from '@summerfi/app-types'
import { simpleSort, SortDirection, subgraphNetworkToId } from '@summerfi/app-utils'
import { ArmadaVaultId } from '@summerfi/sdk-client'
import { Address, getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getUserActivity({
  network,
  vaultAddress,
  walletAddress,
}: {
  network: SDKNetwork
  vaultAddress: string
  walletAddress?: string
}): Promise<{
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  callDataTimestamp: number
}> {
  const chainId = subgraphNetworkToId(network)
  const chainInfo = getChainInfoByChainId(chainId)

  const fleetAddress = Address.createFromEthereum({
    value: vaultAddress,
  })
  const poolId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  const { positions } = await backendSDK.armada.users.getUserActivityRaw({
    poolId,
  })

  const userActivityList = positions
    .filter((position) =>
      walletAddress ? position.account.id === walletAddress.toLowerCase() : true,
    )
    .flatMap((position) => [
      ...position.deposits.map((deposit) => ({
        ...deposit,
        balance: position.inputTokenBalance,
        vault: position.vault,
        account: position.account.id,
        activity: UserActivityType.DEPOSIT,
      })),
      ...position.withdrawals.map((deposit) => ({
        ...deposit,
        balance: position.inputTokenBalance,
        vault: position.vault,
        account: position.account.id,
        activity: UserActivityType.WITHDRAW,
      })),
    ])

  const topDepositors = positions
    .sort((a, b) =>
      simpleSort({ a: a.inputTokenBalance, b: b.inputTokenBalance, direction: SortDirection.DESC }),
    )
    .filter((item) => item.deposits.length > 0)

  return {
    userActivity: userActivityList,
    topDepositors,
    callDataTimestamp: Date.now(),
  }
}
