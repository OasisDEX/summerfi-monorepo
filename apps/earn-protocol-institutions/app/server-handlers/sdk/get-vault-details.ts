import { type SDKVaultType, type SupportedSDKNetworks } from '@summerfi/app-types'
import { serverOnlyErrorHandler, subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { getInstitutionsSDK } from '.'

export async function getVaultDetails({
  institutionName,
  vaultAddress,
  network,
}: {
  institutionName: string
  vaultAddress?: string
  network: SupportedSDKNetworks
}) {
  const institutionSDK = getInstitutionsSDK(institutionName)

  try {
    if (!vaultAddress) {
      return undefined
    }

    const chainId = subgraphNetworkToId(network)
    const chainInfo = getChainInfoByChainId(chainId)

    const fleetAddress = Address.createFromEthereum({
      value: vaultAddress,
    })
    const poolId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })
    const { vault } = await institutionSDK.armada.users.getVaultRaw({
      vaultId: poolId,
    })

    return vault as SDKVaultType | undefined
  } catch (error) {
    return serverOnlyErrorHandler(
      'getVaultDetails',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}
