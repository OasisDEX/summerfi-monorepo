import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

export const getRwaReceiptBalancesHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    fleetAddress,
    chainId,
    accountAddress,
    vaultType,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    accountAddress: AddressValue
    vaultType: RoundsVaultType
  }) => {
    return sdk.rwa.getReceiptBalances({ chainId, fleetAddress, accountAddress, vaultType })
  }
