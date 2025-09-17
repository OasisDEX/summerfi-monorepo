/**
 * Standard fetch configuration for the SDK
 */
export const FETCH_CONFIG = {
  /** Standard timeout for API calls in milliseconds */
  TIMEOUT: 10_000,

  /** Timeout for critical operations that need more time */
  EXTENDED_TIMEOUT: 30_000,

  /** Timeout for quick operations */
  SHORT_TIMEOUT: 5_000,
} as const

/**
 * Creates an AbortSignal with the standard timeout
 * @param timeout - Timeout in milliseconds (defaults to standard timeout)
 * @returns AbortSignal that will abort after the specified timeout
 */
export function createTimeoutSignal(timeout: number = FETCH_CONFIG.TIMEOUT): AbortSignal {
  return AbortSignal.timeout(timeout)
}

export function fetchWithTimeout(url: string, options?: RequestInit) {
  const signal = createTimeoutSignal()
  return fetch(url, { signal, ...options })
}
