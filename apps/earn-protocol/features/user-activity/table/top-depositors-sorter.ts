import { type TableSortedColumn } from '@summerfi/app-earn-ui'
import { type SDKUsersActivityType } from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { getEarningStreakResetTimestamp } from '@/features/user-activity/helpers/get-earning-streak-reset-timestamp'
import { calculateTopDepositors7daysChange } from '@/features/user-activity/table/top-depositors-mapper'

export const topDepositorsSorter = ({
  data,
  sortConfig,
}: {
  data: SDKUsersActivityType
  sortConfig?: TableSortedColumn<string>
}) => {
  switch (sortConfig?.key) {
    case 'balance':
      return data.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance,
          b: b.inputTokenBalance,
          direction: sortConfig.direction,
        }),
      )
    case 'balanceUSD':
      return data.sort((a, b) => {
        return simpleSort({
          a: new BigNumber(a.inputTokenBalance.toString())
            .shiftedBy(-a.vault.inputToken.decimals)
            .times(new BigNumber(a.vault.inputTokenPriceUSD as string))
            .toNumber(),
          b: new BigNumber(b.inputTokenBalance.toString())
            .shiftedBy(-b.vault.inputToken.decimals)
            .times(new BigNumber(b.vault.inputTokenPriceUSD as string))
            .toNumber(),
          direction: sortConfig.direction,
        })
      })
    case 'change7d':
      return data.sort((a, b) =>
        simpleSort({
          a: calculateTopDepositors7daysChange(a).toNumber(),
          b: calculateTopDepositors7daysChange(b).toNumber(),
          direction: sortConfig.direction,
        }),
      )
    case 'projected1yrEarnings':
      return data.sort((a, b) =>
        simpleSort({
          a: new BigNumber(a.inputTokenBalance.toString())
            .times(Number(a.vault.apr365d) / 100)
            .toNumber(),
          b: new BigNumber(b.inputTokenBalance.toString())
            .times(Number(b.vault.apr365d) / 100)
            .toNumber(),
          direction: sortConfig.direction,
        }),
      )
    case 'numberOfDeposits':
      return data.sort((a, b) =>
        simpleSort({
          a: a.deposits.length,
          b: b.deposits.length,
          direction: sortConfig.direction,
        }),
      )
    case 'earningsStreak':
      return data.sort((a, b) =>
        simpleSort({
          a: new Date().getTime() - getEarningStreakResetTimestamp(a),
          b: new Date().getTime() - getEarningStreakResetTimestamp(b),
          direction: sortConfig.direction,
        }),
      )
    default:
      return data.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance,
          b: b.inputTokenBalance,
          direction: SortDirection.DESC,
        }),
      )
  }
}
