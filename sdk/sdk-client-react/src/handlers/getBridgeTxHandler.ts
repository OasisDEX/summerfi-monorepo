import type { ISDKManager } from '@summer_fi/sdk-client'
import { IAddress, IChainInfo, ITokenAmount, type IUser } from '@summer_fi/sdk-client'

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
