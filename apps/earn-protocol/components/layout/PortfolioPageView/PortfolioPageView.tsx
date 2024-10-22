'use client'

import { type FC } from 'react'
import { TabBar } from '@summerfi/app-earn-ui'

import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader/PortfolioHeader'
import { PortfolioOverview } from '@/features/portfolio/components/PortfolioOverview/PortfolioOverview'
import { PortfolioRebalanceActivity } from '@/features/portfolio/components/PortfolioRebalanceActivity/PortfolioRebalanceActivity'
import { PortfolioRewards } from '@/features/portfolio/components/PortfolioRewards/PortfolioRewards'
import { PortfolioWallet } from '@/features/portfolio/components/PortfolioWallet/PortfolioWallet'
import { type PortfolioAssetsResponse } from '@/server-handlers/portfolio/portfolio-wallet-assets-handler'

interface PortfolioPageViewProps {
  walletAddress: string
  walletData: PortfolioAssetsResponse
}

export const PortfolioPageView: FC<PortfolioPageViewProps> = ({ walletAddress, walletData }) => {
  const tabs = [
    { label: 'Overview', content: <PortfolioOverview /> },
    { label: 'Wallet', content: <PortfolioWallet walletData={walletData} /> },
    { label: 'Rebalance Activity', content: <PortfolioRebalanceActivity /> },
    { label: 'Rewards', content: <PortfolioRewards /> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <PortfolioHeader walletAddress={walletAddress} />
      <TabBar tabs={tabs} />
    </div>
  )
}
