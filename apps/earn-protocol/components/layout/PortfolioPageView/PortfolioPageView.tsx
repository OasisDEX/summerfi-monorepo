'use client'

import { type FC } from 'react'
import { TabBar } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import { type PortfolioPositionsList } from '@/app/server-handlers/portfolio/portfolio-positions-handler'
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
  vaultsList: SDKVaultishType[]
  positions: PortfolioPositionsList[]
}

export const PortfolioPageView: FC<PortfolioPageViewProps> = ({
  walletAddress,
  walletData,
  rewardsData,
  vaultsList,
  positions,
}) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <PortfolioOverview positions={positions} vaultsList={vaultsList} />,
    },
    {
      id: 'wallet',
      label: 'Wallet',
      content: <PortfolioWallet walletData={walletData} vaultsList={vaultsList} />,
    },
    {
      id: 'rebalance-activity',
      label: 'Rebalance Activity',
      content: <PortfolioRebalanceActivity />,
    },
    {
      id: 'rewards',
      label: 'SUMR Rewards',
      content: <PortfolioRewards rewardsData={rewardsData} />,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', width: '100%' }}>
      <PortfolioHeader walletAddress={walletAddress} />
      <TabBar tabs={tabs} />
    </div>
  )
}
