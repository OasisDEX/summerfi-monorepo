import { CustomDate, daysAgo } from '../helpers'

export const getRatesTimestamps = (date: CustomDate) => {
  const oneDay = daysAgo(date, 1)
  const sevenDays = daysAgo(date, 7)
  const thirtyDays = daysAgo(date, 30)
  const ninetyDays = daysAgo(date, 90)
  const oneYear = daysAgo(date, 365)
  return [
    [oneDay, 1],
    [sevenDays, 7],
    [thirtyDays, 30],
    [ninetyDays, 90],
    [oneYear, 365],
  ]
}
