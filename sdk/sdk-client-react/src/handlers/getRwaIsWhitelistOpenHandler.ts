import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { ArmadaVaultId, Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaIsWhitelistOpenHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
  }) => {
    const chainInfo = getChainInfoByChainId(chainId)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    return sdk.rwa.isWhitelistOpen({ vaultId })
  }
