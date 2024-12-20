'use client'
import { useTokenSelector, VaultCard, VaultSimulationForm } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToSDKId } from '@summerfi/app-utils'

import landingPageVaultPickerStyles from '@/components/organisms/LandingPageVaultPicker/LandingPageVaultPicker.module.scss'

export const LandingPageVaultPicker = ({ vault }: { vault: SDKVaultishType }) => {
  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)

  const { handleTokenSelectionChange, selectedTokenOption, tokenOptions } = useTokenSelector({
    vault,
    chainId: vaultChainId,
  })

  return (
    <div className={landingPageVaultPickerStyles.landingPageVaultPickerWrapper}>
      <VaultCard {...vault} secondary withTokenBonus={false} />
      <VaultSimulationForm
        vaultData={vault}
        selectedTokenOption={selectedTokenOption}
        handleTokenSelectionChange={handleTokenSelectionChange}
        tokenOptions={tokenOptions}
        tokenSymbol={selectedTokenOption.value}
      />
    </div>
  )
}
