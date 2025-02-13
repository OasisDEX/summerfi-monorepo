import type { ISDKManager } from '@summerfi/sdk-client'
import type { IChainInfo } from '@summerfi/sdk-common'

export const getSummerTokenHandler =
  (sdk: ISDKManager) =>
  ({ chainInfo }: { chainInfo: IChainInfo }) =>
    sdk.armada.users.getSummerToken({
      chainInfo: chainInfo,
    })
