import BigNumber from 'bignumber.js'

export const HOUR = 60 * 60
export const DAY = 24 * HOUR
export const WEEK = 7 * DAY
export const SECONDS_PER_YEAR = 365 * DAY

export const HOUR_BI = new BigNumber(HOUR)
export const DAY_BI = new BigNumber(DAY)
export const WEEK_BI = new BigNumber(WEEK)
export const SECONDS_PER_YEAR_BI = new BigNumber(SECONDS_PER_YEAR)
