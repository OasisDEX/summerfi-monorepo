'use client'
import { useTokenSelector, VaultCard, VaultSimulationForm } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import landingPageVaultPickerStyles from '@/components/organisms/LandingPageVaultPicker/LandingPageVaultPicker.module.scss'

export const LandingPageVaultPicker = ({ vault }: { vault: SDKVaultishType }) => {
  const { handleTokenSelectionChange, selectedTokenOption, tokenOptions } = useTokenSelector({
    vault,
  })

  return (
    <div className={landingPageVaultPickerStyles.landingPageVaultPickerWrapper}>
      <VaultCard {...vault} secondary withTokenBonus={false} />
      <VaultSimulationForm
        vaultData={vault}
        selectedTokenOption={selectedTokenOption}
        handleTokenSelectionChange={handleTokenSelectionChange}
        tokenOptions={tokenOptions}
      />
    </div>
  )
}
