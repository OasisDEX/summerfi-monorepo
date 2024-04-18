import { ILendingPool } from '@summerfi/sdk-common/protocols'
import { ICompoundV3DebtConfigMap } from './ICompoundV3DebtConfigMap'
import { ICompoundV3CollateralConfigMap } from './ICollateralConfigMap'

export interface ICompoundV3LendingPool extends ILendingPool {
  collaterals: ICompoundV3CollateralConfigMap
  debts: ICompoundV3DebtConfigMap
}
