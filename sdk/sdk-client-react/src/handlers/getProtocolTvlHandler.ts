import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getProtocolTvlHandler = (sdk: ISDKManager | ISDKInstiManager) => async () => {
  return sdk.armada.users.getProtocolTvl()
}
