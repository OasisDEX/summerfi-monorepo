'use client'

import { type FC, useReducer } from 'react'

import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { PortfolioRewardsCards } from '@/features/portfolio/components/PortfolioRewardsCards/PortfolioRewardsCards'
import { PortfolioRewardsCountdown } from '@/features/portfolio/components/PortfolioRewardsCountdown/PortfolioRewardsCountdown'
import { PortfolioRewardsFaq } from '@/features/portfolio/components/PortfolioRewardsFaq/PortfolioRewardsFaq'

import classNames from './PortfolioRewards.module.scss'

interface PortfolioRewardsProps {
  rewardsData: ClaimDelegateExternalData
  totalRays: number
  walletAddress: string
}

export const PortfolioRewards: FC<PortfolioRewardsProps> = ({
  rewardsData,
  totalRays,
  walletAddress,
}) => {
  const [state, dispatch] = useReducer(claimDelegateReducer, {
    ...claimDelegateState,
    delegatee: rewardsData.sumrStakeDelegate.delegatedTo,
    walletAddress,
  })

  return (
    <div className={classNames.wrapper}>
      <PortfolioRewardsCards
        rewardsData={rewardsData}
        totalRays={totalRays}
        state={state}
        dispatch={dispatch}
      />
      <PortfolioRewardsCountdown />
      <PortfolioRewardsFaq />
    </div>
  )
}
