import type { ISDKManager } from '@summer_fi/sdk-client'
import { type IChainInfo, type IUser } from '@summer_fi/sdk-client'

export const getAggregatedClaimsForChainTXHandler =
  (sdk: ISDKManager) =>
  async ({ user, chainInfo }: { user: IUser; chainInfo: IChainInfo }) => {
    const position = await sdk.armada.users.getAggregatedClaimsForChainTx({
      chainInfo,
      user,
    })
    return position
  }
