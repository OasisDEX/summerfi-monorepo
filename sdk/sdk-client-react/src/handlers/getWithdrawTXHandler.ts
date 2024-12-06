import { type ISDKManager, ArmadaVaultId } from '@summerfi/sdk-client'
import {
  Address,
  TokenAmount,
  User,
  Wallet,
  type IAddress,
  type IChainInfo,
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
    amount: string
    chainInfo: IChainInfo
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

    return sdk.armada.users.getWithdrawTX({
      vaultId: poolId,
      user,
      assets: tokenAmount,
    })
  }
