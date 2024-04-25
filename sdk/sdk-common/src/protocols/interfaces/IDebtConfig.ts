import { IPercentageData } from '../../common/interfaces/IPercentage'
import { IPriceData } from '../../common/interfaces/IPrice'
import { ITokenData } from '../../common/interfaces/IToken'
import { ITokenAmountData } from '../../common/interfaces/ITokenAmount'

export interface IDebtConfig {
  token: ITokenData
  price: IPriceData
  priceUSD: IPriceData
  rate: IPercentageData
  totalBorrowed: ITokenAmountData
  debtCeiling: ITokenAmountData
  debtAvailable: ITokenAmountData
  dustLimit: ITokenAmountData
  originationFee: IPercentageData
}
