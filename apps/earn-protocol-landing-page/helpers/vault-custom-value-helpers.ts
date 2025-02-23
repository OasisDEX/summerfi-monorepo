import { type EarnAppConfigType, type SDKVaultishType } from '@summerfi/app-types'
import { decorateWithFleetConfig } from '@summerfi/app-utils'

export const decorateVaultsWithConfig = ({
  vaults,
  systemConfig,
}: {
  vaults: SDKVaultishType[]
  systemConfig: Partial<EarnAppConfigType>
}) => {
  const { fleetMap } = systemConfig

  const vaultsWithConfig = fleetMap ? decorateWithFleetConfig(vaults, fleetMap) : vaults

  return vaultsWithConfig as SDKVaultishType[]
}
