'use client'

import { type FC } from 'react'
import { TabBar } from '@summerfi/app-earn-ui'
import { type SDKGlobalRebalancesType, type SDKVaultishType } from '@summerfi/app-types'

import { type PortfolioPositionsList } from '@/app/server-handlers/portfolio/portfolio-positions-handler'
import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader/PortfolioHeader'
import { PortfolioOverview } from '@/features/portfolio/components/PortfolioOverview/PortfolioOverview'
import { PortfolioRebalanceActivity } from '@/features/portfolio/components/PortfolioRebalanceActivity/PortfolioRebalanceActivity'
import { PortfolioRewards } from '@/features/portfolio/components/PortfolioRewards/PortfolioRewards'
import { PortfolioWallet } from '@/features/portfolio/components/PortfolioWallet/PortfolioWallet'
import { PortfolioTabs } from '@/features/portfolio/types'
import { useTabStateQuery } from '@/hooks/use-tab-state'

interface PortfolioPageViewProps {
  walletAddress: string
  walletData: PortfolioAssetsResponse
  rewardsData: ClaimDelegateExternalData
  vaultsList: SDKVaultishType[]
  positions: PortfolioPositionsList[]
  rebalancesList: SDKGlobalRebalancesType
}

export const PortfolioPageView: FC<PortfolioPageViewProps> = ({
  walletAddress,
  walletData,
  rewardsData,
  vaultsList,
  positions,
  rebalancesList,
}) => {
  const [activeTab, updateTab] = useTabStateQuery({
    tabs: PortfolioTabs,
    defaultTab: PortfolioTabs.OVERVIEW,
  })

  const tabs = [
    {
      id: PortfolioTabs.OVERVIEW,
      label: 'Overview',
      content: <PortfolioOverview positions={positions} vaultsList={vaultsList} />,
    },
    {
      id: PortfolioTabs.WALLET,
      label: 'Wallet',
      content: <PortfolioWallet walletData={walletData} vaultsList={vaultsList} />,
    },
    {
      id: PortfolioTabs.REBALANCE_ACTIVITY,
      label: 'Rebalance Activity',
      content: (
        <PortfolioRebalanceActivity rebalancesList={rebalancesList} walletAddress={walletAddress} />
      ),
    },
    {
      id: PortfolioTabs.REWARDS,
      label: 'SUMR Rewards',
      content: <PortfolioRewards rewardsData={rewardsData} />,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', width: '100%' }}>
      <PortfolioHeader walletAddress={walletAddress} />
      <TabBar
        tabs={tabs}
        defaultIndex={tabs.findIndex((item) => item.id === activeTab)}
        handleTabChange={(tab) => updateTab(tab.id as PortfolioTabs)}
      />
    </div>
  )
}
