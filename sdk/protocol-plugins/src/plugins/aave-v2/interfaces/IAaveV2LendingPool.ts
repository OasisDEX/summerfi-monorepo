import { ILendingPool } from '@summerfi/sdk-common/protocols'
import { IAaveV2DebtConfigMap } from './IAaveV2DebtConfigMap'
import { IAaveV2CollateralConfigMap } from './ICollateralConfigMap'

export interface IAaveV2LendingPool extends ILendingPool {
  collaterals: IAaveV2CollateralConfigMap
  debts: IAaveV2DebtConfigMap
}
