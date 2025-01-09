import { type FC } from 'react'

import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { PortfolioRewardsCards } from '@/features/portfolio/components/PortfolioRewardsCards/PortfolioRewardsCards'
import { PortfolioRewardsCountdown } from '@/features/portfolio/components/PortfolioRewardsCountdown/PortfolioRewardsCountdown'
import { PortfolioRewardsFaq } from '@/features/portfolio/components/PortfolioRewardsFaq/PortfolioRewardsFaq'

import classNames from './PortfolioRewards.module.scss'

interface PortfolioRewardsProps {
  rewardsData: ClaimDelegateExternalData
  totalRays: number
}

export const PortfolioRewards: FC<PortfolioRewardsProps> = ({ rewardsData, totalRays }) => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioRewardsCards rewardsData={rewardsData} totalRays={totalRays} />
      <PortfolioRewardsCountdown />
      <PortfolioRewardsFaq />
    </div>
  )
}
