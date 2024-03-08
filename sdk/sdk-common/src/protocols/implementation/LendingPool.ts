import type { Token } from '~sdk-common/common/implementation/Token'
import { IPool } from '../interfaces/IPool'
import { PoolType } from '../interfaces/PoolType'
import type { Percentage } from '~sdk-common/common/implementation/Percentage'
import { Pool } from './Pool'

export interface ILendingPoolSerialized extends IPool {
  collateralTokens: Token[]
  debtTokens: Token[]
  maxLTV: Percentage
}

/**
 * @interface LendingPool
 * @description Represents a lending pool. Provides information about the collateral
 *              and debt tokens
 */
export class LendingPool extends Pool {
  public readonly type = PoolType.Lending
  // List of collateral tokens to be used from the lending pool
  public readonly collateralTokens: Token[]
  // List of debt tokens to be used from the lending pool
  public readonly debtTokens: Token[]
  // Max LTV for the pool
  public readonly maxLTV: Percentage

  constructor(params: Omit<ILendingPoolSerialized, 'type'>) {
    super({
      ...params,
      type: PoolType.Lending,
    })

    this.collateralTokens = params.collateralTokens
    this.debtTokens = params.debtTokens
    this.maxLTV = params.maxLTV
  }
}

export function isLendingPool(pool: IPool): pool is LendingPool {
  return pool.type === PoolType.Lending
}
