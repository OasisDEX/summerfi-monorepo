export type ShortDate = `${number}-${number}-${number}`

export type CustomDate = Date | ShortDate

export type SecondTimestamp = number

export const getTimestamp = (date: CustomDate): SecondTimestamp => {
  if (typeof date === 'object') return Math.floor(date.getTime() / 1000)

  return Math.floor(new Date(date).getTime() / 1000)
}

export const ONE_HOUR = 60 * 60

export const ONE_DAY = 24 * ONE_HOUR

export const ONE_YEAR = 365 * ONE_DAY

export const oneYearAgo = (date: CustomDate): SecondTimestamp => {
  const timestamp = getTimestamp(date)

  return timestamp - ONE_YEAR
}

export const secondTimestampToDate = (timestamp: SecondTimestamp): Date =>
  new Date(timestamp * 1000)

export const daysAgo = (date: CustomDate, days: number): SecondTimestamp => {
  const timestamp = getTimestamp(date)

  return timestamp - days * ONE_DAY
}

export const getShortDate = (date: CustomDate): ShortDate => {
  if (typeof date === 'object')
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  return date
}
