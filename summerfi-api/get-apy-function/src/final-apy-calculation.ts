import { CalculateRates, GroupedRates } from './protocols/types'
import { LTV } from '@summerfi/serverless-shared'
import { ONE_DAY, secondTimestampToShortDate, StartOfDayTimestamp } from './helpers'

const LtvToNumber = (ltv: LTV) => Number(ltv) / 10_000

const ltvToMultiply = (ltv: LTV) => 1 + 1 / (1 / LtvToNumber(ltv) - 1)

export const getFinalApy = (params: {
  supplied: GroupedRates[]
  borrowed: GroupedRates[]
  ltv: LTV
  from: StartOfDayTimestamp
  to: StartOfDayTimestamp
}): { rates: CalculateRates; multiply: number } => {
  const { supplied, borrowed, ltv, to, from } = params
  const multiply = ltvToMultiply(ltv)

  const mergedSupplied = new Map<StartOfDayTimestamp, number>()
  const mergedBorrowed = new Map<StartOfDayTimestamp, number>()

  const finalApy = new Map<StartOfDayTimestamp, number>()

  const oneDayAgo = to - ONE_DAY
  const sevenDaysAgo = to - 7 * ONE_DAY
  const thirtyDaysAgo = to - 30 * ONE_DAY
  const ninetyDaysAgo = to - 90 * ONE_DAY
  const threeHundredSixtyFiveDaysAgo = to - 365 * ONE_DAY

  const rates1d: number[] = []
  const rates7d: number[] = []
  const rates30d: number[] = []
  const rates90d: number[] = []
  const rates365d: number[] = []

  for (let i = from; i <= to; i += ONE_DAY) {
    const shortDate = secondTimestampToShortDate(i)
    const borrowApys: number[] = []
    const supplyApys: number[] = []
    supplied.forEach((suppliedRates) => {
      const rate = suppliedRates.get(shortDate)
      if (rate) {
        supplyApys.push(rate.averageRate)
      }
    })
    borrowed.forEach((borrowedRates) => {
      const rate = borrowedRates.get(shortDate)
      if (rate) {
        borrowApys.push(rate.averageRate)
      }
    })

    if (borrowApys.length === 0 && supplyApys.length === 0) {
      continue
    }

    const borrowApy = borrowApys.reduce((acc, apy) => acc + apy, 0)
    const supplyApy = supplyApys.reduce((acc, apy) => acc + apy, 0)

    const apy = supplyApy * multiply - borrowApy * (multiply - 1)

    mergedSupplied.set(i, supplyApy)
    mergedBorrowed.set(i, borrowApy)
    finalApy.set(i, apy)

    if (i > oneDayAgo) {
      rates1d.push(apy)
    }
    if (i > sevenDaysAgo) {
      rates7d.push(apy)
    }
    if (i > thirtyDaysAgo) {
      rates30d.push(apy)
    }
    if (i > ninetyDaysAgo) {
      rates90d.push(apy)
    }
    if (i > threeHundredSixtyFiveDaysAgo) {
      rates365d.push(apy)
    }
  }

  const rates = {
    apy1d: rates1d.reduce((acc, apy) => acc + apy, 0) / rates1d.length,
    apy7d: rates7d.reduce((acc, apy) => acc + apy, 0) / rates7d.length,
    apy30d:
      rates30d.length >= 30 ? rates30d.reduce((acc, apy) => acc + apy, 0) / rates30d.length : null,
    apy90d:
      rates90d.length >= 90 ? rates90d.reduce((acc, apy) => acc + apy, 0) / rates90d.length : null,
    apy365d:
      rates365d.length >= 365
        ? rates365d.reduce((acc, apy) => acc + apy, 0) / rates365d.length
        : null,
  }

  return {
    rates,
    multiply,
  }
}
