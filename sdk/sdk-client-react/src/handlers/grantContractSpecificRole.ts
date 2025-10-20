import type { ContractSpecificRoleName, ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { IUser, Address, IChainInfo } from '@summerfi/sdk-common'

export const grantContractSpecificRoleHandler =
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
    return sdk.armada.accessControl.grantContractSpecificRole({
      chainId: chainInfo.chainId,
      contractAddress: Address.createFromEthereum({ value: contractAddress }),
      role,
      targetAddress: Address.createFromEthereum({ value: targetAddress }),
    })
  }
