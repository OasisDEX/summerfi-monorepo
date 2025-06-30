import {
  type EarnAppConfigType,
  type EarnAppFleetCustomConfigType,
  type IArmadaPosition,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { decorateWithFleetConfig } from '@summerfi/app-utils'

type VaultConfigDecorator = {
  vaults: SDKVaultishType[]
  systemConfig: Partial<EarnAppConfigType>
  userPositions?: IArmadaPosition[]
}

export const decorateVaultsWithConfig = ({
  vaults,
  systemConfig,
  userPositions,
}: VaultConfigDecorator) => {
  const vaultsWithConfig = decorateWithFleetConfig(vaults, systemConfig, userPositions)

  return vaultsWithConfig as SDKVaultishType[]
}

export const getVaultIdByVaultCustomName = (
  vaultCustomName: string,
  networkId: string,
  systemConfig: Partial<EarnAppConfigType>,
  debug = false,
) => {
  const { fleetMap } = systemConfig

  if (!fleetMap) {
    return undefined
  }

  // temporary fix for appended .txt like the one below
  // No vault found with the name 0x98c49e13bf99d7cad8069faa2a370933ec9ecf17.txt on the network 42161
  const resolvedVaultCustomName = vaultCustomName.split('.')['0']

  const vaultNetworkConfig = fleetMap[String(networkId) as keyof typeof fleetMap]
  const customFields = Object.values(vaultNetworkConfig).find(
    (fleet) => fleet.slug === resolvedVaultCustomName,
  ) as EarnAppFleetCustomConfigType | undefined

  if (!customFields?.address) {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log(
        `No vault found with the name ${resolvedVaultCustomName} on the network ${networkId}`,
      )
    }

    return undefined
  }

  return customFields.address
}
