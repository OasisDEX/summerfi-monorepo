import { type Position } from '@/graphql/clients/top-depositors/client'

export type TopDepositorPosition = Position & {
  change7d: string
  earningStreak: bigint
  projected1yEarnings: string
  projected1yEarningsInUSD: string
}
