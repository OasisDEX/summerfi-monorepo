import { IAddress, IRiskRatio, IToken } from '@summerfi/sdk-common'

/**
 * @description Morpho market parameters for a given market
 */
export type MorphoMarketParameters = {
  /** Debt token, which can be borrowed from the pool */
  readonly debtToken: IToken
  /** Collateral token used to collateralized the pool */
  readonly collateralToken: IToken
  /** The oracle used in the Morpho market */
  readonly oracle: IAddress
  /** The interest rate module used in the Morpho market */
  readonly irm: IAddress
  /** The liquidation LTV for the Morpho market */
  readonly lltv: IRiskRatio
}
