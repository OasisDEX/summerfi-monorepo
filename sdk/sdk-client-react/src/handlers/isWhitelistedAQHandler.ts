import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, AddressValue } from '@summerfi/sdk-common'

/**
 * @name isWhitelistedAQHandler
 * @description Checks if an address is whitelisted in the AdmiralsQuarters contract
 * @param params.chainId The chain ID to check the whitelist status on
 * @param params.account The address to check for whitelist status
 */
export const isWhitelistedAQHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ chainId, account }: { chainId: ChainId; account: AddressValue }) => {
    return sdk.armada.accessControl.isWhitelistedAQ({
      chainId,
      account,
    })
  }
