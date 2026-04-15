import { useCallback, useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

export function useSafeAutoConnect() {
  const { connectAsync, connectors } = useConnect()
  const { isConnected } = useAccount()

  const connectSafe = useCallback(
    (cb?: () => void) => () => {
      const safeConnector = connectors.find((c) => c.id === 'safe')

      if (!safeConnector) {
        // eslint-disable-next-line no-console
        console.log('Safe connector not found')
        cb?.()

        return
      }

      void safeConnector
        .getProvider()
        .then((provider) => {
          if (!provider) {
            // eslint-disable-next-line no-console
            console.log('Safe provider not found')
            cb?.()

            return
          }

          void connectAsync({ connector: safeConnector })
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn('Safe auto-connect failed', error)
          cb?.()
        })
    },
    [connectAsync, connectors],
  )

  useEffect(() => {
    let cancelled = false
    const cleanup = () => {
      cancelled = true
    }

    if (isConnected || typeof window === 'undefined' || window === window.parent) {
      return cleanup
    }

    connectSafe(() => {
      if (cancelled) return
      // eslint-disable-next-line no-console
      console.log('Safe auto-connect skipped')
    })()

    return cleanup
  }, [connectAsync, connectSafe, connectors, isConnected])

  return {
    connectSafe,
  }
}
