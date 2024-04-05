import { LendingPool } from '@summerfi/sdk-common/protocols'
import { IAaveV3LendingPool } from '../interfaces/IAaveV3LendingPool'
import { AaveV3CollateralConfigMap } from './AaveV3CollateralConfigMap'
import { AaveV3DebtConfigMap } from './AaveV3DebtConfigMap'
import { SerializationService } from '@summerfi/sdk-common/services'

export class AaveV3LendingPool extends LendingPool implements IAaveV3LendingPool {
  readonly collaterals: AaveV3CollateralConfigMap
  readonly debts: AaveV3DebtConfigMap

  private constructor(params: IAaveV3LendingPool) {
    super(params)

    this.collaterals = AaveV3CollateralConfigMap.createFrom(params.collaterals)
    this.debts = AaveV3DebtConfigMap.createFrom(params.debts)
  }

  public static createFrom(params: IAaveV3LendingPool): AaveV3LendingPool {
    return new AaveV3LendingPool(params)
  }
}

SerializationService.registerClass(AaveV3LendingPool)
