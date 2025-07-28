'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'

import { useUserWallet } from '@/hooks/use-user-wallet'

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
      redirect('/')
    }
  }, [isLoadingAccount, userWalletAddress])

  return <div>Redirecting...</div>
}

export default MigrationRedirectUserPage
