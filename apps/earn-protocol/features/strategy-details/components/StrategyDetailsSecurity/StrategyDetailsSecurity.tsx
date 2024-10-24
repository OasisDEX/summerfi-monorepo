import { Card } from '@summerfi/app-earn-ui'

import { StrategyDetailsSecurityAuditsExpander } from '@/features/strategy-details/components/StrategyDetailsSecurity/StrategyDetailsSecurityAuditsExpander'
import { StrategyDetailsSecurityMoneyExpander } from '@/features/strategy-details/components/StrategyDetailsSecurity/StrategyDetailsSecurityMoneyExpander'
import { StrategyDetailsSecurityProtocolStats } from '@/features/strategy-details/components/StrategyDetailsSecurity/StrategyDetailsSecurityProtocolStats'
import { StrategyDetailsSecurityStats } from '@/features/strategy-details/components/StrategyDetailsSecurity/StrategyDetailsSecurityStats'
import { StrategyDetailsSecuritySupportExpander } from '@/features/strategy-details/components/StrategyDetailsSecurity/StrategyDetailsSecuritySupportExpander'

import classNames from './StrategyDetailsSecurity.module.scss'

export const StrategyDetailsSecurity = () => {
  return (
    <Card variant="cardPrimary">
      <div id="security" className={classNames.wrapper}>
        <StrategyDetailsSecurityStats />
        <StrategyDetailsSecurityProtocolStats />
        <StrategyDetailsSecurityMoneyExpander />
        <StrategyDetailsSecurityAuditsExpander />
        <StrategyDetailsSecuritySupportExpander />
      </div>
    </Card>
  )
}
