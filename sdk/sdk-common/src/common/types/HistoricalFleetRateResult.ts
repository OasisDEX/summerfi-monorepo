/** Historical interest-rate data for a fleet on a given chain. */
export interface HistoricalFleetRateResult {
  chainId: string
  fleetAddress: string
  rates: HistoricalFleetRates
}

/** A fleet's historical rates bucketed by interval, plus its latest rate. */
export interface HistoricalFleetRates {
  dailyRates: AggregatedFleetRate[]
  hourlyRates: AggregatedFleetRate[]
  weeklyRates: AggregatedFleetRate[]
  latestRate: FleetRate[]
}

/** A single point-in-time rate reading for a fleet. */
export interface FleetRate {
  id: string
  rate: string
  timestamp: number
  fleetAddress: string
}

/** A fleet rate averaged over a time bucket (day, hour or week). */
export interface AggregatedFleetRate {
  id: string
  averageRate: string
  date: string
  fleetAddress: string
}
