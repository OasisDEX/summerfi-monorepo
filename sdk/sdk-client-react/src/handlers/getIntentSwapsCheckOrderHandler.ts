import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId } from '@summerfi/sdk-common'

/**
 * @name getIntentSwapsCheckOrderHandler
 * @description Checks the status of a CoW swap order by its ID
 * @param params.chainId The chain ID where the order exists
 * @param params.orderId The ID of the order to check
 * @returns The enriched order info if found, otherwise null
 */
export const getIntentSwapsCheckOrderHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({ chainId, orderId }: { chainId: ChainId; orderId: string }) => {
    return sdk.intentSwaps.checkOrder({
      chainId,
      orderId,
    })
  }
