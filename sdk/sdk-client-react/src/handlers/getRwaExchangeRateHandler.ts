import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { ArmadaVaultId, Address, getChainInfoByChainId, RoundsVaultType } from '@summerfi/sdk-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaExchangeRateHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    roundId,
    vaultType,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    roundId: bigint
    vaultType: RoundsVaultType
  }) => {
    const chainInfo = getChainInfoByChainId(chainId)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    return sdk.rwa.getExchangeRate({ vaultId, roundId, vaultType })
  }
