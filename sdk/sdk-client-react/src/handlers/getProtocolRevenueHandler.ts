import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getProtocolRevenueHandler = (sdk: ISDKManager | ISDKInstiManager) => async () => {
  return sdk.armada.users.getProtocolRevenue()
}
