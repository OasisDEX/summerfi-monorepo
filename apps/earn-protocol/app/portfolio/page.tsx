'use client'

import { type FC, useEffect } from 'react'
import { useAuthModal } from '@account-kit/react'
import { Button, Text } from '@summerfi/app-earn-ui'
import { useRouter, useSearchParams } from 'next/navigation'

import { PortfolioTabs } from '@/features/portfolio/types'
import { useUserWallet } from '@/hooks/use-user-wallet'

const PortfolioPage: FC = () => {
  const { userWalletAddress } = useUserWallet()
  const { openAuthModal } = useAuthModal()
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')

  useEffect(() => {
    if (userWalletAddress) {
      const tabParam =
        tab && Object.values(PortfolioTabs).includes(tab as PortfolioTabs) ? `?tab=${tab}` : ''

      push(`/portfolio/${userWalletAddress}${tabParam}`)
    }
  }, [userWalletAddress, push, tab])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 'var(--general-space-128)',
        paddingBottom: 'var(--general-space-128)',
      }}
    >
      <Text as="h3" variant="h3" style={{ marginBottom: 'var(--general-space-32)' }}>
        Connect your wallet to view your portfolio
      </Text>
      <Button variant="primaryLarge" onClick={openAuthModal}>
        Connect wallet
      </Button>
    </div>
  )
}

export default PortfolioPage
