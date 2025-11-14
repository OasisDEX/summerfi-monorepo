import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getProtocolRevenueHandler = (sdk: ISDKManager | ISDKAdminManager) => async () => {
  return sdk.armada.users.getProtocolRevenue()
}
