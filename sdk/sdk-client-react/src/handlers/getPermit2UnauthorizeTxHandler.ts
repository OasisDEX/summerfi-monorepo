import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

/**
 * @name getPermit2RevokeTxHandler
 * @description Creates a transaction to revoke the Permit2 contract authorization for a specific token
 * @param params.chainId The chain ID where the token lives
 * @param params.tokenAddress The ERC-20 token address to revoke
 * @returns A TransactionInfo for the approve(Permit2, 0) transaction
 */
export const getPermit2RevokeTxHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  ({ chainId, tokenAddress }: { chainId: ChainId; tokenAddress: AddressValue }) => {
    return sdk.allowance.getPermit2RevokeTx({ chainId, tokenAddress })
  }
