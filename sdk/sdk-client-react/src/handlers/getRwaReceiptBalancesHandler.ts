import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import {
  ArmadaVaultId,
  Address,
  getChainInfoByChainId,
  RoundsVaultType,
} from '@summerfi/sdk-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaReceiptBalancesHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
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
    const chainInfo = getChainInfoByChainId(chainId)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    const account = Address.createFromEthereum({ value: accountAddress })
    return sdk.rwa.getReceiptBalances({ vaultId, account, vaultType })
  }
