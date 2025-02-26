import { ArmadaVaultId, ISDKManager } from '@summerfi/sdk-client'
import { Percentage, Address, type IAddress, IChainInfo, User, Wallet } from '@summerfi/sdk-common'

export const getMigrateTxHandler =
  (sdk: ISDKManager) =>
  ({
    walletAddress,
    chainInfo,
    fleetAddress,
    shouldStake,
    positionIds,
    slippage,
  }: {
    walletAddress: string
    chainInfo: IChainInfo
    fleetAddress: string
    shouldStake?: boolean
    positionIds: `0x${string}`[]
    slippage: number
  }) => {
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })

    const address = Address.createFromEthereum({ value: walletAddress })

    const user = User.createFrom({
      chainInfo,
      wallet: Wallet.createFrom({
        address,
      }),
    })

    return sdk.armada.users.getMigrationTX({
      user,
      vaultId,
      shouldStake,
      positionIds,
      slippage: Percentage.createFrom({ value: slippage }),
    })
  }
