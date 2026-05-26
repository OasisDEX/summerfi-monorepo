import { waitSeconds } from './wait'

/**
 * Retries an async function until it returns a defined (non-undefined) value.
 * Useful for waiting for subgraph indexing after on-chain transactions.
 *
 * @param fn - Async function to retry
 * @param retries - Number of retry attempts (default: 5)
 * @param intervalSeconds - Seconds to wait between attempts (default: 3)
 * @returns The first defined result, or undefined if all attempts fail
 */
export async function retryUntilDefined<T>(
  fn: () => Promise<T | undefined>,
  retries = 5,
  intervalSeconds = 3,
): Promise<T | undefined> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const result = await fn()
    if (result !== undefined) {
      return result
    }
    if (attempt < retries) {
      console.log(
        `Attempt ${attempt}/${retries} returned undefined, retrying in ${intervalSeconds}s...`,
      )
      await waitSeconds(intervalSeconds)
    }
  }
  return undefined
}
