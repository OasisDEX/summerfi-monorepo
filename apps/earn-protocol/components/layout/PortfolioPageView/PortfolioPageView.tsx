'use client'

import { type FC, useEffect, useReducer } from 'react'
import { getPositionValues, Icon, NonOwnerPortfolioBanner, TabBar } from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type HistoryChartData,
  type SDKVaultishType,
} from '@summerfi/app-types'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { type BlogPosts } from '@/app/server-handlers/blog-posts/types'
import { type MigratablePosition } from '@/app/server-handlers/migration'
import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { BeachClubPalmBackground } from '@/features/beach-club/components/BeachClubPalmBackground/BeachClubPalmBackground'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { PortfolioBeachClub } from '@/features/portfolio/components/PortfolioBeachClub/PortfolioBeachClub'
import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader/PortfolioHeader'
import { PortfolioOverview } from '@/features/portfolio/components/PortfolioOverview/PortfolioOverview'
import { PortfolioRebalanceActivity } from '@/features/portfolio/components/PortfolioRebalanceActivity/PortfolioRebalanceActivity'
import { PortfolioRewards } from '@/features/portfolio/components/PortfolioRewards/PortfolioRewards'
import { PortfolioWallet } from '@/features/portfolio/components/PortfolioWallet/PortfolioWallet'
import { PortfolioYourActivity } from '@/features/portfolio/components/PortfolioYourActivity/PotfolioYourActivity'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { PortfolioTabs } from '@/features/portfolio/types'
import { calculateOverallSumr } from '@/helpers/calculate-overall-sumr'
import { trackButtonClick } from '@/helpers/mixpanel'
import { useTabStateQuery } from '@/hooks/use-tab-state'
import { useUserWallet } from '@/hooks/use-user-wallet'

import classNames from './PortfolioPageView.module.css'

interface PortfolioPageViewProps {
  walletAddress: string
  walletData: PortfolioAssetsResponse
  rewardsData: ClaimDelegateExternalData
  vaultsList: SDKVaultishType[]
  positions: PositionWithVault[]
  rebalanceActivity: RebalanceActivityPagination
  latestActivity: LatestActivityPagination
  totalRays: number
  positionsHistoricalChartMap: {
    [key: string]: HistoryChartData
  }
  vaultsApyByNetworkMap: GetVaultsApyResponse
  migratablePositions: MigratablePosition[]
  migrationBestVaultApy: MigrationEarningsDataByChainId
  beachClubData: BeachClubData
  blogPosts: BlogPosts
}

export const PortfolioPageView: FC<PortfolioPageViewProps> = ({
  walletAddress,
  walletData,
  rewardsData,
  vaultsList,
  positions,
  rebalanceActivity,
  latestActivity,
  totalRays,
  positionsHistoricalChartMap,
  vaultsApyByNetworkMap,
  migratablePositions,
  migrationBestVaultApy,
  beachClubData,
  blogPosts,
}) => {
  const { features } = useSystemConfig()
  const { userWalletAddress, isLoadingAccount } = useUserWallet()
  const ownerView = walletAddress.toLowerCase() === userWalletAddress?.toLowerCase()
  const [activeTab, updateTab] = useTabStateQuery({
    tabs: PortfolioTabs,
    defaultTab: PortfolioTabs.OVERVIEW,
  })
  const [state, dispatch] = useReducer(claimDelegateReducer, {
    ...claimDelegateState,
    delegatee: rewardsData.sumrStakeDelegate.delegatedTo,
    walletAddress,
  })

  const beachClubEnabled = !!features?.BeachClub

  useEffect(() => {
    trackButtonClick({
      id: 'TabChange_Portfolio',
      page: `/portfolio/${walletAddress}`,
      userAddress: userWalletAddress,
      activeTab,
    })
    // only on tab change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const overallSumr = calculateOverallSumr(rewardsData)

  const tabs = [
    {
      id: PortfolioTabs.OVERVIEW,
      label: 'Overview',
      content: (
        <PortfolioOverview
          positions={positions}
          vaultsList={vaultsList}
          rewardsData={rewardsData}
          positionsHistoricalChartMap={positionsHistoricalChartMap}
          vaultsApyByNetworkMap={vaultsApyByNetworkMap}
          migratablePositions={migratablePositions}
          walletAddress={walletAddress}
          migrationBestVaultApy={migrationBestVaultApy}
          blogPosts={blogPosts}
        />
      ),
    },
    {
      id: PortfolioTabs.WALLET,
      label: 'Wallet',
      content: (
        <PortfolioWallet
          walletData={walletData}
          vaultsList={vaultsList}
          vaultsApyByNetworkMap={vaultsApyByNetworkMap}
        />
      ),
    },
    {
      id: PortfolioTabs.YOUR_ACTIVITY,
      label: 'Your Activity',
      content: (
        <PortfolioYourActivity
          latestActivity={latestActivity}
          walletAddress={walletAddress}
          vaultsList={vaultsList}
          positions={positions}
        />
      ),
    },
    {
      id: PortfolioTabs.REBALANCE_ACTIVITY,
      label: 'Rebalance Activity',
      content: (
        <PortfolioRebalanceActivity
          rebalanceActivity={rebalanceActivity}
          walletAddress={walletAddress}
          positions={positions}
          vaultsList={vaultsList}
        />
      ),
    },
    {
      id: PortfolioTabs.REWARDS,
      label: '$SUMR Rewards',
      content: (
        <PortfolioRewards
          rewardsData={rewardsData}
          totalRays={totalRays}
          state={state}
          dispatch={dispatch}
        />
      ),
    },
    ...(beachClubEnabled
      ? [
          {
            id: PortfolioTabs.BEACH_CLUB,
            label: 'Beach Club',
            icon: <Icon iconName="beach_club_icon" size={24} />,
            content: (
              <PortfolioBeachClub walletAddress={walletAddress} beachClubData={beachClubData} />
            ),
            activeColor: 'var(--beach-club-tab-underline)',
          },
        ]
      : []),
  ]

  const totalWalletValue =
    positions.reduce(
      (acc, position) => acc + getPositionValues(position).netEarningsUSD.toNumber(),

      0,
    ) + walletData.totalAssetsUsdValue

  return (
    <>
      <NonOwnerPortfolioBanner isOwner={ownerView} walletStateLoaded={!isLoadingAccount} />
      <div className={classNames.portfolioPageViewWrapper}>
        <PortfolioHeader
          walletAddress={walletAddress}
          totalSumr={overallSumr}
          totalWalletValue={totalWalletValue}
          walletData={walletData}
          isOwner={ownerView}
        />
        <TabBar
          tabs={tabs}
          defaultIndex={tabs.findIndex((item) => item.id === activeTab)}
          handleTabChange={(tab) => updateTab(tab.id as PortfolioTabs)}
          useAsControlled
        />
      </div>
      <BeachClubPalmBackground />
    </>
  )
}
