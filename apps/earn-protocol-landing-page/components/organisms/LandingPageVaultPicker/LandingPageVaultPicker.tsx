import { VaultCard, VaultSimulationForm } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import landingPageVaultPickerStyles from '@/components/organisms/LandingPageVaultPicker/LandingPageVaultPicker.module.scss'

export const LandingPageVaultPicker = ({ vault }: { vault: SDKVaultishType }) => {
  return (
    <div className={landingPageVaultPickerStyles.landingPageVaultPickerWrapper}>
      <VaultCard {...vault} />
      <VaultSimulationForm vaultData={vault} />
    </div>
  )
}
