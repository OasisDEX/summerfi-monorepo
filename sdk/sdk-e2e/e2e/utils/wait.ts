/**
 * Utility function to wait for a specified number of seconds
 * @param seconds Number of seconds to wait
 * @returns Promise that resolves after the specified time
 */
export function waitSeconds(seconds: number): Promise<void> {
  console.log(`wait ${seconds} seconds...`)
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}
