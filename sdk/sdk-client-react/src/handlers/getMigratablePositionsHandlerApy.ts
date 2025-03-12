import { ISDKManager } from '@summerfi/sdk-client'
import { IChainInfo } from '@summerfi/sdk-common/common/interfaces'

/**
 * Creates a handler function that fetches migratable positions apy for a given position ids.
 *
 * This handler:
 * 1. Takes position ids as input
 * 2. Calls the SDK's getMigratablePositionsApy method
 * 3. Returns the migratable positions apys organized by position id
 *
 * @param {SummerSDK} sdk - The Summer SDK instance to use for fetching data
 * @returns {Function} A handler function that accepts a wallet address and returns migratable positions
 * @returns {Promise<{chainInfo: IChainInfo; positions: ArmadaMigratablePosition[]}[]>} The promise resolving to an array of chain-specific migratable positions
 */
export const getMigratablePositionsHandlerApy =
  (sdk: ISDKManager) =>
  async ({ chainInfo, positionIds }: { chainInfo: IChainInfo; positionIds: `0x${string}`[] }) => {
    return sdk.armada.users.getMigratablePositionsApy({ chainInfo, positionIds })
  }
