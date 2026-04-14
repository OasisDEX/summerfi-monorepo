import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

export function useSafeAutoConnect() {
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()

  useEffect(() => {
    if (isConnected || typeof window === 'undefined' || window === window.parent) {
      return
    }

    const safeConnector = connectors.find((c) => c.id === 'safe')

    if (!safeConnector) {
      return
    }

    connect({ connector: safeConnector })
  }, [connect, connectors, isConnected])
}
