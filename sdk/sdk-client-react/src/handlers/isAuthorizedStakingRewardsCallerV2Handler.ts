import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, Address } from '@summerfi/sdk-common'

/**
 * @name isAuthorizedStakingRewardsCallerV2Handler
 * @description Checks if a caller is authorized for staking rewards
 * @param params.ownerAddress The owner's address
 * @param params.authorizedCallerAddress The address to check authorization for
 */
export const isAuthorizedStakingRewardsCallerV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    ownerAddress,
    authorizedCallerAddress,
  }: {
    ownerAddress: AddressValue
    authorizedCallerAddress: AddressValue
  }) => {
    const owner = Address.createFromEthereum({ value: ownerAddress })
    const authorizedCaller = Address.createFromEthereum({ value: authorizedCallerAddress })
    const isAuthorized = await sdk.armada.users.isAuthorizedStakingRewardsCallerV2({
      owner,
      authorizedCaller,
    })
    return isAuthorized
  }
