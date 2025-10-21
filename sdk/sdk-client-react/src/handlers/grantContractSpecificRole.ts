import type { ChainId, ContractSpecificRoleName, ISDKAdminManager } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'

export const grantContractSpecificRoleHandler =
  (sdk: ISDKAdminManager) =>
  async ({
    contractAddress,
    chainId,
    role,
    targetAddress,
  }: {
    targetAddress: string
    contractAddress: string
    chainId: ChainId
    role: ContractSpecificRoleName
  }) => {
    return sdk.armada.accessControl.grantContractSpecificRole({
      chainId,
      contractAddress: Address.createFromEthereum({ value: contractAddress }),
      role,
      targetAddress: Address.createFromEthereum({ value: targetAddress }),
    })
  }
