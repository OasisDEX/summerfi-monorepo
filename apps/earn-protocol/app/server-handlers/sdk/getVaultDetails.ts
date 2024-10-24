import { type SDKVaultType } from '@summerfi/app-types'
import { ArmadaVaultId } from '@summerfi/armada-protocol-service'
import { Address, type ChainId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getVaultDetails({
  chainId,
  vaultAddress,
}: {
  chainId: ChainId
  vaultAddress: string
}) {
  try {
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

    return vault as SDKVaultType
  } catch (error) {
    throw new Error(`Failed to get vault details: ${error}`)
  }
}
