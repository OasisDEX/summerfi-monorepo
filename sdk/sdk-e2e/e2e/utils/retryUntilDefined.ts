import { waitSeconds } from './wait'

/**
 * Retries an async function until it satisfies a provided condition.
 * By default the condition is "value !== undefined", preserving previous behavior.
 * Useful for waiting for subgraph indexing after on-chain transactions.
 *
 * @param fn - Async function to retry
 * @param retries - Number of retry attempts (default: 5)
 * @param intervalSeconds - Seconds to wait between attempts (default: 3)
 * @param condition - Optional predicate to decide whether the returned value is acceptable. Defaults to `v => v !== undefined`.
 * @returns The first result that satisfies `condition`, or undefined if all attempts fail
 */
export async function retryUntilDefined<T>(
  fn: () => Promise<T | undefined>,
  condition?: (value: T | undefined) => boolean,
  retries = 5,
  intervalSeconds = 3,
): Promise<T | undefined> {
  const check = condition ?? ((value: T | undefined) => value !== undefined)

  for (let attempt = 1; attempt <= retries; attempt++) {
    const result = await fn()
    if (check(result)) {
      return result
    }
    if (attempt < retries) {
      console.log(
        `Attempt ${attempt}/${retries} did not satisfy condition, retrying in ${intervalSeconds}s...`,
      )
      await waitSeconds(intervalSeconds)
    }
  }
  return undefined
}
