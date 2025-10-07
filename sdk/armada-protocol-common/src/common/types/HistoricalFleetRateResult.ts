export interface HistoricalFleetRateResult {
  chainId: string
  fleetAddress: string
  rates: HistoricalFleetRates
}

export interface HistoricalFleetRates {
  dailyRates: AggregatedFleetRate[]
  hourlyRates: AggregatedFleetRate[]
  weeklyRates: AggregatedFleetRate[]
  latestRate: FleetRate[]
}

export interface FleetRate {
  id: string
  rate: string
  timestamp: number
  fleetAddress: string
}

export interface AggregatedFleetRate {
  id: string
  averageRate: string
  date: string
  fleetAddress: string
}
