'use client'

import { type FC, useEffect, useReducer } from 'react'
import { getPositionValues, NonOwnerPortfolioBanner, TabBar } from '@summerfi/app-earn-ui'
import {
  type SDKGlobalRebalancesType,
  type SDKVaultishType,
  type UsersActivity,
} from '@summerfi/app-types'

import { type PortfolioPositionsList } from '@/app/server-handlers/portfolio/portfolio-positions-handler'
import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader/PortfolioHeader'
import { PortfolioOverview } from '@/features/portfolio/components/PortfolioOverview/PortfolioOverview'
import { PortfolioRebalanceActivity } from '@/features/portfolio/components/PortfolioRebalanceActivity/PortfolioRebalanceActivity'
import { PortfolioRewards } from '@/features/portfolio/components/PortfolioRewards/PortfolioRewards'
import { PortfolioWallet } from '@/features/portfolio/components/PortfolioWallet/PortfolioWallet'
import { PortfolioYourActivity } from '@/features/portfolio/components/PortfolioYourActivity/PotfolioYourActivity'
import { PortfolioTabs } from '@/features/portfolio/types'
import { calculateOverallSumr } from '@/helpers/calculate-overall-sumr'
import { trackButtonClick } from '@/helpers/mixpanel'
import { useTabStateQuery } from '@/hooks/use-tab-state'
import { useUserWallet } from '@/hooks/use-user-wallet'

import classNames from './PortfolioPageView.module.scss'

interface PortfolioPageViewProps {
  walletAddress: string
  walletData: PortfolioAssetsResponse
  rewardsData: ClaimDelegateExternalData
  vaultsList: SDKVaultishType[]
  positions: PortfolioPositionsList[]
  rebalancesList: SDKGlobalRebalancesType
  userActivity: UsersActivity
  totalRays: number
}

export const PortfolioPageView: FC<PortfolioPageViewProps> = ({
  walletAddress,
  walletData,
  rewardsData,
  vaultsList,
  positions,
  rebalancesList,
  userActivity,
  totalRays,
}) => {
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

  const totalRebalances = positions.reduce(
    (acc, position) => acc + Number(position.vaultData.rebalanceCount),
    0,
  )

  const overallSumr = calculateOverallSumr(rewardsData)

  const tabs = [
    ...[
      {
        id: PortfolioTabs.OVERVIEW,
        label: 'Overview',
        content: (
          <PortfolioOverview
            positions={positions}
            vaultsList={vaultsList}
            rewardsData={rewardsData}
          />
        ),
      },
    ],
    {
      id: PortfolioTabs.WALLET,
      label: 'Wallet',
      content: <PortfolioWallet walletData={walletData} vaultsList={vaultsList} />,
    },
    ...[
      {
        id: PortfolioTabs.YOUR_ACTIVITY,
        label: 'Your Activity',
        content: <PortfolioYourActivity userActivity={userActivity} />,
      },
      {
        id: PortfolioTabs.REBALANCE_ACTIVITY,
        label: 'Rebalance Activity',
        content: (
          <PortfolioRebalanceActivity
            rebalancesList={rebalancesList}
            walletAddress={walletAddress}
            totalRebalances={totalRebalances}
            vaultsList={vaultsList}
          />
        ),
      },
    ],
    {
      id: PortfolioTabs.REWARDS,
      label: 'SUMR Rewards',
      content: (
        <PortfolioRewards
          rewardsData={rewardsData}
          totalRays={totalRays}
          state={state}
          dispatch={dispatch}
        />
      ),
    },
  ]

  const totalWalletValue =
    positions.reduce(
      (acc, position) =>
        acc +
        getPositionValues({
          positionData: position.positionData,
          vaultData: position.vaultData,
        }).netEarningsUSD.toNumber(),

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
        />
        <TabBar
          tabs={tabs}
          defaultIndex={tabs.findIndex((item) => item.id === activeTab)}
          handleTabChange={(tab) => updateTab(tab.id as PortfolioTabs)}
        />
      </div>
    </>
  )
}
