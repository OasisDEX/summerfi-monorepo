import { StrategyCard, StrategySimulationForm } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import classNames from '@/components/organisms/LandingPageStrategyPicker/LandingPageStrategyPicker.module.scss'

export const LandingPageStrategyPicker = ({ strategy }: { strategy: SDKVaultishType }) => {
  return (
    <div className={classNames.wrapper}>
      <StrategyCard {...strategy} />
      <StrategySimulationForm strategyData={strategy} />
    </div>
  )
}
