import { CurrencySymbol } from '../../common/enums/CurrencySymbol'
import { Token } from '../../common/implementation/Token'
import { IPool } from '../interfaces/IPool'
import { PoolType } from '../types/PoolType'
import { Pool } from './Pool'
import { SerializationService } from '../../services'
import { ILendingPool } from '../interfaces/ILendingPool'
import { CollateralConfigMap } from './CollateralConfigMap'
import { DebtConfigMap } from './DebtConfigMap'
import { isToken } from '../../common/interfaces/IToken'

/**
 * @interface LendingPool
 * @description Represents a lending pool. Provides information about the collateral
 *              and debt tokens
 */
export abstract class LendingPool extends Pool implements ILendingPool {
  public readonly type = PoolType.Lending
  // List of collateral configs to be used from the lending pool
  public abstract readonly collaterals: CollateralConfigMap
  // List of debt configs to be used from the lending pool
  public abstract readonly debts: DebtConfigMap

  public readonly baseCurrency: Token | CurrencySymbol

  protected constructor(params: ILendingPool) {
    if (params.type !== PoolType.Lending) {
      throw new Error('Pool type must be Lending')
    }

    super(params)

    this.baseCurrency = isToken(params.baseCurrency)
      ? Token.createFrom(params.baseCurrency)
      : params.baseCurrency
  }
}

export function isLendingPool(pool: IPool): pool is LendingPool {
  return pool.type === PoolType.Lending
}

SerializationService.registerClass(LendingPool)
