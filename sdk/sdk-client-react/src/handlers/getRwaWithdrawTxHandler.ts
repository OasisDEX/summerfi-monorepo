import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { ArmadaVaultId, Address, getChainInfoByChainId, User } from '@summerfi/sdk-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaWithdrawTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    userAddress,
    sharesAmount,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    userAddress: AddressValue
    sharesAmount: string
  }) => {
    const chainInfo = getChainInfoByChainId(chainId)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    const user = User.createFromEthereum(chainId, userAddress)
    return sdk.rwa.getWithdrawTx({ vaultId, user, sharesAmount })
  }
