'use client'

import { StrategyCard, StrategySimulationForm } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'

import classNames from '@/components/organisms/LandingPageStrategyPicker/LandingPageStrategyPicker.module.scss'

export const LandingPageStrategyPicker = ({
  strategy,
}: {
  strategy: SDKVaultsListType[number]
}) => {
  return (
    <div className={classNames.wrapper}>
      <StrategyCard {...strategy} />
      <StrategySimulationForm strategyData={strategy} />
    </div>
  )
}
