'use client'

import { type FC, useEffect } from 'react'
import { useLogin } from '@privy-io/react-auth'
import { Button, Card, Text, useEarnProtocolWallet } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import { PortfolioTabs } from '@/features/portfolio/types'
import WalletIcon from '@/public/img/misc/wallet_icon_colorful.svg'

import styles from './page.module.css'

const PortfolioPage: FC = () => {
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { login } = useLogin()
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
        <Image src={WalletIcon} alt="Wallet icon" width={90} height={90} />
        <Text
          as="h5"
          variant="h5"
          style={{ marginBottom: 'var(--general-space-20)', marginTop: 'var(--general-space-32)' }}
        >
          Connect your wallet to view your portfolio
        </Text>
        <Button variant="primaryLarge" onClick={login} style={{ minWidth: 'unset' }}>
          Connect wallet
        </Button>
      </Card>
    </div>
  )
}

export default PortfolioPage
