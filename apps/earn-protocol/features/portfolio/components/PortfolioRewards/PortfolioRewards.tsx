import { type FC } from 'react'

import { PortfolioRewardsBoost } from '@/features/portfolio/components/PortfolioRewardsBoost/PortfolioRewardsBoost'
import { PortfolioRewardsMore } from '@/features/portfolio/components/PortfolioRewardsMore/PortfolioRewardsMore'
import { PortfolioRewardsWhat } from '@/features/portfolio/components/PortfolioRewardsWhat/PortfolioRewardsWhat'
import type { PortfolioRewardsRawData } from '@/server-handlers/portfolio/portfolio-rewards-handler'

import classNames from './PortfolioRewards.module.scss'

interface PortfolioRewardsProps {
  rewardsData: PortfolioRewardsRawData[]
}

export const PortfolioRewards: FC<PortfolioRewardsProps> = ({ rewardsData }) => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioRewardsWhat rewardsData={rewardsData} />
      <PortfolioRewardsBoost />
      <PortfolioRewardsMore />
    </div>
  )
}
