import { type FC } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import { VaultDetailsSecurityAuditsExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityAuditsExpander'
import { VaultDetailsSecurityMoneyExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityMoneyExpander'
import { VaultDetailsSecurityProtocolStats } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityProtocolStats'
import { VaultDetailsSecurityStats } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityStats'
import { VaultDetailsSecuritySupportExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecuritySupportExpander'

import classNames from './VaultDetailsSecurity.module.css'

type VaultDetailsSecurityProps = {
  vault: SDKVaultishType
  totalRebalanceActions: number
  totalUsers: number
  tvl: number
}

export const VaultDetailsSecurity: FC<VaultDetailsSecurityProps> = ({
  vault,
  totalRebalanceActions,
  totalUsers,
  tvl,
}) => {
  return (
    <Card variant="cardSecondary">
      <div id="security" className={classNames.wrapper}>
        <VaultDetailsSecurityStats
          totalRebalanceActions={totalRebalanceActions}
          totalUsers={totalUsers}
          tvl={tvl}
          vault={vault}
        />
        <VaultDetailsSecurityProtocolStats />
        <VaultDetailsSecurityMoneyExpander vault={vault} />
        <VaultDetailsSecurityAuditsExpander />
        <VaultDetailsSecuritySupportExpander />
      </div>
    </Card>
  )
}
