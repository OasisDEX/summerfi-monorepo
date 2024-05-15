import { IAddress, IPercentage, IToken } from '@summerfi/sdk-common'

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
  readonly lltv: IPercentage
}

/**
 * Market parameters definition for Morpho, to be used in the ABI
 * of the action wrappers
 */
export const MorphoMarketParametersAbi =
  'struct MarketParams { address loanToken; address collateralToken; address oracle; address irm; uint256 lltv; }' as const
