/**
 * Converts a given time range string to seconds.
 *
 * @param {string} [timeRange] - The time range string (e.g., '1-3 minutes', '1-2 days').
 * @returns {number} - The maximum time in seconds. Defaults to 1 day (86400 seconds) if no time range is provided.
 * @throws {Error} - Throws an error if the time range or unit is invalid.
 */
export const getTransakPaymentTimeInSeconds = (timeRange?: string): number => {
  // default to 1 day
  if (timeRange === undefined) {
    return 86400
  }

  const timeUnits: { [key: string]: number } = {
    minute: 60,
    minutes: 60,
    hour: 3600,
    hours: 3600,
    day: 86400,
    days: 86400,
  }

  // Split the input string to extract the range and unit
  const [range, unit] = timeRange.split(' ')
  const [_, maxStr] = range.split('-')
  const maxValue = parseInt(maxStr, 10)

  if (!maxValue || !timeUnits[unit]) {
    throw new Error('Invalid time range or unit')
  }

  return maxValue * timeUnits[unit]
}
