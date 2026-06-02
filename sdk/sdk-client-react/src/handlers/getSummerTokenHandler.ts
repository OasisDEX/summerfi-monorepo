import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { IChainInfo } from '@summerfi/sdk-common'

export const getSummerTokenHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  ({ chainInfo }: { chainInfo: IChainInfo }) =>
    sdk.armada.users.getSummerToken({
      chainInfo: chainInfo,
    })
