import { type ReactNode } from 'react'

export type MarketRiskParameters = {
  id: string
  market: ReactNode
  marketCap: ReactNode
  maxPercentage: ReactNode
  impliedCap: number
  token?: string
}
