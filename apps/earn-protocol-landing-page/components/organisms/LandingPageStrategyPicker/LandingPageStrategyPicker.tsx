'use client'

import { StrategyCard, StrategySimulationForm } from '@summerfi/app-earn-ui'

import { type strategiesList } from '@/constants/dev-strategies-list'

import classNames from '@/components/organisms/LandingPageStrategyPicker/LandingPageStrategyPicker.module.scss'

export const LandingPageStrategyPicker = ({
  strategy,
}: {
  strategy: (typeof strategiesList)[number]
}) => {
  return (
    <div className={classNames.wrapper}>
      <StrategyCard {...strategy} />
      <StrategySimulationForm strategyData={strategy} />
    </div>
  )
}
