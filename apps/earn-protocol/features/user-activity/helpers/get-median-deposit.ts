import { getMedian } from '@summerfi/app-earn-ui'
import { UserActivityType } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'

import { type UsersActivity } from '@/app/server-handlers/sdk/get-users-activity'

export const getUsersActivityMedianDeposit = (usersActivity: UsersActivity) =>
  getMedian(
    usersActivity
      .filter((item) => item.activity === UserActivityType.DEPOSIT)
      .map((item) =>
        new BigNumber(item.amount.toString()).shiftedBy(-item.vault.inputToken.decimals).toNumber(),
      ),
  )
