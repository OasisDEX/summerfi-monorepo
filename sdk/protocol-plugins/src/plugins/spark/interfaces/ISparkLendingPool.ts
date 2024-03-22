import { ILendingPool } from '@summerfi/sdk-common/protocols'
import { ISparkDebtConfigMap } from './ISparkDebtConfigMap'
import { ISparkCollateralConfigMap } from './ISparkCollateralConfigMap'

export interface ISparkLendingPool extends ILendingPool {
  collaterals: ISparkCollateralConfigMap
  debts: ISparkDebtConfigMap
}
