'use client'

import { useEffect } from 'react'
import { useEarnProtocolWallet } from '@summerfi/app-earn-ui'
import { redirect } from 'next/navigation'

const MigrationRedirectUserPage = () => {
  /**
   * This page is used to redirect users to their migration page based on their wallet address.
   * Used on the landing page (where we dont have access to the wallet address).
   */
  const { address: userWalletAddress, isLoadingAccount } = useEarnProtocolWallet()

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
