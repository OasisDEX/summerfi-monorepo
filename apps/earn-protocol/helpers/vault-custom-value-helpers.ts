import {
  type EarnAppConfigType,
  type EarnAppFleetCustomConfigType,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { decorateWithFleetConfig } from '@summerfi/app-utils'

type VaultConfigDecorator = {
  vaults: SDKVaultishType[]
  systemConfig: Partial<EarnAppConfigType>
}

export const decorateVaultsWithConfig = ({ vaults, systemConfig }: VaultConfigDecorator) => {
  const { fleetMap } = systemConfig

  const vaultsWithConfig = fleetMap ? decorateWithFleetConfig(vaults, fleetMap) : vaults

  return vaultsWithConfig as SDKVaultishType[]
}

export const getCustomVaultConfigById = (
  vaultId: string,
  networkId: string,
  systemConfig: Partial<EarnAppConfigType>,
) => {
  const { fleetMap } = systemConfig

  if (!fleetMap) {
    return ''
  }
  const vaultNetworkConfig = fleetMap[String(networkId) as keyof typeof fleetMap]
  const customFields = Object.values(vaultNetworkConfig).find(
    (fleet) => fleet.address === vaultId,
  ) as EarnAppFleetCustomConfigType | undefined

  if (!customFields?.name) {
    // eslint-disable-next-line no-console
    console.log(`No vault found with the ud ${vaultId} on the network ${networkId}`)

    return ''
  }

  return customFields
}

export const getVaultIdByVaultCustomName = (
  vaultCustomName: string,
  networkId: string,
  systemConfig: Partial<EarnAppConfigType>,
) => {
  const { fleetMap } = systemConfig

  if (!fleetMap) {
    return ''
  }
  const vaultNetworkConfig = fleetMap[String(networkId) as keyof typeof fleetMap]
  const customFields = Object.values(vaultNetworkConfig).find(
    (fleet) => fleet.slug === vaultCustomName,
  ) as EarnAppFleetCustomConfigType | undefined

  if (!customFields?.address) {
    // eslint-disable-next-line no-console
    console.log(`No vault found with the name ${vaultCustomName} on the network ${networkId}`)

    return ''
  }

  return customFields.address
}
