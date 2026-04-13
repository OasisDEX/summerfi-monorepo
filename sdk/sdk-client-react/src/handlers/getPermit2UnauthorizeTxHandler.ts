import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { Address, type AddressValue } from '@summerfi/sdk-common'

/**
 * @name getPermit2RevokeTxHandler
 * @description Creates a transaction to revoke the Permit2 contract authorization for a specific token
 * @param params.tokenAddress The ERC-20 token address to revoke
 * @returns A TransactionInfo for the approve(Permit2, 0) transaction
 */
export const getPermit2RevokeTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  ({ tokenAddress }: { tokenAddress: AddressValue }) => {
    return sdk.intentSwaps.getPermit2RevokeTx({
      tokenAddress: Address.createFromEthereum({ value: tokenAddress }),
    })
  }
