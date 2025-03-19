import { type RebalanceActivity as RebalanceActivityDb } from '@summerfi/summer-protocol-db'

import { type Rebalance } from '@/graphql/clients/latest-activity/client'

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
