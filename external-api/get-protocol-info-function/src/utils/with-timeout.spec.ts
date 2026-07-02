import { withTimeout } from './with-timeout'

const delay = <T>(ms: number, value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

describe('withTimeout', () => {
  it('resolves to the value when the factory settles before the timeout', async () => {
    const onFallback = jest.fn()
    const result = await withTimeout(() => delay(5, 'ok'), 200, 'fallback', onFallback)
    expect(result).toBe('ok')
    expect(onFallback).not.toHaveBeenCalled()
  })

  it('returns the fallback and reports "timeout" when the factory is too slow', async () => {
    const onFallback = jest.fn()
    const result = await withTimeout(() => delay(200, 'ok'), 20, 'fallback', onFallback)
    expect(result).toBe('fallback')
    expect(onFallback).toHaveBeenCalledWith('timeout')
  })

  it('returns the fallback and reports "error" when the factory rejects', async () => {
    const onFallback = jest.fn()
    const boom = new Error('boom')
    const result = await withTimeout(() => Promise.reject(boom), 200, 'fallback', onFallback)
    expect(result).toBe('fallback')
    expect(onFallback).toHaveBeenCalledWith('error', boom)
  })

  it('returns the fallback when the factory throws synchronously (does not reject)', async () => {
    const onFallback = jest.fn()
    const boom = new Error('sync boom')
    const result = await withTimeout(
      () => {
        throw boom
      },
      200,
      'fallback',
      onFallback,
    )
    expect(result).toBe('fallback')
    expect(onFallback).toHaveBeenCalledWith('error', boom)
  })

  it('reports the fallback reason at most once (timeout wins, late rejection ignored)', async () => {
    const onFallback = jest.fn()
    // Rejects after 100ms, but the timeout is 20ms → timeout wins; the late rejection must not double-report.
    const result = await withTimeout(
      () => new Promise<string>((_, reject) => setTimeout(() => reject(new Error('late')), 100)),
      20,
      'fallback',
      onFallback,
    )
    expect(result).toBe('fallback')
    await delay(150, null) // let the late rejection settle
    expect(onFallback).toHaveBeenCalledTimes(1)
    expect(onFallback).toHaveBeenCalledWith('timeout')
  })

  it('works without an onFallback callback', async () => {
    await expect(withTimeout(() => Promise.reject(new Error('x')), 200, 42)).resolves.toBe(42)
    await expect(withTimeout(() => delay(100, 1), 10, 42)).resolves.toBe(42)
  })
})
