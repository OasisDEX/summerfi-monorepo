import { Percentage, Token } from '~sdk-common/common'
import { IPool } from './IPool'

/**
 * @interface LendingPool
 * @description Represents a lending pool. Provides information about the collateral
 *              and debt tokens
 */
export interface LendingPool extends IPool {
  // List of collateral tokens to be used from the lending pool
  collateralTokens: Token[]
  // List of debt tokens to be used from the lending pool
  debtTokens: Token[]
  // Max LTV for the pool
  maxLTV: Percentage
}
