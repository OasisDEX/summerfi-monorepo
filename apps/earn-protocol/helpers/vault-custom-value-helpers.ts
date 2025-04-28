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
