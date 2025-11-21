import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { SupportedNetworkIds, type SupportedSDKNetworks } from '@summerfi/app-types'
import { decorateWithFleetConfig, subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import {
  VaultApyAverageMap,
  VaultApyMap,
} from '@/app/server-handlers/institution/institution-vaults/types'
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

    // temporary mapping of vaultsInfoArray apys to use on the frontend
    const vaultApys: VaultApyMap = {}

    const apyLiveAverageArray: number[] = []
    const apy24hAverageArray: number[] = []
    const apy7dAverageArray: number[] = []
    const apy30dAverageArray: number[] = []

    vaultsInfoArray.forEach((vault) => {
      vault.list.forEach((vaultInfo) => {
        vaultApys[
          `${vaultInfo.id.fleetAddress.value}-${vaultInfo.id.chainInfo.chainId.toString()}`
        ] = {
          apyLive: vaultInfo.apys.live?.value,
          apy24h: vaultInfo.apys.sma24h?.value,
          apy7d: vaultInfo.apys.sma7day?.value,
          apy30d: vaultInfo.apys.sma30day?.value,
        }
      })
    })

    // Calculate average APYs
    vaultsInfoArray.forEach((vault) => {
      vault.list.forEach((vaultInfo) => {
        if (vaultInfo.apys.live?.value !== undefined) {
          apyLiveAverageArray.push(vaultInfo.apys.live.value)
        }
        if (vaultInfo.apys.sma24h?.value !== undefined) {
          apy24hAverageArray.push(vaultInfo.apys.sma24h.value)
        }
        if (vaultInfo.apys.sma7day?.value !== undefined) {
          apy7dAverageArray.push(vaultInfo.apys.sma7day.value)
        }
        if (vaultInfo.apys.sma30day?.value !== undefined) {
          apy30dAverageArray.push(vaultInfo.apys.sma30day.value)
        }
      })
    })

    const apyLiveAverage =
      apyLiveAverageArray.length > 0
        ? apyLiveAverageArray.reduce((a, b) => a + b, 0) / apyLiveAverageArray.length
        : undefined
    const apy24hAverage =
      apy24hAverageArray.length > 0
        ? apy24hAverageArray.reduce((a, b) => a + b, 0) / apy24hAverageArray.length
        : undefined
    const apy7dAverage =
      apy7dAverageArray.length > 0
        ? apy7dAverageArray.reduce((a, b) => a + b, 0) / apy7dAverageArray.length
        : undefined
    const apy30dAverage =
      apy30dAverageArray.length > 0
        ? apy30dAverageArray.reduce((a, b) => a + b, 0) / apy30dAverageArray.length
        : undefined

    const vaultApysAverage: VaultApyAverageMap = {
      apyLive: apyLiveAverage,
      apy24h: apy24hAverage,
      apy7d: apy7dAverage,
      apy30d: apy30dAverage,
    }

    // above is a temporary method

    const vaultsWithConfig = decorateWithFleetConfig(vaultsListByNetwork, systemConfig)

    return {
      vaults: vaultsWithConfig,
      vaultApys,
      vaultApysAverage,
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
