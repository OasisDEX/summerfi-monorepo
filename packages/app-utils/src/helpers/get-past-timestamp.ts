/**
 * Calculates a timestamp for a specific number of days in the past.
 *
 * @param daysAgo - The number of days in the past to calculate the timestamp.
 * @returns A timestamp (in milliseconds) that represents the date `daysAgo` days in the past from the current date.
 *
 * @example
 * const pastTimestamp = getPastTimestamp(7);
 * console.log(pastTimestamp); // Output: Timestamp for 7 days ago
 *
 * @remarks
 * - This function uses the current system time (`Date.now()`) as the starting point.
 * - It assumes a day length of 24 hours, and does not account for variations such as daylight saving time.
 */
export const getPastTimestamp = (daysAgo: number): number => {
  // Get the current timestamp in milliseconds
  const currentTimestamp = Date.now()

  // Calculate milliseconds in a day
  const millisecondsInADay = 24 * 60 * 60 * 1000

  // Calculate the timestamp 'daysAgo' days in the past
  // eslint-disable-next-line no-mixed-operators
  return currentTimestamp - daysAgo * millisecondsInADay
}
