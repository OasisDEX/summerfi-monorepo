import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, AddressValue } from '@summerfi/sdk-common'

/**
 * @name setWhitelistedAQTxHandler
 * @description Sets the whitelist status for an address in the AdmiralsQuarters contract
 * @param params.chainId The chain ID to set the whitelist status on
 * @param params.account The address to set the whitelist status for
 * @param params.allowed The whitelist status to set
 */
export const setWhitelistedAQTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    account,
    allowed,
  }: {
    chainId: ChainId
    account: AddressValue
    allowed: boolean
  }) => {
    return sdk.armada.accessControl.setWhitelistedAQ({
      chainId,
      account,
      allowed,
    })
  }
