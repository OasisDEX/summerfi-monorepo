type TimeUntil = {
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Calculates the time remaining until a specified future timestamp.
 *
 * This function computes the difference between the current time and a given future timestamp,
 * and returns the result as an object with weeks, days, hours, and minutes. The time remaining
 * is broken down into these units, allowing for a detailed view of the duration.
 *
 * @param timestamp - The future date and time in ISO 8601 format to calculate the time remaining until.
 * @returns An object representing the time remaining until the specified timestamp. The object contains:
 *   - `weeks`: The number of full weeks remaining.
 *   - `days`: The number of remaining days, excluding full weeks.
 *   - `hours`: The number of remaining hours, excluding full days.
 *   - `minutes`: The number of remaining minutes, excluding full hours.
 *
 * If the current time is past or equal to the specified timestamp, the function returns:
 *   `{ weeks: 0, days: 0, hours: 0, minutes: 0 }`
 */
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
      seconds: 0,
    }
  }

  const minutes: number = Math.floor(diff / 1000 / 60)
  const hours: number = Math.floor(minutes / 60)
  const days: number = Math.floor(hours / 24)
  const weeks: number = Math.floor(days / 7)

  const remainingDays: number = days % 7
  const remainingHours: number = hours % 24
  const remainingMinutes: number = minutes % 60
  const remainingSeconds: number = Math.floor((diff / 1000) % 60)

  return {
    weeks,
    days: remainingDays,
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSeconds,
  }
}
