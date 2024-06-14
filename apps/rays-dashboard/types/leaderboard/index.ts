export type LeaderboardItem = {
  id: string
  position: string
  totalPoints: string
  userAddress: string
  details: { activePositions: number; activeTriggers: number } | null
  ens: string | null
}

export type LeaderboardResponse = { leaderboard: LeaderboardItem[]; error?: string }
