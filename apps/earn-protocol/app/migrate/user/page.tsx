'use client'

import { useUserWallet } from '@/hooks/use-user-wallet'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

const MigrationRedirectUserPage = () => {
  /**
   * This page is used to redirect users to their migration page based on their wallet address.
   * Used on the landing page (where we dont have access to the wallet address).
   */
  const { isLoadingAccount, userWalletAddress } = useUserWallet()

  useEffect(() => {
    if (!isLoadingAccount && userWalletAddress) {
      redirect(`/migrate/user/${userWalletAddress}`)
    }
    if (!isLoadingAccount && !userWalletAddress) {
      redirect('/not-found')
    }
  }, [isLoadingAccount, userWalletAddress])

  return <div>Redirecting...</div>
}

export default MigrationRedirectUserPage
