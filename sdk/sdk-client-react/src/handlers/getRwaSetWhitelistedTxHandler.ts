import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { ArmadaVaultId, Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaSetWhitelistedTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    accountAddress,
    allowed,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    accountAddress: AddressValue
    allowed: boolean
  }) => {
    const chainInfo = getChainInfoByChainId(chainId)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    const account = Address.createFromEthereum({ value: accountAddress })
    return sdk.rwa.getSetWhitelistedTx({ vaultId, account, allowed })
  }
