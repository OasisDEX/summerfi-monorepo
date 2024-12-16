import { type FC } from 'react'

import type { PortfolioRewardsRawData } from '@/app/server-handlers/portfolio/portfolio-rewards-handler'
import { PortfolioRewardsCards } from '@/features/portfolio/components/PortfolioRewardsCards/PortfolioRewardsCards'
import { PortfolioRewardsCountdown } from '@/features/portfolio/components/PortfolioRewardsCountdown/PortfolioRewardsCountdown'
import { PortfolioRewardsFaq } from '@/features/portfolio/components/PortfolioRewardsFaq/PortfolioRewardsFaq'

import classNames from './PortfolioRewards.module.scss'

interface PortfolioRewardsProps {
  rewardsData: PortfolioRewardsRawData[]
}

export const PortfolioRewards: FC<PortfolioRewardsProps> = () => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioRewardsCards />
      <PortfolioRewardsCountdown />
      <PortfolioRewardsFaq />
    </div>
  )
}
