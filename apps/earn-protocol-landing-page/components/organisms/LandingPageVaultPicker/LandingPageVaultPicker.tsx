import { VaultCard, VaultSimulationForm } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import classNames from '@/components/organisms/LandingPageVaultPicker/LandingPageVaultPicker.module.scss'

export const LandingPageVaultPicker = ({ vault }: { vault: SDKVaultishType }) => {
  return (
    <div className={classNames.wrapper}>
      <VaultCard {...vault} />
      <VaultSimulationForm vaultData={vault} />
    </div>
  )
}
