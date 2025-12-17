import { type ReactNode } from 'react'

export type MarketRiskParameters = {
  id: string
  market: ReactNode
  marketCap: ReactNode
  maxPercentage: number
  impliedCap: number
  token?: string
}
