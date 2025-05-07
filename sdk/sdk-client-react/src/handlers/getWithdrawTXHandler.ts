import { type ISDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ArmadaVaultId,
  Percentage,
  User,
  Wallet,
  type IAddress,
  type IChainInfo,
  type IToken,
  type ITokenAmount,
} from '@summerfi/sdk-common'

export const getWithdrawTXHandler =
  (sdk: ISDKManager) =>
  async ({
    fleetAddress,
    walletAddress,
    amount,
    toToken,
    chainInfo,
    slippage,
  }: {
    fleetAddress: string
    walletAddress: IAddress
    amount: ITokenAmount
    toToken: IToken
    chainInfo: IChainInfo
    slippage: number
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

    return sdk.armada.users.getWithdrawTx({
      vaultId: poolId,
      user,
      amount: amount,
      toToken: toToken,
      slippage: Percentage.createFrom({ value: slippage }),
    })
  }
