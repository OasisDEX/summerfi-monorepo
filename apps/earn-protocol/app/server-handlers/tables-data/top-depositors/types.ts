import { type Position } from '@/graphql/clients/top-depositors/client'

export type TopDepositorPosition = Position & {
  changeSevenDays: string
  earningsStreak: bigint
  projectedOneYearEarnings: string
  projectedOneYearEarningsUsd: string
}
