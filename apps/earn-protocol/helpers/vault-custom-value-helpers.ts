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

/**
 * Resolves the RWA institution client id a vault belongs to, read from the fleet config's
 * `vaultInstitutionId`. This is the single per-vault routing point: RWA SDK calls for this vault must
 * be served by the institutional SDK instance built with this client id (its `Client-Id` header selects
 * the right deployment contracts + institutions-v2 subgraph). Returns `undefined` for non-RWA / disabled
 * / unconfigured vaults (which carry no `vaultInstitutionId`).
 */
export const getVaultRwaClientId = (
  vaultAddress: string,
  chainId: number | string,
  systemConfig: Partial<EarnAppConfigType>,
): string | undefined => {
  const { fleetMap } = systemConfig

  if (!fleetMap) {
    return undefined
  }

  const vaultNetworkConfig = fleetMap[String(chainId) as keyof typeof fleetMap]

  // fleetMap is not guaranteed to carry a section for every chain (the generated type assumes it
  // does); guard so Object.values doesn't throw on undefined.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!vaultNetworkConfig) {
    return undefined
  }

  const vaultConfig = (Object.values(vaultNetworkConfig) as EarnAppFleetCustomConfigType[]).find(
    (fleet) => fleet.address.toLowerCase() === vaultAddress.toLowerCase(),
  )

  // A disabled vault must never resolve to a client id, so downstream reads (e.g. getUserPosition,
  // getRwaVaultDetails) treat it as unconfigured rather than routing to an institution.
  if (vaultConfig?.disabled) {
    return undefined
  }

  return vaultConfig?.vaultInstitutionId
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

/**
 * The distinct RWA institution client ids configured on a chain — the fan-out source for the per-chain
 * RWA list/positions reads. Derived from the fleet config's `vaultInstitutionId` across **non-disabled**
 * vaults, so it is the single source of truth for "which institutions do we query" (no hardcoded list to
 * keep in sync). The truthiness filter also excludes the `'0x'`/emptyConfig template entry each chain map
 * carries and any disabled entry (which has no `vaultInstitutionId`).
 */
export const getRwaClientIdsForChain = (
  chainId: number | string,
  systemConfig: Partial<EarnAppConfigType>,
): string[] => {
  const { fleetMap } = systemConfig

  if (!fleetMap) {
    return []
  }

  const vaultNetworkConfig = fleetMap[String(chainId) as keyof typeof fleetMap]

  // This helper is called for every supported RWA chain, not just chains we know carry vaults — and
  // fleetMap is not guaranteed to have a section for each (the generated type assumes it does). Guard
  // against a missing chain so Object.values doesn't throw on undefined and take down the whole list.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!vaultNetworkConfig) {
    return []
  }

  const clientIds = (Object.values(vaultNetworkConfig) as EarnAppFleetCustomConfigType[])
    .filter((fleet) => !fleet.disabled && !!fleet.vaultInstitutionId)
    .map((fleet) => fleet.vaultInstitutionId)

  return [...new Set(clientIds)]
}
