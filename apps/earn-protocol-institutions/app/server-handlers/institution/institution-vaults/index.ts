import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { SupportedNetworkIds, type SupportedSDKNetworks } from '@summerfi/app-types'
import { decorateWithFleetConfig, subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { getInstitutionsSDK } from '@/app/server-handlers/sdk'

const supportedInstitutionNetworks = [SupportedNetworkIds.Base, SupportedNetworkIds.ArbitrumOne]

export const getInstitutionVaults = async ({ institutionName }: { institutionName: string }) => {
  if (!institutionName) return null
  if (typeof institutionName !== 'string') return null

  try {
    const systemConfig = await configEarnAppFetcher()
    const institutionSdk = getInstitutionsSDK(institutionName)

    // this is a temporary method
    // until either `getVaultsRaw` returns only the particular insti vaults
    // or `getVaultInfoList` is mapped in the frontend components
    const vaultsInfoArray = await Promise.all(
      supportedInstitutionNetworks.map((networkId) =>
        institutionSdk.armada.users.getVaultInfoList({
          chainId: networkId,
        }),
      ),
    )

    const vaultsInfoByNetwork = supportedInstitutionNetworks.map((networkId, i) => ({
      list: vaultsInfoArray[i].list,
      networkId,
    }))

    const vaultsListByNetwork = (
      await Promise.all(
        vaultsInfoByNetwork.map(async ({ list, networkId }) => {
          const vaults = await Promise.all(
            list.map(async (vaultInfo) => {
              const vaultId = ArmadaVaultId.createFrom({
                chainInfo: getChainInfoByChainId(networkId),
                fleetAddress: vaultInfo.id.fleetAddress,
              })

              const vaultDetails = await institutionSdk.armada.users.getVaultRaw({
                vaultId,
              })

              return vaultDetails.vault ? vaultDetails.vault : null
            }),
          )

          return vaults.filter((vault): vault is NonNullable<typeof vault> => vault !== null).flat()
        }),
      )
    ).flat()
    // above is a temporary method

    const vaultsWithConfig = decorateWithFleetConfig(vaultsListByNetwork, systemConfig)

    return {
      vaults: vaultsWithConfig,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution vaults:', error)

    return null
  }
}

export const getInstitutionVault = async ({
  network,
  institutionName,
  vaultAddress,
}: {
  institutionName: string
  network: SupportedSDKNetworks
  vaultAddress: string
}) => {
  if (!institutionName) return null
  if (typeof institutionName !== 'string') return null

  try {
    const chainId = subgraphNetworkToId(network)

    const institutionSdk = getInstitutionsSDK(institutionName)
    const [vault, systemConfig] = await Promise.all([
      institutionSdk.armada.users.getVaultRaw({
        vaultId: ArmadaVaultId.createFrom({
          chainInfo: getChainInfoByChainId(chainId),
          fleetAddress: Address.createFromEthereum({
            value: vaultAddress,
          }),
        }),
      }),
      configEarnAppFetcher(),
    ])

    if (!vault.vault) {
      return null
    }

    const vaultWithConfig = decorateWithFleetConfig([vault.vault], systemConfig)

    return {
      vault: vaultWithConfig[0],
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution vault:', error)

    return null
  }
}
