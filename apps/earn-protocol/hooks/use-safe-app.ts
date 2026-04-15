import { useCallback, useEffect, useRef, useState } from 'react'
import type { SafeAppProvider } from '@safe-global/safe-apps-provider'
import type { SafeInfo } from '@safe-global/safe-apps-sdk'
import { useIsIframe } from '@summerfi/app-earn-ui'
import { useAccount, useConnect, useReconnect } from 'wagmi'
import { safe } from 'wagmi/connectors'

export function useSafeAutoConnect() {
  const isIframe = useIsIframe()
  const { connectAsync, connectors } = useConnect()
  const { reconnectAsync } = useReconnect()
  const { isConnected } = useAccount()
  const [isConnecting, setIsConnecting] = useState(false)
  const providerRef = useRef<SafeAppProvider | undefined>(undefined)
  const providerPromiseRef = useRef<Promise<SafeAppProvider | undefined> | null>(null)
  const connectorsRef = useRef(connectors)

  useEffect(() => {
    connectorsRef.current = connectors
  }, [connectors])

  const getSafeProvider = useCallback(() => {
    if (!isIframe) return undefined
    if (providerRef.current) return providerRef.current
    if (providerPromiseRef.current) return providerPromiseRef.current

    providerPromiseRef.current = (async () => {
      try {
        const safeSdkModule = await import('@safe-global/safe-apps-sdk')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SafeAppsSDK = (safeSdkModule as any).default ?? (safeSdkModule as any)
        const sdk = new SafeAppsSDK({})

        const timeout = 10_000
        const safeInfo = (await Promise.race([
          sdk.safe.getInfo(),
          new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Safe getInfo timed out')), timeout)
          }),
        ])) as SafeInfo | undefined

        if (!safeInfo) {
          throw new Error('Could not load Safe information')
        }

        const { SafeAppProvider } = await import('@safe-global/safe-apps-provider')
        const provider = new SafeAppProvider(safeInfo, sdk)

        providerRef.current = provider

        return provider
      } finally {
        providerPromiseRef.current = null
      }
    })()

    return providerPromiseRef.current
  }, [isIframe])

  const ensureSafeConnector = useCallback(async () => {
    const currentConnector = connectorsRef.current.find((c) => c.id === 'safe')

    if (currentConnector) {
      return currentConnector
    }

    if (!isIframe) {
      return undefined
    }

    await reconnectAsync({ connectors: [safe()] })

    const reconnectedSafeConnector = connectorsRef.current.find((c) => c.id === 'safe')

    if (reconnectedSafeConnector) {
      return reconnectedSafeConnector
    }

    return undefined
  }, [isIframe, reconnectAsync])

  const connectSafe = useCallback(
    async (cb?: () => void) => {
      if (!isIframe || isConnected || isConnecting) {
        cb?.()

        return
      }

      setIsConnecting(true)

      try {
        const safeConnector = await ensureSafeConnector()
        let provider: SafeAppProvider | undefined

        if (safeConnector?.getProvider) {
          try {
            const maybeProvider = await safeConnector.getProvider()

            provider = maybeProvider as SafeAppProvider | undefined
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('safeConnector.getProvider() failed', error)
          }
        }

        if (!provider) {
          provider = await getSafeProvider()
        }

        if (!provider) {
          // eslint-disable-next-line no-console
          console.warn('No Safe provider available; auto-connect cannot proceed')

          return
        }

        if (!safeConnector) {
          // eslint-disable-next-line no-console
          console.warn('Safe connector is not available even though provider exists')

          return
        }

        try {
          await connectAsync({ connector: safeConnector })
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Safe auto-connect failed during connectAsync', error)
        }

        cb?.()
      } finally {
        setIsConnecting(false)
      }
    },
    [connectAsync, ensureSafeConnector, getSafeProvider, isConnected, isConnecting, isIframe],
  )

  useEffect(() => {
    if (!isIframe || isConnected) return

    void connectSafe(() => {
      // eslint-disable-next-line no-console
      console.log('Safe auto-connect attempt finished')
    })
  }, [connectSafe, isConnected, isIframe])

  return { connectSafe }
}
