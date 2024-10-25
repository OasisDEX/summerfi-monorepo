'use client'

import { type FC } from 'react'
import { TabBar } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'

import { type PortfolioRewardsRawData } from '@/app/server-handlers/portfolio/portfolio-rewards-handler'
import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader/PortfolioHeader'
import { PortfolioOverview } from '@/features/portfolio/components/PortfolioOverview/PortfolioOverview'
import { PortfolioRebalanceActivity } from '@/features/portfolio/components/PortfolioRebalanceActivity/PortfolioRebalanceActivity'
import { PortfolioRewards } from '@/features/portfolio/components/PortfolioRewards/PortfolioRewards'
import { PortfolioWallet } from '@/features/portfolio/components/PortfolioWallet/PortfolioWallet'

interface PortfolioPageViewProps {
  walletAddress: string
  walletData: PortfolioAssetsResponse
  rewardsData: PortfolioRewardsRawData[]
  strategiesList: SDKVaultsListType
}

export const PortfolioPageView: FC<PortfolioPageViewProps> = ({
  walletAddress,
  walletData,
  rewardsData,
  strategiesList,
}) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <PortfolioOverview strategiesList={strategiesList} />,
    },
    {
      id: 'wallet',
      label: 'Wallet',
      content: <PortfolioWallet walletData={walletData} strategiesList={strategiesList} />,
    },
    {
      id: 'rebalance-activity',
      label: 'Rebalance Activity',
      content: <PortfolioRebalanceActivity />,
    },
    {
      id: 'rewards',
      label: 'Rewards',
      content: <PortfolioRewards rewardsData={rewardsData} />,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <PortfolioHeader walletAddress={walletAddress} />
      <TabBar tabs={tabs} />
    </div>
  )
}
