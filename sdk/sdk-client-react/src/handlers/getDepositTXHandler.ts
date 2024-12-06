import { type ISDKManager, ArmadaVaultId } from '@summerfi/sdk-client'
import {
  Address,
  Percentage,
  TokenAmount,
  User,
  Wallet,
  type IAddress,
  type IChainInfo,
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
    amount: string
    chainInfo: IChainInfo
    slippage: number
    shouldStake?: boolean
  }) => {
    const poolId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })

    const poolInfo = await sdk.armada.users.getVaultInfo({
      vaultId: poolId,
    })

    const user = User.createFrom({
      chainInfo,
      wallet: Wallet.createFrom({
        address: walletAddress,
      }),
    })

    const tokenAmount = TokenAmount.createFrom({
      amount,
      token: poolInfo.totalDeposits.token,
    })

    return sdk.armada.users.getNewDepositTX({
      vaultId: poolId,
      user,
      assets: tokenAmount,
      slippage: Percentage.createFrom({ value: slippage }),
      shouldStake,
    })
  }
