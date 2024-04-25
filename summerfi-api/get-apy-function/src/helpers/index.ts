export type ShortDate = `${number}-${number}-${number}`

export type CustomDate = Date | ShortDate

export type SecondTimestamp = number

export type StartOfDayTimestamp = SecondTimestamp

export const getTimestamp = (date: CustomDate): SecondTimestamp => {
  if (typeof date === 'object') {
    return Math.floor(date.getTime() / 1000)
  }

  const [year, month, day] = date.split('-').map(Number)

  return Math.floor(new Date(Date.UTC(year, month - 1, day)).getTime() / 1000)
}

export const getStartOfDayTimestamp = (date: ShortDate): StartOfDayTimestamp => {
  const dateObject = getDate(date)

  return Math.floor(dateObject.getTime() / 1000)
}

export const getEndOfDayTimestamp = (date: ShortDate): SecondTimestamp => {
  const dateObject = getDate(date)

  return Math.floor(
    new Date(
      Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate(), 23, 59, 59),
    ).getTime() / 1000,
  )
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

export const secondTimestampToShortDate = (timestamp: SecondTimestamp): ShortDate => {
  const date = secondTimestampToDate(timestamp)
  return getShortDate(date)
}

export const firstTimestampOfDay = (timestamp: SecondTimestamp): SecondTimestamp => {
  const date = secondTimestampToDate(timestamp)
  const newDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))

  return Math.floor(newDate.getTime() / 1000)
}

export const lastTimestampOfDay = (timestamp: SecondTimestamp): SecondTimestamp => {
  const date = secondTimestampToDate(timestamp)
  const newDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const nextDay = addDays(getTimestamp(newDate), 1)

  return nextDay - 1
}

export const getDifferenceInDays = (from: SecondTimestamp, to: SecondTimestamp): number => {
  return Math.floor((to - from) / ONE_DAY)
}

export const addDays = (timestamp: SecondTimestamp, days: number): SecondTimestamp => {
  return timestamp + days * ONE_DAY
}

export const daysAgo = (date: CustomDate, days: number): SecondTimestamp => {
  const timestamp = getTimestamp(date)

  return timestamp - days * ONE_DAY
}

export const yearsAgo = (date: CustomDate, years: number): SecondTimestamp => {
  const timestamp = getTimestamp(date)

  return timestamp - years * ONE_YEAR
}

export const getShortDate = (date: CustomDate): ShortDate => {
  if (typeof date === 'object')
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  return date
}

export const getDate = (date: CustomDate): Date => {
  if (typeof date === 'object') return date
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}
