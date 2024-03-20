import { AddressValue } from '../../common/aliases/AddressValue'
import { CurrencySymbol } from '../../common/enums/CurrencySymbol'
import { CollateralConfig, DebtConfig } from '../../protocols/interfaces/LendingPool'
import { Token } from '../../common/implementation/Token'
import { IPool } from '../interfaces/IPool'
import { PoolType } from '../interfaces/PoolType'
import { Pool } from './Pool'

export interface ILendingPoolSerialized<
  CollateralConfigType extends CollateralConfig = CollateralConfig,
  DebtConfigType extends DebtConfig = DebtConfig,
> extends IPool {
  collaterals: Record<AddressValue, CollateralConfigType>
  debts: Record<AddressValue, DebtConfigType>
  baseCurrency: Token | CurrencySymbol
}

/**
 * @interface LendingPool
 * @description Represents a lending pool. Provides information about the collateral
 *              and debt tokens
 */
export class LendingPool<
  CollateralConfigType extends CollateralConfig = CollateralConfig,
  DebtConfigType extends DebtConfig = DebtConfig,
> extends Pool {
  public readonly type = PoolType.Lending
  // List of collateral configs to be used from the lending pool
  public readonly collaterals: Record<AddressValue, CollateralConfigType>
  // List of debt configs to be used from the lending pool
  public readonly debts: Record<AddressValue, DebtConfigType>

  public readonly baseCurrency: Token | CurrencySymbol

  constructor(params: Omit<ILendingPoolSerialized<CollateralConfigType, DebtConfigType>, 'type'>) {
    super({
      ...params,
      type: PoolType.Lending,
    })

    this.collaterals = params.collaterals
    this.debts = params.debts
    this.baseCurrency = params.baseCurrency
  }
}

export function isLendingPool(pool: IPool): pool is LendingPool {
  return pool.type === PoolType.Lending
}
