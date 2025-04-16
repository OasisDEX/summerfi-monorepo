import { type Deposit, type Withdraw } from '@summerfi/subgraph-manager-common'
import { type LatestActivity as LatestActivityDb } from '@summerfi/summer-protocol-db'

type DepositOrWithdraw = Deposit | Withdraw

export type LatestActivity = DepositOrWithdraw & {
  type: 'deposit' | 'withdraw'
}

export type LatestActivityPagination = {
  data: LatestActivityDb[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  medianDeposit: number
  totalDeposits: number
  totalUniqueUsers: number
}

export type LatestActivitiesSortBy = 'timestamp' | 'balance' | 'balanceUsd' | 'amount' | 'amountUsd'
