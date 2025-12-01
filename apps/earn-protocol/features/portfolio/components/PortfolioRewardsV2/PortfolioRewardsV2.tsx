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
        usdcEarnedOnSumr={0.076} // maxApy as in staking landing page
        sumrPrice={0.0432} // sumrPrice as in staking landing page
        sumrRewardApy={0.035} // sumrRewardApy as in staking landing page
        stats={{
          totalSumrStaked: 13000000, // totalStaked as in staking manage view
          circulatingSupply: 50000000, // circulatingSupply as in staking manage view
          percentStaked: 0.265, // need to calculate as in totalStaked / circulatingSupply
          averageLockDuration: 8240000, // averageLockDuration as in staking manage view
        }}
        sumrUserData={{
          sumrAvailableToStake: 950, // sumrAvailableToStake as in staking manage view
          sumrStaked: 14350, // fetch using getUserStakingSumrStaked method from the useSdk
        }}
      />
    </div>
  )
}
