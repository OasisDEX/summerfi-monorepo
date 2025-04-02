import BigNumber from 'bignumber.js'

export const HOUR: number = 60 * 60
export const DAY: number = 24 * HOUR
export const WEEK: number = 7 * DAY
export const SECONDS_PER_YEAR: number = 365 * DAY
export const SECONDS_PER_DAY: number = 24 * HOUR

export const HOUR_BI: BigNumber = new BigNumber(HOUR)
export const DAY_BI: BigNumber = new BigNumber(DAY)
export const WEEK_BI: BigNumber = new BigNumber(WEEK)
export const SECONDS_PER_YEAR_BI: BigNumber = new BigNumber(SECONDS_PER_YEAR)
export const SECONDS_PER_DAY_BI: BigNumber = new BigNumber(SECONDS_PER_DAY)
