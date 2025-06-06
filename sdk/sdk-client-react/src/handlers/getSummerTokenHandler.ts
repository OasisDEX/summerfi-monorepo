import type { ISDKManager } from '@summer_fi/sdk-client'
import type { IChainInfo } from '@summer_fi/sdk-client'

export const getSummerTokenHandler =
  (sdk: ISDKManager) =>
  ({ chainInfo }: { chainInfo: IChainInfo }) =>
    sdk.armada.users.getSummerToken({
      chainInfo: chainInfo,
    })
