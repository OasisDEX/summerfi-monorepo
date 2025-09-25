'use client'

/* eslint-disable no-console */
import { useCallback, useLayoutEffect, useState } from 'react'
import { useChain, useConnect } from '@account-kit/react'
import Safe from '@safe-global/safe-apps-sdk'
import { SDKChainIdToAAChainMap, useIsIframe } from '@summerfi/app-earn-ui'
import { safe } from 'wagmi/connectors'

export const AutoConnectSafe = () => {
  const [triedConnectingSafe, setTriedConnectingSafe] = useState(false)
  const isIframe = useIsIframe()
  const { setChain } = useChain()
  const { connect } = useConnect()
  const connectSafe = useCallback(async () => {
    try {
      setTriedConnectingSafe(true)

      const safeWallet = new Safe()
      const safeInfo = await safeWallet.safe.getInfo()

      connect(
        {
          connector: safe({}),
          chainId: safeInfo.chainId,
        },
        {
          onError: (error) => {
            console.error('[AutoConnectSafe] Error connecting to Safe:', error)
          },
          onSuccess: (data) => {
            setChain({
              chain:
                SDKChainIdToAAChainMap[safeInfo.chainId as keyof typeof SDKChainIdToAAChainMap],
            })
            console.log('[AutoConnectSafe] Connected to Safe:', data)
          },
          onSettled: () => {
            console.log('[AutoConnectSafe] Connection attempt to Safe settled')
          },
        },
      )
    } catch (error) {
      console.error('[AutoConnectSafe] Error connecting to Safe:', error)
    }
  }, [connect, setChain])

  useLayoutEffect(() => {
    if (isIframe && !triedConnectingSafe) {
      connectSafe()
    }
  }, [isIframe, triedConnectingSafe, connectSafe])

  return null
}
