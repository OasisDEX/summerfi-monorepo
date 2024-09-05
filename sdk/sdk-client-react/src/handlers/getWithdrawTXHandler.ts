import { ArmadaPoolId, ArmadaPositionId, ArmadaProtocol } from '@summerfi/armada-protocol-service'
import { type ISDKManager } from '@summerfi/sdk-client'
import { Address, TokenAmount, User, Wallet, type IChainInfo } from '@summerfi/sdk-common'

export const getWithdrawTXHandler =
  (sdk: ISDKManager, chainInfo: IChainInfo) =>
  async ({
    fleetAddress,
    walletAddress,
    amount,
  }: {
    fleetAddress: string
    walletAddress: string
    amount: string
  }) => {
    const poolId = ArmadaPoolId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
      protocol: ArmadaProtocol.createFrom({ chainInfo }),
    })

    const poolInfo = await sdk.armada.users.getPoolInfo({
      poolId,
    })

    const user = User.createFrom({
      chainInfo,
      wallet: Wallet.createFrom({
        address: Address.createFromEthereum({ value: walletAddress }),
      }),
    })

    const tokenAmount = TokenAmount.createFrom({
      amount,
      token: poolInfo.totalDeposits.token,
    })

    return sdk.armada.users.getWithdrawTX({
      poolId,
      positionId: ArmadaPositionId.createFrom({
        id: walletAddress,
        user,
      }),
      amount: tokenAmount,
    })
  }
