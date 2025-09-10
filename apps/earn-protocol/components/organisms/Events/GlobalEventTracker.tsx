'use client'

import { useLayoutEffect, useRef } from 'react'
import { useAccount, useChain, useUser } from '@account-kit/react'
import { accountType, useUserWallet } from '@summerfi/app-earn-ui'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

export const GlobalEventTracker = () => {
  const path = usePathname()
  const user = useUser()
  const { userWalletAddress: userAddress } = useUserWallet()
  const { chain } = useChain()
  const { account, isLoadingAccount } = useAccount({ type: accountType })

  // Track previous wallet state for connection/disconnection events
  const prevWalletRef = useRef<{
    address: string | undefined
    isConnected: boolean
    connectionMethod: string | undefined
  }>({
    address: undefined,
    isConnected: false,
    connectionMethod: undefined,
  })

  // pageview tracking
  useLayoutEffect(() => {
    if (!isLoadingAccount) {
      EarnProtocolEvents.pageViewed({
        page: path,
        walletAddress: userAddress ?? undefined,
        connectionMethod: user?.type,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, isLoadingAccount])

  // wallet connection/disconnection and account change tracking
  useLayoutEffect(() => {
    if (isLoadingAccount) return

    const currentAddress = userAddress ?? account?.address
    const currentConnectionMethod = user?.type
    const isCurrentlyConnected = Boolean(currentAddress && currentConnectionMethod)

    const prevState = prevWalletRef.current
    const wasConnected = prevState.isConnected

    // Track wallet connection
    if (!wasConnected && isCurrentlyConnected) {
      EarnProtocolEvents.walletConnected({
        page: path,
        walletAddress: currentAddress,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        network: chain.name ?? 'unknown',
        connectionMethod: currentConnectionMethod,
      })
    }

    // Track wallet disconnection
    if (wasConnected && !isCurrentlyConnected) {
      EarnProtocolEvents.walletDisconnected({
        page: path,
        walletAddress: prevState.address,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        network: chain.name ?? 'unknown',
        connectionMethod: prevState.connectionMethod,
      })
    }

    // Track account change (different wallet address while staying connected)
    if (wasConnected && isCurrentlyConnected && prevState.address !== currentAddress) {
      EarnProtocolEvents.accountChanged({
        page: path,
        walletAddress: currentAddress,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        network: chain.name ?? 'unknown',
        connectionMethod: currentConnectionMethod,
      })
    }

    // Update previous state
    prevWalletRef.current = {
      address: currentAddress,
      isConnected: isCurrentlyConnected,
      connectionMethod: currentConnectionMethod,
    }
  }, [account, userAddress, user, isLoadingAccount, chain, path])

  return null
}
