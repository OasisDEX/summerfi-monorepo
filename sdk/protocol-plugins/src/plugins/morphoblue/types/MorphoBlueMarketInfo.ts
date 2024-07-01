import { IPercentage, ITokenAmount } from '@summerfi/sdk-common'

/**
 * @description Morpho market info retrieved from the protocol
 */
export type MorphoBlueMarketInfo = {
  /** The total supply assets in the market, i.e. total collateral locked */
  readonly totalSupplyAssets: ITokenAmount
  /** The total supply shares in the market having access to the supply assets */
  readonly totalSupplyShares: bigint
  /** The total borrow assets in the market, i.e. total debt borrowed */
  readonly totalBorrowAssets: ITokenAmount
  /** The total borrow shares in the market having borrowed from the market */
  readonly totalBorrowShares: bigint
  /** Block timestamp of the last update */
  readonly lastUpdated: bigint
  /** Fee charged when borrowing from the market */
  readonly fee: IPercentage
}
