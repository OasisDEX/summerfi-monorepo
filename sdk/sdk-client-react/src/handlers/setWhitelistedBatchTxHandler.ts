import type { ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, AddressValue } from '@summerfi/sdk-common'

/**
 * @name setWhitelistedBatchTxHandler
 * @description Sets the whitelist status for multiple addresses in the AdmiralsQuarters contract
 * @param params.chainId The chain ID to set the whitelist status on
 * @param params.accounts The addresses to set the whitelist status for
 * @param params.allowed The whitelist statuses to set (must match the length of accounts)
 */
export const setWhitelistedBatchTxHandler =
  (sdk: ISDKManager) =>
  async ({
    chainId,
    accounts,
    allowed,
  }: {
    chainId: ChainId
    accounts: AddressValue[]
    allowed: boolean[]
  }) => {
    return sdk.armada.accessControl.setWhitelistedBatch({ chainId, accounts, allowed })
  }
