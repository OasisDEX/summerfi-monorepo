'use client'

import { type FC, useEffect } from 'react'
import { useAuthModal } from '@account-kit/react'
import { Button, Card, Text, useUserWallet } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import { BeachClubPalmBackground } from '@/features/beach-club/components/BeachClubPalmBackground/BeachClubPalmBackground'
import { PortfolioTabs } from '@/features/portfolio/types'
import WalletIconBeachClub from '@/public/img/misc/wallet_icon_beach_club.svg'
import WalletIcon from '@/public/img/misc/wallet_icon_colorful.svg'

import styles from './page.module.css'

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
    <div className={styles.pageWrapper}>
      <Card variant="cardSecondary" className={styles.card}>
        <Image src={getIcon(tab)} alt="Wallet icon" width={90} height={90} />
        <Text
          as="h5"
          variant="h5"
          style={{ marginBottom: 'var(--general-space-20)', marginTop: 'var(--general-space-32)' }}
        >
          {getTitle(tab)}
        </Text>
        <Button
          variant={getButtonVariant(tab)}
          onClick={openAuthModal}
          style={{ minWidth: 'unset' }}
        >
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
    </div>
  )
}

export default PortfolioPage
