import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type IChainInfo, type IUser } from '@summerfi/sdk-common'

export const getAggregatedClaimsForChainTXHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    user,
    chainInfo,
    includeMerkl,
    includeStakingV2 = true,
  }: {
    user: IUser
    chainInfo: IChainInfo
    includeMerkl?: boolean
    includeStakingV2?: boolean
  }) => {
    const position = await sdk.armada.users.getAggregatedClaimsForChainTx({
      chainInfo,
      user,
      includeMerkl,
      includeStakingV2,
    })
    return position
  }
