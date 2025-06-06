'use client'

import { type FC, useEffect } from 'react'
import { useAuthModal } from '@account-kit/react'
import { Button, Card, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import { BeachClubPalmBackground } from '@/features/beach-club/components/BeachClubPalmBackground/BeachClubPalmBackground'
import { PortfolioTabs } from '@/features/portfolio/types'
import { useUserWallet } from '@/hooks/use-user-wallet'
import WalletIconBeachClub from '@/public/img/misc/wallet_icon_beach_club.svg'
import WalletIcon from '@/public/img/misc/wallet_icon_colorful.svg'

const getIcon = (tab: PortfolioTabs | null) => {
  if (tab === PortfolioTabs.BEACH_CLUB) {
    return WalletIconBeachClub
  }

  return WalletIcon
}

const getTitle = (tab: PortfolioTabs | null) => {
  if (tab === PortfolioTabs.BEACH_CLUB) {
    return 'Connect your wallet to access the Beach Club page'
  }

  return 'Connect your wallet to view your portfolio'
}

const getButtonVariant = (tab: PortfolioTabs | null) => {
  if (tab === PortfolioTabs.BEACH_CLUB) {
    return 'beachClubLarge'
  }

  return 'primaryLarge'
}

const PortfolioPage: FC = () => {
  const { userWalletAddress } = useUserWallet()
  const { openAuthModal } = useAuthModal()
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') as PortfolioTabs | null

  useEffect(() => {
    if (userWalletAddress) {
      const tabParam =
        tab && Object.values(PortfolioTabs).includes(tab as PortfolioTabs) ? `?tab=${tab}` : ''

      push(`/portfolio/${userWalletAddress}${tabParam}`)
    }
  }, [userWalletAddress, push, tab])

  return (
    <Card
      variant="cardSecondary"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'var(--general-space-64)',
        marginTop: 'var(--general-space-128)',
        marginBottom: 'var(--general-space-128)',
        maxWidth: '647px',
        border: '1px solid var(--earn-protocol-neutral-70)',
      }}
    >
      <Image src={getIcon(tab)} alt="Wallet icon" width={90} height={90} />
      <Text
        as="h5"
        variant="h5"
        style={{ marginBottom: 'var(--general-space-20)', marginTop: 'var(--general-space-32)' }}
      >
        {getTitle(tab)}
      </Text>
      <Button variant={getButtonVariant(tab)} onClick={openAuthModal} style={{ minWidth: 'unset' }}>
        Connect wallet
      </Button>
      {tab === PortfolioTabs.BEACH_CLUB && (
        <BeachClubPalmBackground
          rightPalmSyles={{ top: 'unset', bottom: '0', opacity: 0.4 }}
          leftPalmSyles={{ top: 'unset', bottom: '0', opacity: 0.4 }}
          bottomGradientStyles={{ display: 'none' }}
          topGradientStyles={{ display: 'none' }}
        />
      )}
    </Card>
  )
}

export default PortfolioPage
