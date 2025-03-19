import { type LatestActivity } from '@summerfi/summer-protocol-db'

import { type Deposit, type Withdraw } from '@/graphql/clients/latest-activity/client'

export type DepositOrWithdraw = Deposit | Withdraw

export type UserActivity = DepositOrWithdraw & {
  type: 'deposit' | 'withdraw'
}

export type UsersActivitiesPagination = {
  data: LatestActivity[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  medianDeposit: number
  totalDeposits: number
}
