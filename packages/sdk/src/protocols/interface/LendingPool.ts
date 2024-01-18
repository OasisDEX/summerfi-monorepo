import { Token } from '~sdk/common'
import { Pool } from './Pool'

/**
 * @interface LendingPool
 * @description Represents a lending pool. Provides information about the collateral
 *              and debt tokens
 */
export interface LendingPool extends Pool {
  collateralToken: Token
  debtToken: Token
}
