import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

export function useSafeAutoConnect() {
  const { connectAsync, connectors } = useConnect()
  const { isConnected } = useAccount()

  useEffect(() => {
    let cancelled = false
    const cleanup = () => {
      cancelled = true
    }

    if (isConnected || typeof window === 'undefined' || window === window.parent) {
      return cleanup
    }

    const safeConnector = connectors.find((c) => c.id === 'safe')

    if (!safeConnector) {
      return cleanup
    }

    void safeConnector
      .getProvider()
      .then((provider) => {
        if (!provider || cancelled) {
          return
        }

        void connectAsync({ connector: safeConnector })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn('Safe auto-connect failed', error)
      })

    return cleanup
  }, [connectAsync, connectors, isConnected])
}
