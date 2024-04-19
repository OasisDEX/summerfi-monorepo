import { BorrowRatesParams, CalculatedRates } from './types'
import { CustomDate, SecondTimestamp } from '../helpers'
import { getRatesTimestamps } from './rates-config'

const calculateBorrowRate = (
  params: BorrowRatesParams,
  timestamp: SecondTimestamp,
  days: number,
) => {
  const apy = params.interestRates.borrow
    .filter((rate) => rate.toTimestamp >= timestamp)
    .map((rate) => {
      if (rate.fromTimestamp < timestamp) {
        return {
          ...rate,
          fromTimestamp: timestamp,
          duration: rate.toTimestamp - timestamp,
        }
      }
      return rate
    })
    .map((rate) => {
      // (1 + r)^(duration / (60 * 60 * 24 * 365))
      return Math.pow(1 + rate.rate, rate.duration / (60 * 60 * 24 * 365))
    })
    .reduce((acc, rate) => acc * rate, 1)

  return (Math.pow(apy, 365 / days) - 1) * 100
}

export const calculateBorrowRates = (
  params: BorrowRatesParams,
  referanceTimestamp: CustomDate,
): CalculatedRates => {
  const timestamps = getRatesTimestamps(referanceTimestamp)

  const [borrowRate1d, borrowRate7d, borrowRate30d, borrowRate30, borrowRate] = timestamps.map(
    ([timestamp, days]) => {
      return calculateBorrowRate(params, timestamp, days)
    },
  )

  return {
    apy1d: borrowRate1d,
    apy7d: borrowRate7d,
    apy30d: borrowRate30d,
    apy90d: borrowRate30,
    apy365d: borrowRate,
  }
}
