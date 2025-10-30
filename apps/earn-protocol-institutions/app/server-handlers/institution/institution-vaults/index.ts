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
    const vaultsListByNetwork = await Promise.all(
      supportedInstitutionNetworks.map((networkId) =>
        institutionSdk.armada.users.getVaultsRaw({
          chainInfo: getChainInfoByChainId(Number(networkId)),
        }),
      ),
    )

    const filteredVaults = vaultsListByNetwork.flatMap(({ vaults }) => vaults)

    const vaultsWithConfig = decorateWithFleetConfig(filteredVaults, systemConfig)

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
    const chainInfo = getChainInfoByChainId(chainId)

    const fleetAddress = Address.createFromEthereum({
      value: vaultAddress,
    })
    const poolId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })
    const institutionSdk = getInstitutionsSDK(institutionName)
    const [vault, systemConfig] = await Promise.all([
      institutionSdk.armada.users.getVaultRaw({
        vaultId: poolId,
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
