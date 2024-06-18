type TimeUntil = {
  weeks: number
  days: number
  hours: number
  minutes: number
}

export const timeUntil = (timestamp: string): TimeUntil => {
  const now: Date = new Date()
  const futureDate: Date = new Date(timestamp)
  const diff: number = futureDate.getTime() - now.getTime()

  if (diff <= 0) {
    return {
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
    }
  }

  const minutes: number = Math.floor(diff / 1000 / 60)
  const hours: number = Math.floor(minutes / 60)
  const days: number = Math.floor(hours / 24)
  const weeks: number = Math.floor(days / 7)

  const remainingDays: number = days % 7
  const remainingHours: number = hours % 24
  const remainingMinutes: number = minutes % 60

  return {
    weeks,
    days: remainingDays,
    hours: remainingHours,
    minutes: remainingMinutes,
  }
}
