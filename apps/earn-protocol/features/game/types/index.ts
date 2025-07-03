export interface CardData {
  apy: number
  token: string
  trendData: { x: number; y: number }[]
}

export interface GameOverParams {
  score: number
  streak: number
  rounds: number
  lastCards?: CardData[]
  lastSelected?: number | null
  avgResponse?: number
  responseTimes?: number[]
  timedOut?: boolean
}

export type LeaderboardResponse = {
  score: number
  userAddress: string
  updatedAt: string
  avgResponseTime: number
}[]
