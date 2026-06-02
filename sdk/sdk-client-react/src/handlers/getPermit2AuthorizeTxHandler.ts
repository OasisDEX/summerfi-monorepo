import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

/**
 * @name getPermit2AuthorizationTxHandler
 * @description Creates a transaction to authorize the Permit2 contract to spend a specific token
 * @param params.chainId The chain ID where the token lives
 * @param params.tokenAddress The ERC-20 token address to authorize
 * @returns A TransactionInfo for the approve(Permit2, MaxUint256) transaction
 */
export const getPermit2AuthorizationTxHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  ({ chainId, tokenAddress }: { chainId: ChainId; tokenAddress: AddressValue }) => {
    return sdk.allowance.getPermit2AuthorizationTx({ chainId, tokenAddress })
  }
