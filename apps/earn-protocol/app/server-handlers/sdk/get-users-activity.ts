import {
  sdkSupportedChains,
  type SDKUsersActivityType,
  UserActivityType,
  type UsersActivity,
} from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { unstable_cache as unstableCache } from 'next/cache'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { REVALIDATION_TIMES } from '@/constants/revalidations'

export async function getUsersActivity(): Promise<{
  usersActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  totalUsers: number
  callDataTimestamp: number
}> {
  const usersActivity = await unstableCache(
    async () => {
      const usersActivityByNetwork = await Promise.all(
        sdkSupportedChains.map((networkId) => {
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

      const totalUsers = [
        ...new Set(
          usersActivityListRaw
            .filter((position) => position.deposits.length > 0)
            .map((position) => position.account.id),
        ),
      ].length

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
          simpleSort({
            a: a.inputTokenBalance,
            b: b.inputTokenBalance,
            direction: SortDirection.DESC,
          }),
        )
        .filter((item) => item.deposits.length > 0)

      return {
        usersActivity: usersActivityList,
        topDepositors,
        totalUsers,
        callDataTimestamp: Date.now(),
      }
    },
    [],
    {
      revalidate: REVALIDATION_TIMES.PORTFOLIO_DATA,
    },
  )()

  return usersActivity
}
