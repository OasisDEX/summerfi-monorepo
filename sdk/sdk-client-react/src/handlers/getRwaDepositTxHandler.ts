import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { ArmadaVaultId, Address, getChainInfoByChainId, User } from '@summerfi/sdk-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaDepositTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    userAddress,
    assetsAmount,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    userAddress: AddressValue
    assetsAmount: string
  }) => {
    const chainInfo = getChainInfoByChainId(chainId)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    const user = User.createFromEthereum(chainId, userAddress)
    return sdk.rwa.getDepositTx({ vaultId, user, assetsAmount })
  }
