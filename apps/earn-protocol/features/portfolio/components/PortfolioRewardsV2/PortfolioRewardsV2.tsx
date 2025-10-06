import { type Dispatch, type FC } from 'react'

import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
} from '@/features/claim-and-delegate/types'
import { PortfolioRewardsCardsV2 } from '@/features/portfolio/components/PortfolioRewardsCardsV2/PortfolioRewardsCardsV2'
import { PortfolioYourStakedSumr } from '@/features/portfolio/components/PortfolioYourStakedSumr/PortfolioYourStakedSumr'

import classNames from './PortfolioRewardsV2.module.css'

interface PortfolioRewardsV2Props {
  rewardsData: ClaimDelegateExternalData
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
}

export const PortfolioRewardsV2: FC<PortfolioRewardsV2Props> = ({
  rewardsData,
  state,
  dispatch,
}) => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioRewardsCardsV2 rewardsData={rewardsData} state={state} dispatch={dispatch} />
      <PortfolioYourStakedSumr />
    </div>
  )
}
