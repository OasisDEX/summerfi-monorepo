import { LendingPool } from '@summerfi/sdk-common/protocols'
import { ISparkLendingPool } from '../interfaces/ISparkLendingPool'
import { SparkCollateralConfigMap } from './SparkCollateralConfigMap'
import { SparkDebtConfigMap } from './SparkDebtConfigMap'

export class SparkLendingPool extends LendingPool implements ISparkLendingPool {
  readonly collaterals: SparkCollateralConfigMap
  readonly debts: SparkDebtConfigMap

  private constructor(params: ISparkLendingPool) {
    super(params)

    this.collaterals = SparkCollateralConfigMap.createFrom(params.collaterals)
    this.debts = SparkDebtConfigMap.createFrom(params.debts)
  }

  public static createFrom(params: ISparkLendingPool): SparkLendingPool {
    return new SparkLendingPool(params)
  }
}
