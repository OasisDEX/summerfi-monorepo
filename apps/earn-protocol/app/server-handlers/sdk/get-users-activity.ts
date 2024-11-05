import {
  sdkSupportedNetworks,
  type SDKUserActivityType,
  type SDKUsersActivityType,
  UserActivityType,
} from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'
import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export interface UserActivity {
  timestamp: SDKUserActivityType['deposits'][0]['timestamp']
  amount: SDKUserActivityType['deposits'][0]['amount']
  balance: SDKUserActivityType['inputTokenBalance']
  vault: SDKUserActivityType['vault']
  account: SDKUserActivityType['account']['id']
  activity: UserActivityType
}

export type UsersActivity = UserActivity[]

export async function getUsersActivity(): Promise<{
  usersActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  totalUsers: number
  callDataTimestamp: number
}> {
  const usersActivityByNetwork = await Promise.all(
    sdkSupportedNetworks.map((networkId) => {
      const chainInfo = getChainInfoByChainId(networkId)

      return backendSDK.armada.users.getUsersActivityRaw({
        chainInfo,
      })
    }),
  )

  // flatten the list
  const usersActivityListRaw = usersActivityByNetwork.reduce<
    (typeof usersActivityByNetwork)[number]['positions']
  >((acc, { positions }) => [...acc, ...positions], [])

  const totalUsers = usersActivityListRaw.filter((position) => position.deposits.length > 0).length

  const usersActivityList = usersActivityListRaw.flatMap((position) => [
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

  const topDepositors = usersActivityListRaw
    .sort((a, b) =>
      simpleSort({ a: a.inputTokenBalance, b: b.inputTokenBalance, direction: SortDirection.DESC }),
    )
    .filter((item) => item.deposits.length > 0)

  return {
    usersActivity: usersActivityList,
    topDepositors,
    totalUsers,
    callDataTimestamp: Date.now(),
  }
}
