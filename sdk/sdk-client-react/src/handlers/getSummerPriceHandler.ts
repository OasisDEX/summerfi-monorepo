import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

/**
 * @name getSummerPriceHandler
 * @description Retrieves the current price of the Summer token
 * @param params - Optional parameters
 * @param params.override - Optional price override value
 */
export const getSummerPriceHandler =
  (sdk: ISDKManager | ISDKAdminManager) => async (params?: { override?: number }) => {
    return sdk.armada.users.getSummerPrice(params)
  }
