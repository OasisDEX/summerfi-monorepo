import { ILendingPool } from '@summerfi/sdk-common/protocols'
import { IAaveV3DebtConfigMap } from './IAaveV3DebtConfigMap'
import { IAaveV3CollateralConfigMap } from './IAaveV3CollateralConfigMap'

export interface IAaveV3LendingPool extends ILendingPool {
  collaterals: IAaveV3CollateralConfigMap
  debts: IAaveV3DebtConfigMap
}
