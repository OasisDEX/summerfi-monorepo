import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, type ChainId } from '@summerfi/sdk-common'

/**
 * @name getUserMerklClaimTxHandler
 * @description Generates a transaction to claim Merkl rewards for a user on a specific chain
 * @param params.address The user's address
 * @param params.chainId The chain ID to claim rewards on
 */
export const getUserMerklClaimTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ address, chainId }: { address: AddressValue; chainId: ChainId }) => {
    return sdk.armada.users.getUserMerklClaimTx({
      address,
      chainId,
    })
  }
