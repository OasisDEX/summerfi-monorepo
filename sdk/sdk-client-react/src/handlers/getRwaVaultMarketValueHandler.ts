import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaVaultMarketValueHandler =
  (sdk: ISDKInstiManager) =>
  async ({ fleetAddress, chainId }: { fleetAddress: AddressValue; chainId: ChainId }) => {
    return sdk.rwa.getVaultMarketValue({ chainId, fleetAddress })
  }
