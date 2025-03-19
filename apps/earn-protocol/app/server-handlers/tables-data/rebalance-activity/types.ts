import { type Rebalance } from '@summerfi/subgraph-manager-common'
import { type RebalanceActivity as RebalanceActivityDb } from '@summerfi/summer-protocol-db'

export type RebalanceActivity = Rebalance & {
  actionType: 'deposit' | 'withdraw' | 'risk_reduction' | 'rate_enhancement' | 'n/a'
}

export type RebalanceActivityPagination = {
  data: RebalanceActivityDb[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}
