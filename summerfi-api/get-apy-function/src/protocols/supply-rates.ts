import { GroupedRates, SupplyRatesParams } from './types'
import { getRatesPerDay } from './rates-per-day'

export const calculateSupplyRates = (params: SupplyRatesParams): GroupedRates => {
  return getRatesPerDay(params.interestRates.lend)
}
