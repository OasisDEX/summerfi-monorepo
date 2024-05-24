import { JSX } from 'react'

type IconProps = {
  path: JSX.Element
  viewBox?: string
}

export interface TokenConfig {
  symbol: string
  rootToken?: string
  precision: number
  digits: number
  maxSell?: string
  name: string
  icon: IconProps
  iconCircle: IconProps
  iconUnavailable?: boolean
  coinpaprikaTicker?: string
  coinpaprikaFallbackTicker?: string
  tags: ('stablecoin' | 'lp-token')[]
  color?: string
  token0?: string
  token1?: string
  coinbaseTicker?: string
  coinGeckoTicker?: string
  coinGeckoId?: string
  background?: string
  digitsInstant?: number
  safeCollRatio?: number
  oracleTicker?: string
  source?: string
}
