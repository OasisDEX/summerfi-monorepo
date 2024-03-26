import { CurrencySymbol } from '../../common/enums/CurrencySymbol'
import { IToken } from '../../common/interfaces/IToken'
import { ICollateralConfigMap } from './ICollateralConfigMap'
import { IDebtConfigMap } from './IDebtConfigMap'
import { IPool } from './IPool'

export interface ILendingPool extends IPool {
  collaterals: ICollateralConfigMap
  debts: IDebtConfigMap
  baseCurrency: IToken | CurrencySymbol
}
