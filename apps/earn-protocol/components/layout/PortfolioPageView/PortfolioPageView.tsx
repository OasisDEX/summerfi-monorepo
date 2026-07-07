'use client'

import { type FC, useEffect, useReducer } from 'react'
import {
  Icon,
  NonOwnerPortfolioBanner,
  TabBar,
  Text,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type RewardTokenPrices,
  type SDKVaultishType,
} from '@summerfi/app-types'

import {
  emptyClaimableRewards,
  emptyPortfolioSumrStakingV2Data,
  emptyRewardsData,
} from '@/components/layout/PortfolioPageView/constants'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { BeachClubPalmBackground } from '@/features/beach-club/components/BeachClubPalmBackground/BeachClubPalmBackground'
import { beachClubDefaultState, beachClubReducer } from '@/features/beach-club/state'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import { usePortfolioRewardsDataQuery } from '@/features/portfolio/api/get-portfolio-rewards-data'
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
  viewWalletAddress: string
  vaultsList: SDKVaultishType[]
  positions: PositionWithVault[]
  vaultsApyByNetworkMap: GetVaultsApyResponse
  rewardTokenPrices: RewardTokenPrices
}

export const PortfolioPageView: FC<PortfolioPageViewProps> = ({
  viewWalletAddress,
  vaultsList,
  positions,
  vaultsApyByNetworkMap,
  rewardTokenPrices,
}) => {
  const { features } = useSystemConfig()
  const handleButtonClick = useHandleButtonClickEvent()
  const { address: userWalletAddress, isLoadingAccount } = useEarnProtocolWallet()
  const ownerView = viewWalletAddress.toLowerCase() === userWalletAddress?.toLowerCase()
  const [activeTab, updateTab] = useTabStateQuery({
    tabs: PortfolioTabs,
    defaultTab: PortfolioTabs.OVERVIEW,
  })
  const {
    data: portfolioRewardsData,
    isError: isRewardsDataError,
    isPending: isRewardsDataPending,
  } = usePortfolioRewardsDataQuery(viewWalletAddress)

  const rewardsData = portfolioRewardsData?.rewardsData ?? emptyRewardsData
  const portfolioSumrStakingV2Data =
    portfolioRewardsData?.portfolioSumrStakingV2Data ?? emptyPortfolioSumrStakingV2Data
  const claimableRewards = portfolioRewardsData?.claimableRewards ?? emptyClaimableRewards

  const [state, dispatch] = useReducer(claimDelegateReducer, {
    ...claimDelegateState,
    walletAddress: viewWalletAddress,
  })

  const [beachClubState, beachClubDispatch] = useReducer(beachClubReducer, {
    ...beachClubDefaultState,
    walletAddress: viewWalletAddress,
  })

  useEffect(() => {
    dispatch({
      type: 'update-delegatee',
      payload: rewardsData.sumrStakeDelegate.delegatedToV2,
    })
    dispatch({
      type: 'update-merkl-is-authorized-per-chain',
      payload: rewardsData.sumrToClaim.merklIsAuthorizedPerChain,
    })
    beachClubDispatch({
      type: 'update-merkl-is-authorized-per-chain',
      payload: rewardsData.sumrToClaim.merklIsAuthorizedPerChain,
    })
  }, [rewardsData])

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
          isRewardsDataPending={isRewardsDataPending}
          vaultsApyByNetworkMap={vaultsApyByNetworkMap}
          rewardTokenPrices={rewardTokenPrices}
          viewWalletAddress={viewWalletAddress}
        />
      ),
    },
    {
      id: PortfolioTabs.WALLET,
      label: 'Wallet',
      content: (
        <PortfolioWallet
          vaultsList={vaultsList}
          vaultsApyByNetworkMap={vaultsApyByNetworkMap}
          rewardTokenPrices={rewardTokenPrices}
          viewWalletAddress={viewWalletAddress}
        />
      ),
    },
    {
      id: PortfolioTabs.YOUR_ACTIVITY,
      label: 'Your Activity',
      content: (
        <PortfolioYourActivity
          viewWalletAddress={viewWalletAddress}
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
          viewWalletAddress={viewWalletAddress}
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
                isRewardsDataPending={isRewardsDataPending}
                viewWalletAddress={viewWalletAddress}
                state={state}
                dispatch={dispatch}
                portfolioSumrStakingV2Data={portfolioSumrStakingV2Data}
                sumrPriceUsd={rewardTokenPrices.SUMR}
                claimableRewards={claimableRewards}
              />
            ),
          },
        ]
      : [
          {
            id: PortfolioTabs.REWARDS,
            label: '$SUMR Rewards',
            content: (
              <PortfolioRewards
                rewardsData={rewardsData}
                state={state}
                dispatch={dispatch}
                sumrPriceUsd={rewardTokenPrices.SUMR}
              />
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
                viewWalletAddress={viewWalletAddress}
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

  return (
    <>
      <NonOwnerPortfolioBanner isOwner={ownerView} walletStateLoaded={!isLoadingAccount} />
      <div className={classNames.portfolioPageViewWrapper}>
        {isRewardsDataError && (
          <Text as="p" variant="p3" style={{ marginBottom: 'var(--general-space-8)' }}>
            Some rewards data is temporarily unavailable.
          </Text>
        )}
        <PortfolioHeader
          viewWalletAddress={viewWalletAddress}
          totalSumr={overallSumr}
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
