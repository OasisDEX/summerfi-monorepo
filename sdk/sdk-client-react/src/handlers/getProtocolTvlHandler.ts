import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getProtocolTvlHandler = (sdk: ISDKManager | ISDKAdminManager) => async () => {
  return sdk.armada.users.getProtocolTvl()
}
