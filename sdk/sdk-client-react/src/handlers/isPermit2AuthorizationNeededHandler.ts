import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

/**
 * @name isPermit2AuthorizationNeededHandler
 * @description Checks if the Permit2 contract needs authorization for a specific token and amount
 * @param params.chainId The chain ID to check the allowance on
 * @param params.ownerAddress The token owner's address
 * @param params.tokenAddress The ERC-20 token address to check
 * @param params.amount The required amount (in token base units) to check against the current allowance
 * @returns True if the current Permit2 allowance is less than the required amount
 */
export const isPermit2AuthorizationNeededHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  ({
    chainId,
    ownerAddress,
    tokenAddress,
    amount,
  }: {
    chainId: ChainId
    ownerAddress: AddressValue
    tokenAddress: AddressValue
    amount: bigint
  }): Promise<boolean> => {
    return sdk.allowance.isPermit2AuthorizationNeeded({
      chainId,
      ownerAddress,
      tokenAddress,
      amount,
    })
  }
