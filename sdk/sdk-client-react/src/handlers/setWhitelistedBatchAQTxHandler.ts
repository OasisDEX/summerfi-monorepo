import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { ChainId, AddressValue } from '@summerfi/sdk-common'

/**
 * Sets the whitelist status for multiple addresses in the AdmiralsQuarters contract
 *
 * @param params.chainId The chain ID to set the whitelist status on
 * @param params.targetAddresses The addresses to set the whitelist status for
 * @param params.allowed The whitelist statuses to set (must match the length of targetAddresses)
 */
export const setWhitelistedBatchAQTxHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    chainId,
    targetAddresses,
    allowed,
  }: {
    chainId: ChainId
    targetAddresses: AddressValue[]
    allowed: boolean[]
  }) => {
    return sdk.armada.accessControl.setWhitelistedBatchAQ({
      chainId,
      targetAddresses,
      allowed,
    })
  }
