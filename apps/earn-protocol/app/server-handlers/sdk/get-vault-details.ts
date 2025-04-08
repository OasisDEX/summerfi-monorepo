import { type IArmadaPosition, type SDKNetwork, type SDKVaultType } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, getChainInfoByChainId } from '@summerfi/sdk-common'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getVaultDetails({
  network,
  vaultAddress,
}: {
  network: SDKNetwork
  vaultAddress: string
}) {
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
    const { vault } = await backendSDK.armada.users.getVaultRaw({
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
