/**
 * Runs `factory()` but never lets it block longer than `timeoutMs`, and never rejects. Resolves to the
 * promise's value on success, or to `fallback` if the promise rejects or exceeds the timeout. `onFallback`
 * is invoked (if provided) so the caller can log why the fallback was taken.
 *
 * Used to keep an optional dependency (Redis) strictly off the critical path: a dead/slow endpoint yields the
 * fallback within a bounded time instead of hanging the request until the Lambda times out. The internal
 * timer is `unref`'d so it never keeps the event loop alive on its own.
 */
export async function withTimeout<T>(
  factory: () => Promise<T>,
  timeoutMs: number,
  fallback: T,
  onFallback?: (reason: 'timeout' | 'error', error?: unknown) => void,
): Promise<T> {
  // Report the fallback reason at most once. Without this, when the timeout wins the race the underlying
  // promise keeps running and a late rejection would fire `onFallback('error')` a second time (confusing
  // logs, possibly on a later invocation once the container unfreezes).
  let reported = false
  const reportTimeout = () => {
    if (reported) {
      return
    }
    reported = true
    onFallback?.('timeout')
  }
  const reportError = (error: unknown) => {
    if (reported) {
      return
    }
    reported = true
    onFallback?.('error', error)
  }

  // `guarded` never rejects: both a rejected promise AND a synchronous throw from `factory()` are mapped to
  // the fallback (the `Promise.resolve().then(factory)` boundary converts a sync throw into a rejection).
  const guarded = Promise.resolve()
    .then(factory)
    .catch((error) => {
      reportError(error)
      return fallback
    })

  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      reportTimeout()
      resolve(fallback)
    }, timeoutMs)
    // Don't let the timeout timer alone hold the process open.
    timer.unref?.()
  })

  const result = await Promise.race([guarded, timeout])
  if (timer) {
    clearTimeout(timer)
  }
  return result
}
