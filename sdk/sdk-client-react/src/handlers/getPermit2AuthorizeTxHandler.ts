import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { Address, type AddressValue } from '@summerfi/sdk-common'

/**
 * @name getPermit2AuthorizationTxHandler
 * @description Creates a transaction to authorize the Permit2 contract to spend a specific token
 * @param params.tokenAddress The ERC-20 token address to authorize
 * @returns A TransactionInfo for the approve(Permit2, MaxUint256) transaction
 */
export const getPermit2AuthorizationTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  ({ tokenAddress }: { tokenAddress: AddressValue }) => {
    return sdk.intentSwaps.getPermit2AuthorizationTx({
      tokenAddress: Address.createFromEthereum({ value: tokenAddress }),
    })
  }
