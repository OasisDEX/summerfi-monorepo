import {
  sdkSupportedChains,
  type SDKUsersActivityType,
  UserActivityType,
  type UsersActivity,
} from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'
import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

// filter out testing wallets
const addresesToFilterOut = [
  '0xaf2227f40445982959c56e1421a0855209f6470e',
  '0xddc68f9de415ba2fe2fd84bc62be2d2cff1098da',
  '0xbef4befb4f230f43905313077e3824d7386e09f8',
  '0x10649c79428d718621821cf6299e91920284743f',
]

export async function getUsersActivity({
  filterTestingWallets = false,
}: {
  filterTestingWallets?: boolean
}): Promise<{
  usersActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  totalUsers: number
  callDataTimestamp: number
}> {
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

  const usersActivityList = usersActivityListRaw
    .filter(
      (position) =>
        !filterTestingWallets || !addresesToFilterOut.includes(position.account.id.toLowerCase()),
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
    .sort((a, b) =>
      simpleSort({
        a: a.timestamp,
        b: b.timestamp,
        direction: SortDirection.DESC,
      }),
    )

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
}
