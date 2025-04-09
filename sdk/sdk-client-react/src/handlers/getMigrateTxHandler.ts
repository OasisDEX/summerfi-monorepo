import { ISDKManager } from '@summerfi/sdk-client'
import { Percentage, Address, IChainInfo, User, Wallet, ArmadaVaultId } from '@summerfi/sdk-common'

/**
 * Creates a handler function that generates migration transaction data for specified positions.
 *
 * This handler:
 * 1. Takes migration parameters including wallet address, chain info, fleet address, position IDs, and slippage
 * 2. Calls the SDK's getMigrateTx method to generate the transaction data
 * 3. Returns the migration transaction data
 *
 * @param {SummerSDK} sdk - The Summer SDK instance to use for generating transaction data
 * @returns {Function} A handler function that accepts migration parameters and returns transaction data
 */

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
