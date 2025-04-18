import { SECONDS_PER_YEAR } from '@/times'

export const CALCULATOR_NET_VALUE_CAP = 10000000

/**
 * Calculates the points per USD per year based on the given USD amount.
 * @param usdAmount - The USD amount for which to calculate the points.
 * @returns The points per USD per year.
 */
export const getPointsPerUsdPerYear = (usdAmount: number): number => {
  const a = 1.0005
  const b = 0.99999
  const c = 138.1456715
  const d = 1
  const x0 = 10000
  const frac = 2000

  // eslint-disable-next-line prefer-exponentiation-operator
  return usdAmount <= x0 ? Math.pow(a * b, usdAmount) / frac : (c * Math.pow(d, usdAmount)) / frac
}

/**
 * Calculates the points per USD per second.
 *
 * @param usdAmount - The amount in USD.
 * @returns The points per USD per second.
 */
const getPointsPerUsdPerSecond = (usdAmount: number): number => {
  return getPointsPerUsdPerYear(usdAmount) / SECONDS_PER_YEAR
}

/**
 * Calculates the total points earned over a given period of time, based on the amount and period in seconds.
 * @param _amount - The amount used to calculate the points. It will be capped at 10,000,000.
 * @param periodInSeconds - The period of time in seconds.
 * @returns The total points earned over the given period of time.
 */
export const getPointsPerPeriodInSeconds = (
  _amount: number,
  periodInSeconds: number = SECONDS_PER_YEAR,
): number => {
  const amount = Math.min(_amount, CALCULATOR_NET_VALUE_CAP)
  const pointsPerSecond = getPointsPerUsdPerSecond(amount)

  return pointsPerSecond * periodInSeconds * amount
}

/**
 * Calculates the total points earned over a year.
 * @param _amount - The amount used to calculate the points. It will be capped at 10,000,000.
 * @returns The total points earned over the year.
 */
export const getPointsPerYear = (_amount: number): number => {
  return getPointsPerPeriodInSeconds(_amount, SECONDS_PER_YEAR)
}

export const getCalculatorValues = ({
  usdAmount,
  migration,
}: {
  usdAmount: number
  migration: boolean
}): {
  basePoints: number
  migrationBonus: number
  totalPoints: number
} => {
  const basePoints = getPointsPerYear(usdAmount)
  const migrationBonus = migration ? basePoints * 0.2 : 0

  return {
    basePoints,
    migrationBonus,
    totalPoints: basePoints + migrationBonus,
  }
}
