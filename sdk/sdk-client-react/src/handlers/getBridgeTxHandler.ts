import type { ISDKManager } from '@summerfi/sdk-client'
import { IAddress, IChainInfo, ITokenAmount, type IUser } from '@summerfi/sdk-common'

export const getBridgeTxHandler =
  (sdk: ISDKManager) =>
  async ({
    user,
    recipient,
    sourceChain,
    targetChain,
    amount,
  }: {
    user: IUser
    recipient: IAddress
    sourceChain: IChainInfo
    targetChain: IChainInfo
    amount: ITokenAmount
  }) => {
    return sdk.armada.users.getBridgeTx({
      user,
      recipient,
      sourceChain,
      targetChain,
      amount,
    })
  }
