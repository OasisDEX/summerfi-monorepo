import { lastTimestampOfDay, secondTimestampToShortDate, ShortDate } from '../helpers'
import { GroupedRates, InterestRate, RatesWithAverage } from './types'

export const getRatesPerDay = (rates: InterestRate[]): GroupedRates => {
  const ratesMap = new Map<ShortDate, InterestRate[]>()
  const finalMap = new Map<ShortDate, RatesWithAverage>()

  rates.forEach((rate) => {
    const from = rate.fromTimestamp
    const to = rate.toTimestamp

    let currentTimestamp = from
    while (currentTimestamp < to) {
      const currentShortDate = secondTimestampToShortDate(currentTimestamp)
      const maxTimestampOfTheDay = lastTimestampOfDay(currentTimestamp)
      const nextTimestamp = Math.min(maxTimestampOfTheDay, to)
      const rateCopy = {
        ...rate,
        rate: rate.rate * 100,
        fromTimestamp: currentTimestamp,
        toTimestamp: nextTimestamp,
        duration: nextTimestamp - currentTimestamp,
      }
      if (!ratesMap.has(currentShortDate)) {
        ratesMap.set(currentShortDate, [])
      }
      ratesMap.get(currentShortDate)?.push(rateCopy)
      currentTimestamp = nextTimestamp + 1
    }
  })

  ratesMap.forEach((rates, shortDate) => {
    const duration = rates.reduce((acc, rate) => acc + rate.duration, 0)
    const averageRate = rates.reduce((acc, rate) => acc + rate.rate * rate.duration, 0) / duration
    finalMap.set(shortDate, { rates, averageRate })
  })

  return finalMap
}
