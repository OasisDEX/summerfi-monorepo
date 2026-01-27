import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

export const calculateAverageApy = (
  rates: { averageRate: number; date: string }[],
  days: number,
) => {
  const now = dayjs().unix()
  // eslint-disable-next-line no-mixed-operators
  const cutoffDate = now - days * 24 * 60 * 60
  const relevantRates = rates.filter((rate) => Number(rate.date) >= cutoffDate)

  if (relevantRates.length === 0) return new BigNumber(0)

  const sum = relevantRates.reduce(
    (acc, rate) => acc.plus(new BigNumber(rate.averageRate).div(100)),
    new BigNumber(0),
  )

  const avgApy = sum.div(relevantRates.length)

  return avgApy.isNaN() ? new BigNumber(0) : avgApy
}
