import { ISDKManager } from '@summer_fi/sdk-client'
import { IChainInfo } from '@summer_fi/sdk-client'

/**
 * Creates a handler function that fetches migratable positions apy for a given position ids.
 *
 * This handler:
 * 1. Takes chainINfo and position ids as input
 * 2. Calls the SDK's getMigratablePositionsApy method
 * 3. Returns the migratable positions apys organized by position id
/**
 * @param {ISDKManager} sdk - The SDK manager instance to use for fetching data
 * @returns {Function} A handler function that accepts a wallet address and returns migratable positions
 */
/**
 * @returns {Function} A handler function that accepts chain info and position IDs and returns a promise resolving to migratable positions APY
 */
export const getMigratablePositionsHandlerApy =
  (sdk: ISDKManager) =>
  async ({ chainInfo, positionIds }: { chainInfo: IChainInfo; positionIds: `0x${string}`[] }) => {
    return sdk.armada.users.getMigratablePositionsApy({ chainInfo, positionIds })
  }
