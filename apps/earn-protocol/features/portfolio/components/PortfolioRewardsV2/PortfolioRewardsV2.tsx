import { type Dispatch, type FC } from 'react'

import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
} from '@/features/claim-and-delegate/types'
import { PortfolioRewardsCardsV2 } from '@/features/portfolio/components/PortfolioRewardsCardsV2/PortfolioRewardsCardsV2'
import { PortfolioStakingInfoCardV2 } from '@/features/portfolio/components/PortfolioStakingInfoCardV2/PortfolioStakingInfoCardV2'

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
      <PortfolioStakingInfoCardV2
        // TODOStakingV2
        usdcEarnedOnSumr={0.076}
        sumrPrice={0.0432}
        sumrRewardApy={0.035}
        stats={{
          totalSumrStaked: 13000000,
          circulatingSupply: 50000000,
          percentStaked: 0.265,
          averageLockDuration: 8240000,
        }}
        sumrUserData={{
          sumrAvailableToStake: 950,
          sumrStaked: 14350,
        }}
        // TODOStakingV2
      />
    </div>
  )
}
