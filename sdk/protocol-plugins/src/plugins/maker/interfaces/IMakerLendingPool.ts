import { ILendingPool } from '@summerfi/sdk-common/protocols'
import { IMakerDebtConfigMap } from './IMakerDebtConfigMap'
import { IMakerCollateralConfigMap } from './IMakerCollateralConfigMap'

export interface IMakerLendingPool extends ILendingPool {
  collaterals: IMakerCollateralConfigMap
  debts: IMakerDebtConfigMap
}
