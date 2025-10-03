import type { IPercentage } from '../interfaces/IPercentage'

export type VaultApys = {
  live: IPercentage | null
  sma24h: IPercentage | null
  sma7day: IPercentage | null
  sma30day: IPercentage | null
}
