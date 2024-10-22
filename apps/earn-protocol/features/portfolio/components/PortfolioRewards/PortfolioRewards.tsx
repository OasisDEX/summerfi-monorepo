import { PortfolioRewardsBoost } from '@/features/portfolio/components/PortfolioRewardsBoost/PortfolioRewardsBoost'
import { PortfolioRewardsMore } from '@/features/portfolio/components/PortfolioRewardsMore/PortfolioRewardsMore'
import { PortfolioRewardsWhat } from '@/features/portfolio/components/PortfolioRewardsWhat/PortfolioRewardsWhat'

import classNames from './PortfolioRewards.module.scss'

export const PortfolioRewards = () => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioRewardsWhat />
      <PortfolioRewardsBoost />
      <PortfolioRewardsMore />
    </div>
  )
}
