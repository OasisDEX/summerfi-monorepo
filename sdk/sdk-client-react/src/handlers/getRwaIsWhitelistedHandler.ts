import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { ArmadaVaultId, Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaIsWhitelistedHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    accountAddress,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    accountAddress: AddressValue
  }) => {
    const chainInfo = getChainInfoByChainId(chainId)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    const account = Address.createFromEthereum({ value: accountAddress })
    return sdk.rwa.isWhitelisted({ vaultId, account })
  }
