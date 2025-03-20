import { type Deposit, type Withdraw } from '@summerfi/subgraph-manager-common'
import { type LatestActivity } from '@summerfi/summer-protocol-db'

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

export type UsersActivitiesSortBy = 'timestamp' | 'balance' | 'balanceUsd' | 'amount' | 'amountUsd'
