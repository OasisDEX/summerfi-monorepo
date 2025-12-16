'use client'

import { type FC, useReducer } from 'react'
import {
  getPositionValues,
  Icon,
  NonOwnerPortfolioBanner,
  TabBar,
  Text,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type SingleSourceChartData,
  type SDKVaultishType,
} from '@summerfi/app-types'

import { type PortfolioAssetsResponse } from '@/app/server-handlers/cached/get-wallet-assets/types'
import { type BeachClubData } from '@/app/server-handlers/raw-calls/beach-club/types'
import { type BlogPosts } from '@/app/server-handlers/raw-calls/blog-posts/types'
import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { type PortfolioSumrStakingV2Data } from '@/app/server-handlers/raw-calls/sumr-staking-v2/types'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { BeachClubPalmBackground } from '@/features/beach-club/components/BeachClubPalmBackground/BeachClubPalmBackground'
import { beachClubDefaultState, beachClubReducer } from '@/features/beach-club/state'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { PortfolioBeachClub } from '@/features/portfolio/components/PortfolioBeachClub/PortfolioBeachClub'
import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader/PortfolioHeader'
import { PortfolioOverview } from '@/features/portfolio/components/PortfolioOverview/PortfolioOverview'
import { PortfolioRebalanceActivity } from '@/features/portfolio/components/PortfolioRebalanceActivity/PortfolioRebalanceActivity'
import { PortfolioRewards } from '@/features/portfolio/components/PortfolioRewards/PortfolioRewards'
import { PortfolioRewardsV2 } from '@/features/portfolio/components/PortfolioRewardsV2/PortfolioRewardsV2'
import { PortfolioWallet } from '@/features/portfolio/components/PortfolioWallet/PortfolioWallet'
import { PortfolioYourActivity } from '@/features/portfolio/components/PortfolioYourActivity/PotfolioYourActivity'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { PortfolioTabs } from '@/features/portfolio/types'
import { calculateOverallSumr } from '@/helpers/calculate-overall-sumr'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'
import { useTabStateQuery } from '@/hooks/use-tab-state'

import classNames from './PortfolioPageView.module.css'

interface PortfolioPageViewProps {
  walletAddress: string
  walletData: PortfolioAssetsResponse
  rewardsData: ClaimDelegateExternalData
  vaultsList: SDKVaultishType[]
  positions: PositionWithVault[]
  rebalanceActivity: RebalanceActivityPagination
  latestActivity: LatestActivityPagination
  positionsHistoricalChartMap: {
    [key: string]: SingleSourceChartData
  }
  vaultsApyByNetworkMap: GetVaultsApyResponse
  migratablePositions: MigratablePosition[]
  migrationBestVaultApy: MigrationEarningsDataByChainId
  beachClubData: BeachClubData
  blogPosts: BlogPosts
  portfolioSumrStakingV2Data: PortfolioSumrStakingV2Data
}

export const PortfolioPageView: FC<PortfolioPageViewProps> = ({
  walletAddress,
  walletData,
  rewardsData,
  vaultsList,
  positions,
  rebalanceActivity,
  latestActivity,
  positionsHistoricalChartMap,
  vaultsApyByNetworkMap,
  migratablePositions,
  migrationBestVaultApy,
  beachClubData,
  blogPosts,
  portfolioSumrStakingV2Data,
}) => {
  const { features } = useSystemConfig()
  const handleButtonClick = useHandleButtonClickEvent()
  const { userWalletAddress, isLoadingAccount } = useUserWallet()
  const ownerView = walletAddress.toLowerCase() === userWalletAddress?.toLowerCase()
  const [activeTab, updateTab] = useTabStateQuery({
    tabs: PortfolioTabs,
    defaultTab: PortfolioTabs.OVERVIEW,
  })
  const [state, dispatch] = useReducer(claimDelegateReducer, {
    ...claimDelegateState,
    delegatee: rewardsData.sumrStakeDelegate.delegatedToV2,
    walletAddress,
    merklIsAuthorizedPerChain: rewardsData.sumrToClaim.merklIsAuthorizedPerChain,
  })

  const [beachClubState, beachClubDispatch] = useReducer(beachClubReducer, {
    ...beachClubDefaultState,
    walletAddress,
    merklIsAuthorizedPerChain: rewardsData.sumrToClaim.merklIsAuthorizedPerChain,
  })

  const beachClubEnabled = !!features?.BeachClub
  const stakingV2Enabled = !!features?.StakingV2

  const handleTabChange = (tab: { id: string }) => {
    handleButtonClick(`portfolio-tab-${tab.id}`)
    updateTab(tab.id as PortfolioTabs)
  }

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
    ...(stakingV2Enabled
      ? [
          {
            id: PortfolioTabs.REWARDS,
            label: (
              <>
                SUMR Rewards{' '}
                <Text variant="p4semi" className={classNames.nowTradingLabel}>
                  Staking V2 - Earn SUMR + USDC
                </Text>
              </>
            ),
            content: (
              <PortfolioRewardsV2
                rewardsData={rewardsData}
                state={state}
                dispatch={dispatch}
                portfolioSumrStakingV2Data={portfolioSumrStakingV2Data}
              />
            ),
          },
        ]
      : [
          {
            id: PortfolioTabs.REWARDS,
            label: '$SUMR Rewards',
            content: (
              <PortfolioRewards rewardsData={rewardsData} state={state} dispatch={dispatch} />
            ),
          },
        ]),
    ...(beachClubEnabled
      ? [
          {
            id: PortfolioTabs.BEACH_CLUB,
            label: 'Beach Club',
            icon: <Icon iconName="beach_club_icon" size={24} />,
            content: (
              <PortfolioBeachClub
                walletAddress={walletAddress}
                beachClubData={beachClubData}
                merklIsAuthorizedPerChain={rewardsData.sumrToClaim.merklIsAuthorizedPerChain}
                state={beachClubState}
                dispatch={beachClubDispatch}
              />
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
          handleTabChange={handleTabChange}
          useAsControlled
        />
      </div>
      <BeachClubPalmBackground />
    </>
  )
}
