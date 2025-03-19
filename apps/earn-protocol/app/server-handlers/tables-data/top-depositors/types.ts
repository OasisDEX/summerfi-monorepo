import { type TopDepositors } from '@summerfi/summer-protocol-db'

import { type Position } from '@/graphql/clients/top-depositors/client'

export type TopDepositorPosition = Position & {
  changeSevenDays: string
  earningsStreak: bigint
  projectedOneYearEarnings: string
  projectedOneYearEarningsUsd: string
}

export type TopDepositorsPagination = {
  data: TopDepositors[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}
