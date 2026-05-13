import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import {
  Address,
  type AddressValue,
  getChainInfoByChainId,
  type ChainId,
  User,
} from '@summerfi/sdk-common'

export const createAndSaveBuyOrderHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    userAddress,
    chainId,
    fromVaultAddress,
    toVaultAddress,
    amount,
    slippage,
    intervalSeconds,
    ensoRouterAddress,
    nextExecutionAt,
    deadline,
  }: {
    userAddress: AddressValue
    chainId: ChainId
    fromVaultAddress: AddressValue
    toVaultAddress: AddressValue
    amount: string
    slippage: string
    intervalSeconds: number
    ensoRouterAddress: AddressValue
    nextExecutionAt?: number
    deadline?: string
  }) => {
    const user = User.createFromEthereum(chainId, userAddress)
    const chainInfo = getChainInfoByChainId(chainId)

    return sdk.armada.dca.createAndSaveBuyOrder({
      user,
      chainInfo,
      fromVault: Address.createFromEthereum({ value: fromVaultAddress }),
      toVault: Address.createFromEthereum({ value: toVaultAddress }),
      amount,
      slippage,
      intervalSeconds,
      ensoRouterAddress: Address.createFromEthereum({ value: ensoRouterAddress }),
      nextExecutionAt,
      deadline,
    })
  }
