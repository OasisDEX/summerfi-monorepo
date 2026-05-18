import {
  type EarnAppConfigType,
  type EarnAppFleetCustomConfigType,
  type GetVaultsApyResponse,
  type IArmadaPosition,
  type SDKVaultishType,
} from '@summerfi/app-types'
import {
  decorateWithFleetConfig,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'

type VaultConfigDecorator = {
  vaults: SDKVaultishType[]
  systemConfig: Partial<EarnAppConfigType>
  userPositions?: IArmadaPosition[]
  daoManagedVaultsList: `0x${string}`[]
  vaultsApyByNetworkMap?: GetVaultsApyResponse
}

export const decorateVaultsWithConfig = ({
  vaults,
  systemConfig,
  userPositions,
  daoManagedVaultsList,
  vaultsApyByNetworkMap,
}: VaultConfigDecorator) => {
  const vaultsWithConfig = decorateWithFleetConfig(
    vaults,
    systemConfig,
    userPositions,
    daoManagedVaultsList,
  )

  const filteredVaultsWithConfig = vaultsWithConfig.filter((vault) => {
    if (vaultsApyByNetworkMap) {
      const vaultApyData =
        vaultsApyByNetworkMap[
          `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
        ]

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!vaultApyData) {
        return true
      }
      // filter out vaults with APY close to 0, as they are likely to be inactive or have incorrect data
      if (vaultApyData.apy > 0.0000001) {
        return true
      }

      return false
    }

    return true
  })

  const daoManagedVaultsEnabled = systemConfig.features?.DaoManagedVaults

  if (!daoManagedVaultsEnabled) {
    return filteredVaultsWithConfig.filter((vault) => {
      return !vault.isDaoManaged
    })
  }

  return filteredVaultsWithConfig
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
