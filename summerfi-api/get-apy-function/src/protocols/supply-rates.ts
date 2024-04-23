import { CalculatedRates, SupplyRatesParams } from './types'
import { CustomDate } from '../helpers'
import { getRatesTimestamps } from './rates-config'

const calculateSupplyRate = (params: SupplyRatesParams, timestamp: number, days: number) => {
  const apy = params.interestRates.lend
    .filter((rate) => rate.toTimestamp >= BigInt(timestamp))
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

export const calculateSupplyRates = (
  params: SupplyRatesParams,
  referanceTimestamp: CustomDate,
): CalculatedRates => {
  const timestamps = getRatesTimestamps(referanceTimestamp)

  const [supplyRate1d, supplyRate7d, supplyRate30d, supplyRate90d, supplyRate] = timestamps.map(
    ([timestamp, days]) => {
      return calculateSupplyRate(params, timestamp, days)
    },
  )

  return {
    apy1d: supplyRate1d,
    apy7d: supplyRate7d,
    apy30d: supplyRate30d,
    apy90d: supplyRate90d,
    apy365d: supplyRate,
  }
}
