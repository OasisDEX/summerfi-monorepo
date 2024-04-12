import { LendingPool } from '@summerfi/sdk-common/protocols'
import { IAaveV2LendingPool } from '../interfaces/IAaveV2LendingPool'
import { AaveV2CollateralConfigMap } from './AaveV2CollateralConfigMap'
import { AaveV2DebtConfigMap } from './AaveV2DebtConfigMap'
import { SerializationService } from '@summerfi/sdk-common/services'

export class AaveV2LendingPool extends LendingPool implements IAaveV2LendingPool {
readonly collaterals: AaveV2CollateralConfigMap
readonly debts: AaveV2DebtConfigMap

private constructor(params: IAaveV2LendingPool) {
super(params)

this.collaterals = AaveV2CollateralConfigMap.createFrom(params.collaterals)
this.debts = AaveV2DebtConfigMap.createFrom(params.debts)
}

public static createFrom(params: IAaveV2LendingPool): AaveV2LendingPool {
return new AaveV2LendingPool(params)
}
}

SerializationService.registerClass(AaveV2LendingPool)
