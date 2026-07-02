import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

/**
 * Retrieves the current price of the Summer token
 *
 * @param params - Optional parameters
 * @param params.override - Optional price override value
 */
export const getSummerPriceHandler =
  (sdk: ISDKManager | ISDKInstiManager) => async (params?: { override?: number }) => {
    return sdk.armada.users.getSummerPrice(params)
  }
