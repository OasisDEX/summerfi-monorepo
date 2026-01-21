import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, type ChainId, User } from '@summerfi/sdk-common'

/**
 * @name getClaimStakingV2UserRewardsTxHandler
 * @description Generates a transaction to claim staking v2 rewards for a user
 * @param params.address The user's address
 * @param params.chainId The chain ID
 */
export const getClaimStakingV2UserRewardsTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ address, chainId }: { address: AddressValue; chainId: ChainId }) => {
    const user = User.createFromEthereum(chainId, address)
    const transaction = await sdk.armada.users.getClaimStakingV2UserRewardsTx({
      user,
    })
    return transaction
  }
