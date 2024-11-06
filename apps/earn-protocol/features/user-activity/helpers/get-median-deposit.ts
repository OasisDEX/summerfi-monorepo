import { getMedian } from '@summerfi/app-earn-ui'
import { UserActivityType, type UsersActivity } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'

export const getUsersActivityMedianDeposit = (usersActivity: UsersActivity) =>
  getMedian(
    usersActivity
      .filter((item) => item.activity === UserActivityType.DEPOSIT)
      .map((item) =>
        new BigNumber(item.amount.toString()).shiftedBy(-item.vault.inputToken.decimals).toNumber(),
      ),
  )
