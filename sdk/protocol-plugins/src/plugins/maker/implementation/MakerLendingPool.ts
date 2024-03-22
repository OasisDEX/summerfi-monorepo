import { LendingPool } from '@summerfi/sdk-common/protocols'
import { IMakerLendingPool } from '../interfaces/IMakerLendingPool'
import { MakerCollateralConfigMap } from './MakerCollateralConfigMap'
import { MakerDebtConfigMap } from './MakerDebtConfigMap'

export class MakerLendingPool extends LendingPool implements IMakerLendingPool {
  readonly collaterals: MakerCollateralConfigMap
  readonly debts: MakerDebtConfigMap

  private constructor(params: IMakerLendingPool) {
    super(params)

    this.collaterals = MakerCollateralConfigMap.createFrom(params.collaterals)
    this.debts = MakerDebtConfigMap.createFrom(params.debts)
  }

  public static createFrom(params: IMakerLendingPool): MakerLendingPool {
    return new MakerLendingPool(params)
  }
}
