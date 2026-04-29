import { ISDKAdminManager, type ISDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ArmadaVaultId,
  Percentage,
  User,
  Wallet,
  type IAddress,
  type IChainInfo,
  type ITokenAmount,
} from '@summerfi/sdk-common'

export const getVaultSwitchEnsoTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    sourceFleetAddress,
    destinationFleetAddress,
    walletAddress,
    amount,
    chainInfo,
    slippage,
  }: {
    sourceFleetAddress: string
    destinationFleetAddress: string
    walletAddress: IAddress
    amount: ITokenAmount
    chainInfo: IChainInfo
    slippage: number
  }) => {
    const sourceVaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: sourceFleetAddress }),
    })
    const destinationVaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: destinationFleetAddress }),
    })

    const user = User.createFrom({
      chainInfo,
      wallet: Wallet.createFrom({
        address: walletAddress,
      }),
    })

    return sdk.armada.users.getVaultSwitchEnsoTx({
      user,
      amount,
      slippage: Percentage.createFrom({ value: slippage }),
      sourceVaultId,
      destinationVaultId,
    })
  }
