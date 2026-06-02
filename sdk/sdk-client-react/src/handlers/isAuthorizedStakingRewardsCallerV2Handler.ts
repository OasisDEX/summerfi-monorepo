import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, Address } from '@summerfi/sdk-common'

/**
 * @name isAuthorizedStakingRewardsCallerV2Handler
 * @description Checks if a caller is authorized for staking rewards.
 *              When authorizedCallerAddress is omitted, the server defaults to the deployed
 *              AdmiralsQuarters address on the hub chain.
 * @param params.ownerAddress The owner's address
 * @param params.authorizedCallerAddress The address to check authorization for (optional; defaults to deployed AdmiralsQuarters)
 */
export const isAuthorizedStakingRewardsCallerV2Handler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({
    ownerAddress,
    authorizedCallerAddress,
  }: {
    ownerAddress: AddressValue
    authorizedCallerAddress?: AddressValue
  }) => {
    const owner = Address.createFromEthereum({ value: ownerAddress })
    const authorizedCaller =
      authorizedCallerAddress !== undefined
        ? Address.createFromEthereum({ value: authorizedCallerAddress })
        : undefined
    const isAuthorized = await sdk.armada.users.isAuthorizedStakingRewardsCallerV2({
      owner,
      authorizedCaller,
    })
    return isAuthorized
  }
