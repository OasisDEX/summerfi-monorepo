import { useCallback, useLayoutEffect, useState } from 'react'
import { useConnect } from '@account-kit/react'
import { useIsIframe } from '@summerfi/app-earn-ui'

export const AutoConnectSafe = () => {
  const [triedConnectingSafe, setTriedConnectingSafe] = useState(false)
  const isIframe = useIsIframe()
  const { connect } = useConnect()
  const connectSafe = useCallback(async () => {
    console.log('autoConnectSafe')

    try {
      setTriedConnectingSafe(true)
      const Safe = (await import('@safe-global/safe-apps-sdk')).default
      const safeConnector = (await import('wagmi/connectors')).safe

      const safeWallet = new Safe()
      const safeInfo = await safeWallet.safe.getInfo()

      connect(
        {
          connector: safeConnector({}),
          chainId: safeInfo.chainId,
        },
        {
          onError: (error) => {
            console.error('autoConnectSafe Error connecting to Safe:', error)
          },
          onSuccess: (data) => {
            console.log('autoConnectSafe Connected to Safe:', data)
          },
          onSettled: () => {
            console.log('autoConnectSafe Connection attempt to Safe settled')
          },
        },
      )
    } catch (error) {
      console.error('autoConnectSafe Error connecting to Safe:', error)
    }
  }, [setTriedConnectingSafe, isIframe])

  useLayoutEffect(() => {
    if (isIframe && !triedConnectingSafe) {
      connectSafe()
    }
  }, [isIframe, triedConnectingSafe, connectSafe])

  return null
}
