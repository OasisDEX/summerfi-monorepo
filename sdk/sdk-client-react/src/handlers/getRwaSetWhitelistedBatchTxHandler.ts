import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { ArmadaVaultId, Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaSetWhitelistedBatchTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    accountAddresses,
    allowed,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    accountAddresses: AddressValue[]
    allowed: boolean[]
  }) => {
    const chainInfo = getChainInfoByChainId(chainId)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    const accounts = accountAddresses.map((a) => Address.createFromEthereum({ value: a }))
    return sdk.rwa.getSetWhitelistedBatchTx({ vaultId, accounts, allowed })
  }
