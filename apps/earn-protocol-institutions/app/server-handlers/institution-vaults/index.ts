import { SupportedNetworkIds, type SupportedSDKNetworks } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { getInstitutionsSDK } from '@/app/server-handlers/sdk'

export const getInstitutionVaults = async ({ institutionId }: { institutionId: string }) => {
  if (!institutionId) return null
  if (typeof institutionId !== 'string') return null

  try {
    const institutionSdk = getInstitutionsSDK(institutionId)
    const vaultsListByNetwork = await Promise.all(
      Object.values(SupportedNetworkIds)
        .filter((networkId): networkId is number => typeof networkId === 'number')
        .map((networkId) =>
          institutionSdk.armada.users.getVaultsRaw({
            chainInfo: getChainInfoByChainId(Number(networkId)),
          }),
        ),
    )

    return {
      vaults: vaultsListByNetwork.flatMap(({ vaults }) => vaults),
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
    const vault = await institutionSdk.armada.users.getVaultRaw({
      vaultId: poolId,
    })

    return {
      vault: vault.vault,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution vault:', error)

    return null
  }
}
