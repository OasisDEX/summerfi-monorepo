import { IPercentage, ITokenAmount } from '@summerfi/sdk-common'

/**
 * @description Morpho market info retrieved from the protocol
 */
export type MorphoMarketInfo = {
  /** The total supply assets in the market, i.e. total collateral locked */
  totalSupplyAssets: ITokenAmount
  /** The total supply shares in the market having access to the supply assets */
  totalSupplyShares: bigint
  /** The total borrow assets in the market, i.e. total debt borrowed */
  totalBorrowAssets: ITokenAmount
  /** The total borrow shares in the market having borrowed from the market */
  totalBorrowShares: bigint
  /** Block timestamp of the last update */
  lastUpdated: bigint
  /** Fee charged when borrowing from the market */
  fee: IPercentage
}
