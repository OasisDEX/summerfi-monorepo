import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { ArmadaVaultId, Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaSetWhitelistOpenTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    isOpen,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    isOpen: boolean
  }) => {
    const chainInfo = getChainInfoByChainId(chainId)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    return sdk.rwa.getSetWhitelistOpenTx({ vaultId, isOpen })
  }
