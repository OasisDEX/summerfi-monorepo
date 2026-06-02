import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import { Address, ArmadaVaultId, IUser, IChainInfo } from '@summerfi/sdk-common'

export const getUnstakeFleetTokensTxHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({
    user,
    fleetAddress,
    amountValue,
    chainInfo,
  }: {
    user: IUser
    fleetAddress: string
    amountValue?: string
    chainInfo: IChainInfo
  }) => {
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })

    const addressValue = user.wallet.address.value

    return sdk.armada.users.getUnstakeFleetTokensTx({ addressValue, vaultId, amountValue })
  }
