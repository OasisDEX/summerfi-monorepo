/**
 * Formats the difference between two dates in a human-readable string with proper pluralization.
 *
 * @param from - The starting date for the difference calculation.
 * @param to - The ending date for the difference calculation.
 * @returns A string representing the time difference in the largest relevant unit (seconds, minutes, hours, days, or years), with correct pluralization.
 *
 * @example
 * const fromDate = new Date('2023-01-01');
 * const toDate = new Date('2023-01-02');
 * const result = formatDateDifference({ from: fromDate, to: toDate });
 * console.log(result); // Output: "1 day"
 *
 * @remarks
 * - Returns seconds if less than 60 seconds have elapsed.
 * - Returns minutes if less than 60 minutes have elapsed.
 * - Returns hours if less than 24 hours have elapsed.
 * - Returns days if less than 365 days have elapsed.
 * - Otherwise, returns years, assuming each year has 365 days.
 */

export const formatDateDifference = ({ from, to }: { from: Date; to: Date }): string => {
  const seconds = Math.floor((to.getTime() - from.getTime()) / 1000)

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`
  }

  const minutes = Math.floor(seconds / 60)

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  }

  const days = Math.floor(hours / 24)

  if (days < 365) {
    return `${days} day${days !== 1 ? 's' : ''}`
  }

  const years = Math.floor(days / 365)

  return `${years} year${years !== 1 ? 's' : ''}`
}
