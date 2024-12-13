import { Card } from '@summerfi/app-earn-ui'

import { VaultDetailsSecurityAuditsExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityAuditsExpander'
import { VaultDetailsSecurityMoneyExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityMoneyExpander'
import { VaultDetailsSecurityProtocolStats } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityProtocolStats'
import { VaultDetailsSecurityStats } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityStats'
import { VaultDetailsSecuritySupportExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecuritySupportExpander'

import classNames from './VaultDetailsSecurity.module.scss'

export const VaultDetailsSecurity = () => {
  return (
    <Card variant="cardSecondary">
      <div id="security" className={classNames.wrapper}>
        <VaultDetailsSecurityStats />
        <VaultDetailsSecurityProtocolStats />
        <VaultDetailsSecurityMoneyExpander />
        <VaultDetailsSecurityAuditsExpander />
        <VaultDetailsSecuritySupportExpander />
      </div>
    </Card>
  )
}
