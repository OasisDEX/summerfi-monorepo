import { type Dispatch, type FC } from 'react'

import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
} from '@/features/claim-and-delegate/types'
import { PortfolioRewardsCards } from '@/features/portfolio/components/PortfolioRewardsCards/PortfolioRewardsCards'
import { PortfolioRewardsCountdown } from '@/features/portfolio/components/PortfolioRewardsCountdown/PortfolioRewardsCountdown'
import { PortfolioRewardsFaq } from '@/features/portfolio/components/PortfolioRewardsFaq/PortfolioRewardsFaq'

import classNames from './PortfolioRewards.module.css'

interface PortfolioRewardsProps {
  rewardsData: ClaimDelegateExternalData
  totalRays: number
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
}

export const PortfolioRewards: FC<PortfolioRewardsProps> = ({
  rewardsData,
  totalRays,
  state,
  dispatch,
}) => {
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
