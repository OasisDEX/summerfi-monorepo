/**
 * Runs an async read with a small bounded retry (linear backoff), so a transient first-load rejection
 * — proxy cold start, RPC hiccup, SDK-init race — self-recovers instead of latching a panel into a
 * permanent "Unable to load" / disabled state until the component remounts.
 *
 * Read-only callers only — do NOT wrap on-chain mutations (a retried write could double-submit).
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 600,
): Promise<T> => {
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt < retries) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, delayMs * (attempt + 1))
        })
      }
    }
  }

  throw lastError
}
