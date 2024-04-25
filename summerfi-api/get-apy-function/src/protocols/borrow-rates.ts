import { BorrowRatesParams, GroupedRates } from './types'
import { getRatesPerDay } from './rates-per-day'

export const calculateBorrowRates = (params: BorrowRatesParams): GroupedRates => {
  return getRatesPerDay(params.interestRates.borrow)
}
