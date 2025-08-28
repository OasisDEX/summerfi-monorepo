'use client'

import { useLayoutEffect } from 'react'
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

  // wallet tracking for the SCA
  useLayoutEffect(() => {
    if (!isLoadingAccount && account?.address && user?.type) {
      EarnProtocolEvents.accountChanged({
        page: path,
        walletAddress: userAddress ?? account.address,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        network: chain.name ?? 'unknown',
        connectionMethod: user.type,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, isLoadingAccount, chain, user])

  return null
}
