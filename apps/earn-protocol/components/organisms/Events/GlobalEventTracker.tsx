'use client'

import { useLayoutEffect, useRef } from 'react'
import { useEarnProtocolChain, useEarnProtocolWallet } from '@summerfi/app-earn-ui'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'
import { usePageviewEvent } from '@/hooks/use-mixpanel-event'

export const GlobalEventTracker = () => {
  const path = usePathname()
  const pageViewedEventHandler = usePageviewEvent()
  const { chain } = useEarnProtocolChain()
  const { address: userWalletAddress, isLoadingAccount } = useEarnProtocolWallet()

  // Track previous wallet state for connection/disconnection events
  const prevWalletRef = useRef<{
    address: string | undefined
    isConnected: boolean
  }>({
    address: undefined,
    isConnected: false,
  })

  // pageview tracking
  useLayoutEffect(() => {
    if (!isLoadingAccount) {
      pageViewedEventHandler(path)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, isLoadingAccount])

  // wallet connection/disconnection and account change tracking
  useLayoutEffect(() => {
    if (isLoadingAccount) return

    const isCurrentlyConnected = Boolean(userWalletAddress)

    const prevState = prevWalletRef.current
    const wasConnected = prevState.isConnected

    // Track wallet connection
    if (!wasConnected && isCurrentlyConnected) {
      EarnProtocolEvents.walletConnected({
        page: path,
        walletAddress: userWalletAddress,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        network: chain.name ?? 'unknown',
      })
    }

    // Track wallet disconnection
    if (wasConnected && !isCurrentlyConnected) {
      EarnProtocolEvents.walletDisconnected({
        page: path,
        walletAddress: prevState.address,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        network: chain.name ?? 'unknown',
      })
    }

    // Track account change (different wallet address while staying connected)
    if (wasConnected && isCurrentlyConnected && prevState.address !== userWalletAddress) {
      EarnProtocolEvents.accountChanged({
        page: path,
        walletAddress: userWalletAddress,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        network: chain.name ?? 'unknown',
      })
    }

    // Update previous state
    prevWalletRef.current = {
      address: userWalletAddress,
      isConnected: isCurrentlyConnected,
    }
  }, [isLoadingAccount, chain, path, userWalletAddress])

  return null
}
