import { type ISDKManager, ArmadaVaultId } from '@summerfi/sdk-client'
import {
  Address,
  User,
  Wallet,
  type IAddress,
  type IChainInfo,
  type ITokenAmount,
} from '@summerfi/sdk-common'

export const getWithdrawTXHandler =
  (sdk: ISDKManager) =>
  async ({
    fleetAddress,
    walletAddress,
    amount,
    chainInfo,
  }: {
    fleetAddress: string
    walletAddress: IAddress
    amount: ITokenAmount
    chainInfo: IChainInfo
  }) => {
    const poolId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })

    const user = User.createFrom({
      chainInfo,
      wallet: Wallet.createFrom({
        address: walletAddress,
      }),
    })

    return sdk.armada.users.getWithdrawTX({
      vaultId: poolId,
      user,
      assets: amount,
    })
  }
