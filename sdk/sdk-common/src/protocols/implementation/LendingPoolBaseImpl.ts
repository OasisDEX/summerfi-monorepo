import {AddressValue} from "~sdk-common/common";
import { CurrencySymbol } from "../../common/enums/CurrencySymbol";
import { Address } from '../../common/implementation/Address'
import { Token } from '../../common/implementation/Token'
import { IPoolId } from '../interfaces/IPoolId'
import { IProtocol } from '../interfaces/IProtocol'
import { CollateralConfig, DebtConfig, LendingPool } from '../interfaces/LendingPool'
import { PoolType } from '../interfaces/PoolType'
import { PoolBaseImpl } from './PoolBaseImpl'

export class LendingPoolImpl extends PoolBaseImpl<PoolType.Lending> implements LendingPool {
  public readonly poolBaseCurrency: Token | CurrencySymbol
  public readonly collaterals: Record<AddressValue, CollateralConfig>
  public readonly debts: Record<AddressValue, DebtConfig>

  constructor(params: {
    poolId: IPoolId
    protocol: IProtocol
    address?: Address
    TVL?: number
    poolBaseCurrency: Token | CurrencySymbol
    debts: Record<AddressValue, DebtConfig>
    collaterals: Record<AddressValue, CollateralConfig>
  }) {
    // TODO: resolve multicollateral issue
    super({
      ...params,
      type: PoolType.Lending,
    })

    this.collaterals = params.collaterals
    this.debts = params.debts
    this.poolBaseCurrency = params.poolBaseCurrency
  }
}
