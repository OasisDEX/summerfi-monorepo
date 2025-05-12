'use client'

import { type FC } from 'react'
import { NonOwnerPortfolioBanner, SkeletonLine, TabBar } from '@summerfi/app-earn-ui'

import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader/PortfolioHeader'
import { PortfolioTabs } from '@/features/portfolio/types'
import { useTabStateQuery } from '@/hooks/use-tab-state'

import classNames from './PortfolioPageView.module.css'

const SimplePortfolioSkeleton = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
    <div style={{ display: 'flex', gap: '2%' }}>
      <SkeletonLine height={140} radius="var(--radius-roundish)" />
      <SkeletonLine height={140} radius="var(--radius-roundish)" />
      <SkeletonLine height={140} radius="var(--radius-roundish)" />
    </div>
    <SkeletonLine height={340} radius="var(--radius-roundish)" />
    <SkeletonLine height={340} radius="var(--radius-roundish)" />
    <SkeletonLine height={340} radius="var(--radius-roundish)" />
  </div>
)

export const PortfolioPageViewLoadingState: FC = () => {
  const [activeTab, updateTab] = useTabStateQuery({
    tabs: PortfolioTabs,
    defaultTab: PortfolioTabs.OVERVIEW,
  })
  const tabs = [
    ...[
      {
        id: PortfolioTabs.OVERVIEW,
        label: 'Overview',
        content: SimplePortfolioSkeleton,
      },
    ],
    {
      id: PortfolioTabs.WALLET,
      label: 'Wallet',
      content: SimplePortfolioSkeleton,
    },
    ...[
      {
        id: PortfolioTabs.YOUR_ACTIVITY,
        label: 'Your Activity',
        content: SimplePortfolioSkeleton,
      },
      {
        id: PortfolioTabs.REBALANCE_ACTIVITY,
        label: 'Rebalance Activity',
        content: SimplePortfolioSkeleton,
      },
    ],
    {
      id: PortfolioTabs.REWARDS,
      label: '$SUMR Rewards',
      content: SimplePortfolioSkeleton,
    },
  ]

  return (
    <>
      <NonOwnerPortfolioBanner isOwner walletStateLoaded />
      <div className={classNames.portfolioPageViewLoadingStateWrapper}>
        <PortfolioHeader walletAddress="" isLoading />
        <TabBar
          tabs={tabs}
          defaultIndex={tabs.findIndex((item) => item.id === activeTab)}
          handleTabChange={(tab) => updateTab(tab.id as PortfolioTabs)}
        />
      </div>
    </>
  )
}
