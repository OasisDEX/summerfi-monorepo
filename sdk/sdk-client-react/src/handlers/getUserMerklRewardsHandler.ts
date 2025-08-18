import type { ISDKManager } from '@summerfi/sdk-client'
import { ChainId, type AddressValue, type IUser } from '@summerfi/sdk-common'

/**
 * @name getUserMerklRewardsHandler
 * @description Gets Merkl rewards for a user across specified chains
 * @param params.user The user's address
 * @param params.chainIds Optional chain IDs to filter by (default: supported chains)
 * @param params.rewardsTokensAddresses Optional array of token addresses to filter rewards (default: all tokens)
 */
export const getUserMerklRewardsHandler =
  (sdk: ISDKManager) =>
  async ({
    user,
    chainIds,
    rewardsTokensAddresses,
  }: {
    user: IUser
    chainIds: ChainId[]
    rewardsTokensAddresses: AddressValue[]
  }) => {
    const position = await sdk.armada.users.getUserMerklRewards({
      address: user.wallet.address.value,
      chainIds,
      rewardsTokensAddresses,
    })
    return position
  }
