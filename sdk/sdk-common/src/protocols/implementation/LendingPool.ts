import { AddressValue, CurrencySymbol } from "../../common";
import { CollateralConfig, DebtConfig } from "../../protocols";
import { Token } from '../../common/implementation/Token'
import { IPool } from '../interfaces/IPool'
import { PoolType } from '../interfaces/PoolType'
import { Pool } from './Pool'

export interface ILendingPoolSerialized<GenericCollateralConfig extends CollateralConfig = CollateralConfig, GenericDebtConfig extends DebtConfig = DebtConfig> extends IPool {
  collaterals: Record<AddressValue, GenericCollateralConfig>
  debts: Record<AddressValue, GenericDebtConfig>
  baseCurrency: Token | CurrencySymbol
}

/**
 * @interface LendingPool
 * @description Represents a lending pool. Provides information about the collateral
 *              and debt tokens
 */
export class LendingPool<GenericCollateralConfig extends CollateralConfig = CollateralConfig, GenericDebtConfig extends DebtConfig = DebtConfig> extends Pool {
  public readonly type = PoolType.Lending
  // List of collateral configs to be used from the lending pool
  public readonly collaterals: Record<AddressValue, GenericCollateralConfig>
  // List of debt configs to be used from the lending pool
  public readonly debts: Record<AddressValue, GenericDebtConfig>

  public readonly baseCurrency: Token | CurrencySymbol

  constructor(params: Omit<ILendingPoolSerialized<GenericCollateralConfig, GenericDebtConfig>, 'type'>) {
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
