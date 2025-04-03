import { type FC } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultsListType } from '@summerfi/app-types'

import { VaultDetailsSecurityAuditsExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityAuditsExpander'
import { VaultDetailsSecurityMoneyExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityMoneyExpander'
import { VaultDetailsSecurityProtocolStats } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityProtocolStats'
import { VaultDetailsSecurityStats } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityStats'
import { VaultDetailsSecuritySupportExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecuritySupportExpander'

import classNames from './VaultDetailsSecurity.module.scss'

type VaultDetailsSecurityProps = {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  totalRebalanceActions: number
  totalUsers: number
}

export const VaultDetailsSecurity: FC<VaultDetailsSecurityProps> = ({
  vault,
  vaults,
  totalRebalanceActions,
  totalUsers,
}) => {
  return (
    <Card variant="cardSecondary">
      <div id="security" className={classNames.wrapper}>
        <VaultDetailsSecurityStats
          vaults={vaults}
          totalRebalanceActions={totalRebalanceActions}
          totalUsers={totalUsers}
        />
        <VaultDetailsSecurityProtocolStats />
        <VaultDetailsSecurityMoneyExpander vault={vault} />
        <VaultDetailsSecurityAuditsExpander />
        <VaultDetailsSecuritySupportExpander />
      </div>
    </Card>
  )
}
