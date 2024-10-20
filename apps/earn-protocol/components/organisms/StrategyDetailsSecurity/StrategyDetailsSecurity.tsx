import { Card } from '@summerfi/app-earn-ui'

import { StrategyDetailsSecurityAuditsExpander } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecurityAuditsExpander'
import { StrategyDetailsSecurityMoneyExpander } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecurityMoneyExpander'
import { StrategyDetailsSecurityProtocolStats } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecurityProtocolStats'
import { StrategyDetailsSecurityStats } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecurityStats'
import { StrategyDetailsSecuritySupportExpander } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecuritySupportExpander'

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
