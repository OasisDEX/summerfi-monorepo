import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { IChainInfo } from '@summerfi/sdk-common'

export const getSummerTokenHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  ({ chainInfo }: { chainInfo: IChainInfo }) =>
    sdk.armada.users.getSummerToken({
      chainInfo: chainInfo,
    })
