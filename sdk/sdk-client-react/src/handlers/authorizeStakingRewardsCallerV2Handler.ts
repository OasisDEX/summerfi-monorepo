import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, type ChainId, User, Address } from '@summerfi/sdk-common'

/**
 * @name authorizeStakingRewardsCallerV2Handler
 * @description Generates a transaction to authorize a caller for staking rewards
 * @param params.address The user's address who is authorizing
 * @param params.chainId The chain ID
 * @param params.authorizedCallerAddress The address to authorize
 * @param params.isAuthorized Whether to authorize or revoke authorization
 */
export const authorizeStakingRewardsCallerV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    userAddress: address,
    chainId,
    authorizedCallerAddress,
    isAuthorized,
  }: {
    userAddress: AddressValue
    chainId: ChainId
    authorizedCallerAddress: AddressValue
    isAuthorized: boolean
  }) => {
    const user = User.createFromEthereum(chainId, address)
    const authorizedCaller = Address.createFromEthereum({ value: authorizedCallerAddress })
    const transaction = await sdk.armada.users.authorizeStakingRewardsCallerV2({
      user,
      authorizedCaller,
      isAuthorized,
    })
    return transaction
  }
