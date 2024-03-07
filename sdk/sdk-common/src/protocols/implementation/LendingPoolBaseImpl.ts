import {CurrencySymbol} from "~sdk-common/common";
import { Address } from '../../common/implementation/Address'
import { Token } from '../../common/implementation/Token'
import { IPoolId } from '../interfaces/IPoolId'
import { IProtocol } from '../interfaces/IProtocol'
import { CollateralConfig, DebtConfig, LendingPool } from '../interfaces/LendingPool'
import { PoolType } from '../interfaces/PoolType'
import { PoolBaseImpl } from './PoolBaseImpl'

export class LendingPoolImpl extends PoolBaseImpl<PoolType.Lending> implements LendingPool {
  public readonly poolBaseCurrency: Token | CurrencySymbol
  public readonly collaterals: CollateralConfig[]
  public readonly debts: DebtConfig[]

  constructor(params: {
    poolId: IPoolId
    protocol: IProtocol
    address?: Address
    TVL?: number
    poolBaseCurrency: Token | CurrencySymbol
    debts: DebtConfig[]
    collaterals: CollateralConfig[]
  }) {
    // TODO: resolve multicollateral issue
    super({
      ...params,
      type: PoolType.Lending,
    })

    this.collateralTokens = params.collateralTokens
    this.debtTokens = params.debtTokens
    this.poolBaseCurrency = params.poolBaseCurrency
  }
}
