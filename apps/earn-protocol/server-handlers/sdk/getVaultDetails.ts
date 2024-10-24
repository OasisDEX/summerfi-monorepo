import { type SDKVaultsListType } from '@summerfi/app-types'
import { ArmadaVaultId } from '@summerfi/armada-protocol-service'
import { Address, type ChainId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/helpers/sdk/sdk-backend-client'

export const getVaultDetails = async ({
  chainId,
  vaultAddress,
}: {
  chainId: ChainId
  vaultAddress: string
}) => {
  const chainInfo = getChainInfoByChainId(chainId)

  const fleetAddress = Address.createFromEthereum({
    value: vaultAddress,
  })
  const poolId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  return (await backendSDK.armada.users.getVaultRaw({
    poolId,
  })) as SDKVaultsListType[number]
}
