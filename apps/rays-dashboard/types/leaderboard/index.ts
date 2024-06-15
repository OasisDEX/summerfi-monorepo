import { Leaderboard } from '@summerfi/rays-db'

export type LeaderboardItem = Leaderboard & {
  id: string
  position: string
  totalPoints: string
  userAddress: string
  details: { activePositions: number; activeTriggers: number } | null
  ens: string | null
}

export type LeaderboardResponse = { leaderboard: LeaderboardItem[]; error?: unknown }
