import { type ISDKManager } from '@summerfi/sdk-client'
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

export const getDepositTXHandler =
  (sdk: ISDKManager) =>
  async ({
    fleetAddress,
    walletAddress,
    amount,
    chainInfo,
    slippage,
    shouldStake,
  }: {
    fleetAddress: string
    walletAddress: IAddress
    amount: ITokenAmount
    chainInfo: IChainInfo
    slippage: number
    shouldStake?: boolean
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

    return sdk.armada.users.getNewDepositTx({
      vaultId: poolId,
      user,
      amount: amount,
      slippage: Percentage.createFrom({ value: slippage }),
      shouldStake,
    })
  }
