import { type SDKNetwork, type SDKVaultType } from '@summerfi/app-types'
import { ArmadaVaultId } from '@summerfi/armada-protocol-service'
import { Address, getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { subgraphNetworkToId } from '@/helpers/network-helpers'

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
      poolId,
    })

    return vault as SDKVaultType | undefined
  } catch (error) {
    throw new Error(`Failed to get vault details: ${error}`)
  }
}
