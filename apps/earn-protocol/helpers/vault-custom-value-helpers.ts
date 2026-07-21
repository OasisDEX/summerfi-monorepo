import {
  type EarnAppConfigType,
  type EarnAppFleetCustomConfigType,
  type IArmadaPosition,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { decorateWithFleetConfig } from '@summerfi/app-utils'

import { alwaysVisibleVaults, isAlwaysVisibleVault } from '@/constants/always-visible-vaults'

type VaultConfigDecorator = {
  vaults: SDKVaultishType[]
  systemConfig: Partial<EarnAppConfigType>
  userPositions?: IArmadaPosition[]
  daoManagedVaultsList: `0x${string}`[]
}

export const decorateVaultsWithConfig = ({
  vaults,
  systemConfig,
  userPositions,
  daoManagedVaultsList,
}: VaultConfigDecorator) => {
  const vaultsWithConfig = decorateWithFleetConfig(
    vaults,
    systemConfig,
    userPositions,
    daoManagedVaultsList,
    alwaysVisibleVaults,
  )
  const daoManagedVaultsEnabled = systemConfig.features?.DaoManagedVaults

  if (!daoManagedVaultsEnabled) {
    return vaultsWithConfig.filter((vault) => {
      return !vault.isDaoManaged || isAlwaysVisibleVault(vault)
    })
  }

  return vaultsWithConfig
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

export const getVaultCuratedBy = (
  vaultAddress: string,
  chainId: number | string,
  systemConfig: Partial<EarnAppConfigType>,
) => {
  const { fleetMap } = systemConfig

  if (!fleetMap) {
    return false
  }

  const vaultNetworkConfig = fleetMap[String(chainId) as keyof typeof fleetMap]

  const vaultConfig = (Object.values(vaultNetworkConfig) as EarnAppFleetCustomConfigType[]).find(
    (fleet) => fleet.address.toLowerCase() === vaultAddress.toLowerCase(),
  )

  return typeof vaultConfig?.vaultCurator !== 'undefined' ? vaultConfig.vaultCurator : false
}

/**
 * Whether a vault is flagged `disabled: true` in the fleet config — i.e. hidden/unused and must not be
 * displayed or fetched. Mirrors the `customFields?.disabled` filter `decorateWithFleetConfig` applies to
 * rendered lists, but usable before the data fetch (e.g. to short-circuit a disabled vault's page).
 */
export const isVaultDisabled = (
  vaultAddress: string,
  chainId: number | string,
  systemConfig: Partial<EarnAppConfigType>,
): boolean => {
  const { fleetMap } = systemConfig

  if (!fleetMap) {
    return false
  }

  const vaultNetworkConfig = fleetMap[String(chainId) as keyof typeof fleetMap]

  // fleetMap is not guaranteed to carry a section for every chain (the generated type assumes it
  // does); guard so Object.values doesn't throw on undefined.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!vaultNetworkConfig) {
    return false
  }

  const vaultConfig = (Object.values(vaultNetworkConfig) as EarnAppFleetCustomConfigType[]).find(
    (fleet) => fleet.address.toLowerCase() === vaultAddress.toLowerCase(),
  )

  return vaultConfig?.disabled === true
}
