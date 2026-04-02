import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId } from '@summerfi/sdk-common'
import type { PublicClient, WalletClient } from 'viem'

/**
 * @name getIntentSwapsCancelOrderHandler
 * @description Cancels an existing CoW swap order by its ID
 * @param params.chainId The chain ID where the order exists
 * @param params.orderId The ID of the order to cancel
 * @param params.walletClient The viem wallet client used to sign the cancellation
 * @param params.publicClient The viem public client
 * @returns The result of the cancellation request
 */
export const getIntentSwapsCancelOrderHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    orderId,
    walletClient,
    publicClient,
  }: {
    chainId: ChainId
    orderId: string
    walletClient: WalletClient
    publicClient: PublicClient
  }) => {
    return sdk.intentSwaps.cancelOrder({
      chainId,
      orderId,
      walletClient,
      publicClient,
    })
  }
