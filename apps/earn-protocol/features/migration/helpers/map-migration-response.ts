import { type ArmadaMigratablePosition, type IChainInfo } from '@summerfi/sdk-common'

/**
 * Maps and transforms migration response data from multiple chains into a flattened and sorted array of positions.
 *
 * This function:
 * 1. Takes an array of chain-specific migration responses
 * 2. Flattens the positions from all chains into a single array
 * 3. Enriches each position with its corresponding chainId
 * 4. Sorts positions by USD value in descending order (highest value first)
 *
 * @param {Object[]} response - Array of chain-specific migration responses
 * @param {IChainInfo} response[].chainInfo - Chain information including chainId
 * @param {ArmadaMigratablePosition[]} response[].positions - Array of migratable positions for the chain
 *
 * @returns {(ArmadaMigratablePosition & { chainId: number })[]} Flattened and sorted array of positions with chainId
 */
export const mapMigrationResponse = (
  response: {
    chainInfo: IChainInfo
    positions: ArmadaMigratablePosition[]
  }[],
) => {
  return response.flatMap(({ chainInfo, positions }) =>
    positions
      .map((position) => ({
        ...position,
        chainId: chainInfo.chainId,
      }))
      .sort((a, b) => Number(b.usdValue.amount) - Number(a.usdValue.amount)),
  )
}
