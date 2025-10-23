import type { ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, AddressValue } from '@summerfi/sdk-common'

/**
 * @name isWhitelistedHandler
 * @description Checks if an address is whitelisted in the AdmiralsQuarters contract
 * @param params.chainId The chain ID to check the whitelist status on
 * @param params.account The address to check for whitelist status
 */
export const isWhitelistedHandler =
  (sdk: ISDKManager) =>
  async ({ chainId, account }: { chainId: ChainId; account: AddressValue }) => {
    return sdk.armada.accessControl.isWhitelisted({ chainId, account })
  }
