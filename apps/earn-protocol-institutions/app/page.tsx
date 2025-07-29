'use client'

import { useEffect } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import { usePathname, useRouter } from 'next/navigation'

import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { useUserWallet } from '@/hooks/use-user-wallet'

const InstitutionsPage = () => {
  const router = useRouter()
  const currentPath = usePathname()
  const { userWalletAddress } = useUserWallet()

  const isLoginPage = currentPath === '/'

  useEffect(() => {
    if (isLoginPage && userWalletAddress) {
      router.replace('/acme-crypto-corp') // Redirect to a default institution page
    }
  }, [isLoginPage, userWalletAddress, router])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        padding: '20px',
      }}
    >
      <Text variant="h1colorful">Welcome to the new thing</Text>
      <Text variant="h4">please log in</Text>
      <WalletLabel buttonVariant="primaryLarge" />
    </div>
  )
}

export default InstitutionsPage
