import type { ISDKManager } from '@summerfi/sdk-client'
import { type IChainInfo, type IUser } from '@summerfi/sdk-common'

export const getAggregatedClaimsForChainTXHandler =
  (sdk: ISDKManager) =>
  async ({
    user,
    chainInfo,
    includeMerkl,
  }: {
    user: IUser
    chainInfo: IChainInfo
    includeMerkl?: boolean
  }) => {
    const position = await sdk.armada.users.getAggregatedClaimsForChainTx({
      chainInfo,
      user,
      includeMerkl,
    })
    return position
  }
