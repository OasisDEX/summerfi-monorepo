import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { SupportedNetworkIds, type SupportedSDKNetworks } from '@summerfi/app-types'
import { decorateWithFleetConfig, subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { getInstitutionsSDK } from '@/app/server-handlers/sdk'

export const getInstitutionVaults = async ({ institutionId }: { institutionId: string }) => {
  if (!institutionId) return null
  if (typeof institutionId !== 'string') return null

  const testInstitutionVaults = ['0x29f13a877f3d1a14ac0b15b07536d4423b35e198'].map((vault) =>
    vault.toLowerCase(),
  )
  const testInstitutionNetworks = [SupportedNetworkIds.Base]

  try {
    const systemConfig = await configEarnAppFetcher()

    const institutionSdk = getInstitutionsSDK(institutionId)
    const vaultsListByNetwork = await Promise.all(
      testInstitutionNetworks.map((networkId) =>
        institutionSdk.armada.users.getVaultsRaw({
          chainInfo: getChainInfoByChainId(Number(networkId)),
        }),
      ),
    )

    const filteredVaults = vaultsListByNetwork
      .flatMap(({ vaults }) => vaults)
      .filter((vault) => testInstitutionVaults.includes(vault.id.toLowerCase()))

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
  institutionId,
  vaultAddress,
}: {
  institutionId: string
  network: SupportedSDKNetworks
  vaultAddress: string
}) => {
  if (!institutionId) return null
  if (typeof institutionId !== 'string') return null

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
    const institutionSdk = getInstitutionsSDK(institutionId)
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
