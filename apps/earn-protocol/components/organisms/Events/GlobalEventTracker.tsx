'use client'

import { useLayoutEffect } from 'react'
import { useAccount, useChain, useUser } from '@account-kit/react'
import { AccountKitAccountType, accountType } from '@summerfi/app-earn-ui'
import { usePathname } from 'next/navigation'

import { trackAccountChange, trackPageViewTimed } from '@/helpers/mixpanel'
import { useUserWallet } from '@/hooks/use-user-wallet'

export const GlobalEventTracker = () => {
  const path = usePathname()
  const user = useUser()
  const { userWalletAddress: userAddress } = useUserWallet()
  const { chain } = useChain()
  const { account, isLoadingAccount } = useAccount({ type: accountType })

  // pageview tracking
  useLayoutEffect(() => {
    if (!isLoadingAccount) {
      trackPageViewTimed({
        path,
        userAddress: userAddress ?? undefined,
      })
    }
  }, [path, userAddress, isLoadingAccount])

  // wallet tracking for the SCA
  useLayoutEffect(() => {
    if (!isLoadingAccount && account?.address && user?.type) {
      trackAccountChange({
        account: account.address.toString() as `0x${string}`,
        network: chain.name,
        connectionMethod: user.type,
        accountType: account.type,
      })
    }
  }, [account, isLoadingAccount, chain, user])

  // wallet tracking for the EOA
  useLayoutEffect(() => {
    if (!isLoadingAccount && !account?.address && userAddress && user?.type) {
      trackAccountChange({
        account: userAddress as `0x${string}`,
        network: chain.name,
        connectionMethod: AccountKitAccountType.EOA,
      })
    }
  }, [userAddress, isLoadingAccount, account, chain, user])

  return null
}
