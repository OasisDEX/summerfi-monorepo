import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const formatStakeLockupPeriod = (seconds: number): string => {
  // returns a nice formatted lock period like "2 years", "6 months", "3 weeks", "5 days"
  const dayjsNow = dayjs()
  const timestamp = dayjsNow.add(Number(seconds), 'seconds')
  const daysCount = timestamp.diff(dayjsNow, 'days')
  const hoursCount = timestamp.diff(dayjsNow, 'hours')
  const minutesCount = timestamp.diff(dayjsNow, 'minutes')
  const minutesClamped = minutesCount % 60

  const hoursLabel = hoursCount === 1 ? 'hour' : `hours`
  const minutesLabel = minutesClamped === 1 ? 'minute' : `minutes`

  if (Number(seconds) === 0) {
    return `No lockup`
  }

  if (daysCount === 0) {
    // if its zero days its gonna show hours and minutes

    return `${hoursCount > 0 ? `${hoursCount} ${hoursLabel}, ` : ''}${minutesClamped > 0 ? `${minutesClamped} ${minutesLabel}` : ''}`
  }

  if (daysCount <= 2) {
    // if its less than two days its gonna show hours
    return `${hoursCount} ${hoursLabel}`
  }

  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(Number(daysCount))} days`
}
