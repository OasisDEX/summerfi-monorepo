import { type ReactNode } from 'react'

export type MarketRiskParameters = {
  id: string
  market: ReactNode
  marketCap: number
  maxPercentage: number
  impliedCap: string
}
