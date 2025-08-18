import type { ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, type IChainInfo, type IUser } from '@summerfi/sdk-common'

/**
 * @name getReferralFeesMerklClaimTxHandler
 * @description Generates a transaction to claim Merkl rewards for a referral on a specific chain
 * @param params.user The user's address
 * @param params.chainInfo The chain information
 * @param params.rewardsTokensAddresses Optional array of token addresses to claim (default: all tokens)
 */
export const getReferralFeesMerklClaimTxHandler =
  (sdk: ISDKManager) =>
  async ({
    user,
    chainInfo,
    rewardsTokensAddresses,
  }: {
    user: IUser
    chainInfo: IChainInfo
    rewardsTokensAddresses: AddressValue[]
  }) => {
    const position = await sdk.armada.users.getReferralFeesMerklClaimTx({
      address: user.wallet.address.value,
      chainId: chainInfo.chainId,
      rewardsTokensAddresses: rewardsTokensAddresses,
    })
    return position
  }
