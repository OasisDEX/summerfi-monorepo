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
  )
  const daoManagedVaultsEnabled = systemConfig.features?.DaoManagedVaults

  if (!daoManagedVaultsEnabled) {
    return vaultsWithConfig.filter((vault) => {
      return !vault.isDaoManaged
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
 * Number of leading days of NAV (pricePerShare) history to exclude from an RWA vault's 30d Net APY
 * calculation, read from the fleet config's `navPriceSkipFirstNDays`. Returns 0 when unset (no skip)
 * — RWA-exclusive; non-RWA vaults never carry this field.
 */
export const getVaultNavPriceSkipFirstNDays = (
  vaultAddress: string,
  chainId: number | string,
  systemConfig: Partial<EarnAppConfigType>,
): number => {
  const { fleetMap } = systemConfig

  if (!fleetMap) {
    return 0
  }

  const vaultNetworkConfig = fleetMap[String(chainId) as keyof typeof fleetMap]

  const vaultConfig = (Object.values(vaultNetworkConfig) as EarnAppFleetCustomConfigType[]).find(
    (fleet) => fleet.address.toLowerCase() === vaultAddress.toLowerCase(),
  )

  return typeof vaultConfig?.navPriceSkipFirstNDays === 'number'
    ? vaultConfig.navPriceSkipFirstNDays
    : 0
}
