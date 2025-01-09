import { type FC } from 'react'

import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { PortfolioRewardsCards } from '@/features/portfolio/components/PortfolioRewardsCards/PortfolioRewardsCards'
import { PortfolioRewardsCountdown } from '@/features/portfolio/components/PortfolioRewardsCountdown/PortfolioRewardsCountdown'
import { PortfolioRewardsFaq } from '@/features/portfolio/components/PortfolioRewardsFaq/PortfolioRewardsFaq'

import classNames from './PortfolioRewards.module.scss'

interface PortfolioRewardsProps {
  rewardsData: ClaimDelegateExternalData
}

export const PortfolioRewards: FC<PortfolioRewardsProps> = ({ rewardsData }) => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioRewardsCards rewardsData={rewardsData} />
      <PortfolioRewardsCountdown />
      <PortfolioRewardsFaq />
    </div>
  )
}
