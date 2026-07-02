import type { IPercentage } from '../interfaces/IPercentage'

/** A vault's APY figures: live plus 24-hour, 7-day and 30-day simple moving averages. */
export type VaultApys = {
  live: IPercentage | null
  sma24h: IPercentage | null
  sma7day: IPercentage | null
  sma30day: IPercentage | null
}
