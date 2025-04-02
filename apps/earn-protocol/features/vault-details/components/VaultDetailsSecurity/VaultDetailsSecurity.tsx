import { type FC } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import { VaultDetailsSecurityAuditsExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityAuditsExpander'
import { VaultDetailsSecurityMoneyExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityMoneyExpander'
import { VaultDetailsSecurityProtocolStats } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityProtocolStats'
import { VaultDetailsSecurityStats } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityStats'
import { VaultDetailsSecuritySupportExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecuritySupportExpander'

import classNames from './VaultDetailsSecurity.module.scss'

type VaultDetailsSecurityProps = {
  vault: SDKVaultishType
}

export const VaultDetailsSecurity: FC<VaultDetailsSecurityProps> = ({ vault }) => {
  return (
    <Card variant="cardSecondary">
      <div id="security" className={classNames.wrapper}>
        <VaultDetailsSecurityStats />
        <VaultDetailsSecurityProtocolStats />
        <VaultDetailsSecurityMoneyExpander vault={vault} />
        <VaultDetailsSecurityAuditsExpander />
        <VaultDetailsSecuritySupportExpander />
      </div>
    </Card>
  )
}
