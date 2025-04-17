import { ISDKManager } from '@summerfi/sdk-client'
import { Address, Wallet } from '@summerfi/sdk-common'
import { User } from '@summerfi/sdk-common'
import { IChainInfo } from '@summerfi/sdk-common'

/**
 * Creates a handler function that fetches migratable positions for a given wallet address.
 *
 * This handler:
 * 1. Takes a wallet address as input
 * 2. Calls the SDK's getMigratablePositions method
 * 3. Returns the migratable positions organized by chain
 *
 * @param {SummerSDK} sdk - The Summer SDK instance to use for fetching data
 * @returns {Function} A handler function that accepts a wallet address and returns migratable positions
 * @returns {Promise<{chainInfo: IChainInfo; positions: ArmadaMigratablePosition[]}[]>} The promise resolving to an array of chain-specific migratable positions
 */
export const getMigratablePositionsHandler =
  (sdk: ISDKManager) =>
  async ({ walletAddress, chainInfo }: { walletAddress: string; chainInfo: IChainInfo }) => {
    const address = Address.createFromEthereum({ value: walletAddress })

    const user = User.createFrom({
      chainInfo,
      wallet: Wallet.createFrom({
        address,
      }),
    })

    return sdk.armada.users.getMigratablePositions({ chainInfo, user })
  }
