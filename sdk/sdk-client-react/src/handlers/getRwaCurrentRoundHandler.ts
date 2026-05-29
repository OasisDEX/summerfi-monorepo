import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import {
  ArmadaVaultId,
  Address,
  getChainInfoByChainId,
  RoundsVaultType,
} from '@summerfi/sdk-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaCurrentRoundHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    vaultType,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    vaultType: RoundsVaultType
  }) => {
    const chainInfo = getChainInfoByChainId(chainId)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    return sdk.rwa.getCurrentRound({ vaultId, vaultType })
  }
