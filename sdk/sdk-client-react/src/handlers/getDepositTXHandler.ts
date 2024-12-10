import { type ISDKManager, ArmadaVaultId } from '@summerfi/sdk-client'
import {
  Address,
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

    return sdk.armada.users.getNewDepositTX({
      vaultId: poolId,
      user,
      assets: amount,
      slippage: Percentage.createFrom({ value: slippage }),
      shouldStake,
    })
  }
