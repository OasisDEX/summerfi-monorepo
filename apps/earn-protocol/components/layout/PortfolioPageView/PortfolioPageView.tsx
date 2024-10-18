'use client'

import { type FC } from 'react'
import { TabBar } from '@summerfi/app-earn-ui'

import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader/PortfolioHeader'
import { PortfolioOverview } from '@/features/portfolio/components/PortfolioOverview/PortfolioOverview'
import { PortfolioWallet } from '@/features/portfolio/components/PortfolioWallet/PortfolioWallet'

const tabs = [
  { label: 'Overview', content: <PortfolioOverview /> },
  { label: 'Wallet', content: <PortfolioWallet /> },
  { label: 'Rebalance Activity', content: <div>Rebalance content here</div> },
  { label: 'Rewards', content: <div>Rewards content here</div> },
]

interface PortfolioPageViewProps {
  walletAddress: string
}

export const PortfolioPageView: FC<PortfolioPageViewProps> = ({ walletAddress }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <PortfolioHeader walletAddress={walletAddress} />
      <TabBar tabs={tabs} />
    </div>
  )
}
