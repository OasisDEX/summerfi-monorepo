import { ArmadaPoolId, ArmadaPositionId, ArmadaProtocol } from '@summerfi/armada-protocol-service'
import { type ISDKManager } from '@summerfi/sdk-client'
import { Address, TokenAmount, User, Wallet } from '@summerfi/sdk-common'

export const getWithdrawTXHandler =
  (sdk: ISDKManager) =>
  async ({
    chainId,
    fleetAddress,
    walletAddress,
    amount,
  }: {
    chainId: number
    fleetAddress: string
    walletAddress: string
    amount: string
  }) => {
    const chain = await sdk.chains.getChainById({
      chainId,
    })

    if (!chain) {
      throw new Error('Chain not found')
    }
    const { chainInfo } = chain

    const poolId = ArmadaPoolId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
      protocol: ArmadaProtocol.createFrom({ chainInfo }),
    })

    const poolInfo = await sdk.armada.getPoolInfo({
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

    return sdk.armada.getWithdrawTX({
      poolId,
      positionId: ArmadaPositionId.createFrom({
        id: walletAddress,
        user,
      }),
      amount: tokenAmount,
    })
  }