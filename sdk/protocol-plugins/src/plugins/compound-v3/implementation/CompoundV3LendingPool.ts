import { LendingPool } from '@summerfi/sdk-common/protocols'
import { ICompoundV3LendingPool } from '../interfaces/ICompoundV3LendingPool'
import { CompoundV3CollateralConfigMap } from './CompoundV3CollateralConfigMap'
import { CompoundV3DebtConfigMap } from './CompoundV3DebtConfigMap'
import { SerializationService } from '@summerfi/sdk-common/services'

export class CompoundV3LendingPool extends LendingPool implements ICompoundV3LendingPool {
  readonly collaterals: CompoundV3CollateralConfigMap
  readonly debts: CompoundV3DebtConfigMap

  private constructor(params: ICompoundV3LendingPool) {
    super(params)

    this.collaterals = CompoundV3CollateralConfigMap.createFrom(params.collaterals)
    this.debts = CompoundV3DebtConfigMap.createFrom(params.debts)
  }

  public static createFrom(params: ICompoundV3LendingPool): CompoundV3LendingPool {
    return new CompoundV3LendingPool(params)
  }
}

SerializationService.registerClass(CompoundV3LendingPool)
