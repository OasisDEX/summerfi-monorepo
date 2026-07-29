'use client'

import { type FC, useEffect, useReducer } from 'react'
import { NonOwnerPortfolioBanner, TabBar, Text, useEarnProtocolWallet } from '@summerfi/app-earn-ui'
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
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import { usePortfolioRewardsDataQuery } from '@/features/portfolio/api/get-portfolio-rewards-data'
import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader/PortfolioHeader'
import { PortfolioOverview } from '@/features/portfolio/components/PortfolioOverview/PortfolioOverview'
import { PortfolioRewards } from '@/features/portfolio/components/PortfolioRewards/PortfolioRewards'
import { PortfolioRewardsV2 } from '@/features/portfolio/components/PortfolioRewardsV2/PortfolioRewardsV2'
import { PortfolioUsdcAirdropBanner } from '@/features/portfolio/components/PortfolioUsdcAirdropBanner/PortfolioUsdcAirdropBanner'
import { PortfolioWallet } from '@/features/portfolio/components/PortfolioWallet/PortfolioWallet'
import { PortfolioYourActivity } from '@/features/portfolio/components/PortfolioYourActivity/PotfolioYourActivity'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { PortfolioTabs } from '@/features/portfolio/types'
import { calculateOverallSumr } from '@/helpers/calculate-overall-sumr'
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

  useEffect(() => {
    dispatch({
      type: 'update-delegatee',
      payload: rewardsData.sumrStakeDelegate.delegatedToV2,
    })
    dispatch({
      type: 'update-merkl-is-authorized-per-chain',
      payload: rewardsData.sumrToClaim.merklIsAuthorizedPerChain,
    })
  }, [rewardsData])

  const stakingV2Enabled = !!features?.StakingV2

  const handleTabChange = (tab: { id: string }) => {
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
    ...(stakingV2Enabled
      ? [
          {
            id: PortfolioTabs.REWARDS,
            label: '$SUMR Rewards',
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
        {ownerView && portfolioRewardsData?.usdcAirdrop && (
          <PortfolioUsdcAirdropBanner usdcAirdrop={portfolioRewardsData.usdcAirdrop} />
        )}
        <TabBar
          tabs={tabs}
          defaultIndex={tabs.findIndex((item) => item.id === activeTab)}
          handleTabChange={handleTabChange}
          useAsControlled
        />
      </div>
    </>
  )
}
