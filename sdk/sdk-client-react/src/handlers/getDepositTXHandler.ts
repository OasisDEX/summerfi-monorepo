import { ArmadaPoolId, ArmadaProtocol } from '@summerfi/armada-protocol-service'
import { type ISDKManager } from '@summerfi/sdk-client'
import {
  Address,
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
  }: {
    fleetAddress: string
    walletAddress: IAddress
    amount: string
    chainInfo: IChainInfo
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
        address: walletAddress,
      }),
    })

    const tokenAmount = TokenAmount.createFrom({
      amount,
      token: poolInfo.totalDeposits.token,
    })

    return sdk.armada.users.getNewDepositTX({
      poolId,
      user,
      amount: tokenAmount,
    })
  }
