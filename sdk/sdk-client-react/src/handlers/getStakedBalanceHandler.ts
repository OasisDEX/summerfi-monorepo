import type { ISDKManager } from '@summerfi/sdk-client'
import { IUser, ArmadaVaultId, Address, IChainInfo } from '@summerfi/sdk-common'

export const getStakedBalanceHandler =
  (sdk: ISDKManager) =>
  async ({
    user,
    fleetAddress,
    chainInfo,
  }: {
    user: IUser
    fleetAddress: string
    chainInfo: IChainInfo
  }) => {
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })

    return sdk.armada.users.getStakedBalance({ user, vaultId })
  }
