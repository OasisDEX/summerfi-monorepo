import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, type ChainId } from '@summerfi/sdk-common'

/**
 * Generates a transaction to claim Merkl rewards for a vault on a specific chain
 *
 * @param params.address The vault's address
 * @param params.chainId The chain ID to claim rewards on
 * @param params.rewardsTokensAddresses Optional array of token addresses to claim (default: all tokens)
 */
export const getVaultRewardsMerklClaimTxHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({
    address,
    chainId,
    rewardsTokensAddresses,
  }: {
    address: AddressValue
    chainId: ChainId
    rewardsTokensAddresses?: AddressValue[]
  }) => {
    return sdk.armada.users.getVaultRewardsMerklClaimTx({
      address,
      chainId,
      rewardsTokensAddresses,
    })
  }
