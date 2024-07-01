import { Leaderboard } from '@summerfi/rays-db'

export type LeaderboardItem = Leaderboard & {
  id: string
  position: string
  totalPoints: string
  userAddress: string
  details: { activePositions: number; activeTriggers: number; pointsEarnedPerYear: number } | null
  ens: string | null
  rank: string
  rank22h: string
  points22h: string
}

export type LeaderboardResponse = { leaderboard: LeaderboardItem[]; error?: unknown }
