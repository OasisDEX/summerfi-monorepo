import type { Token } from '~sdk-common/common/implementation/Token'
import { IPool } from './IPool'
import { PoolType } from './PoolType'
import type { Percentage } from '~sdk-common/common/implementation/Percentage'

/**
 * @interface LendingPool
 * @description Represents a lending pool. Provides information about the collateral
 *              and debt tokens
 */
export interface LendingPool extends IPool {
  type: PoolType.Lending
  // List of collateral tokens to be used from the lending pool
  collateralTokens: Token[]
  // List of debt tokens to be used from the lending pool
  debtTokens: Token[]
  // Max LTV for the pool
  maxLTV: Percentage
}

export function isLendinPool(pool: IPool): pool is LendingPool {
  return pool.type === PoolType.Lending
}
