export interface PoolsResponse {
  status: string
  data: Pool[]
}

export interface Pool {
  pool: string
  chain: string
  project: string
  symbol: string
  tvlUsd: number // for lending protocols: tvlUsd = totalSupplyUsd - totalBorrowUsd
  apyBase?: number
  apyReward?: number
  rewardTokens?: Array<string>
  underlyingTokens?: Array<string>
  poolMeta?: string
  url?: string

  // optional lending protocol specific fields:
  apyBaseBorrow?: number
  apyRewardBorrow?: number
  totalSupplyUsd?: number
  totalBorrowUsd?: number
  ltv?: number // btw [0, 1]

  prediction?: PoolPredictions
}

interface PoolPredictions {
  predictedClass: string
  predictedProbability: number
  binnedConfidence: number
}

export interface PoolHistoryResponse {
  status: string
  data: PoolHistory[]
}

export interface PoolHistory {
  timestamp: string
  tvlUsd: number
  apy: number
  apyBase?: number
  apyReward?: number
}
