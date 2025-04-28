import { type EarnAppConfigType, type SDKVaultishType } from '@summerfi/app-types'
import { decorateWithFleetConfig } from '@summerfi/app-utils'

export const decorateVaultsWithConfig = ({
  vaults,
  systemConfig,
}: {
  vaults: SDKVaultishType[]
  systemConfig: Partial<EarnAppConfigType>
}) => {
  const vaultsWithConfig = decorateWithFleetConfig(vaults, systemConfig)

  return vaultsWithConfig as SDKVaultishType[]
}
