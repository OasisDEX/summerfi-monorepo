import type { ISDKManager } from '@summerfi/sdk-client'
import { type IChainInfo, type IUser } from '@summerfi/sdk-common'

export const getAggregatedClaimsForChainTXHandler =
  (sdk: ISDKManager) =>
  async ({ user, chainInfo }: { user: IUser; chainInfo: IChainInfo }) => {
    const position = await sdk.armada.users.getAggregatedClaimsForChainTX({
      chainInfo,
      user,
    })
    return position
  }
