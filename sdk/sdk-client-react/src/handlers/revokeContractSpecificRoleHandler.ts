import type { ContractSpecificRoleName, ISDKAdminManager } from '@summerfi/sdk-client'
import { IUser, Address, IChainInfo } from '@summerfi/sdk-common'

export const revokeContractSpecificRoleHandler =
  (sdk: ISDKAdminManager) =>
  async ({
    contractAddress,
    chainInfo,
    role,
    targetAddress,
  }: {
    user: IUser
    targetAddress: string
    contractAddress: string
    chainInfo: IChainInfo
    role: ContractSpecificRoleName
  }) => {
    return sdk.armada.accessControl.revokeContractSpecificRole({
      chainId: chainInfo.chainId,
      contractAddress: Address.createFromEthereum({ value: contractAddress }),
      role,
      targetAddress: Address.createFromEthereum({ value: targetAddress }),
    })
  }
