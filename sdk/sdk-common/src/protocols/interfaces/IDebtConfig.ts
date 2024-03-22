import { IPercentage } from '../../common/interfaces/IPercentage'
import { IPrice } from '../../common/interfaces/IPrice'
import { IToken } from '../../common/interfaces/IToken'
import { ITokenAmount } from '../../common/interfaces/ITokenAmount'

export interface IDebtConfig {
  token: IToken
  price: IPrice
  priceUSD: IPrice
  rate: IPercentage
  totalBorrowed: ITokenAmount
  debtCeiling: ITokenAmount
  debtAvailable: ITokenAmount
  dustLimit: ITokenAmount
  originationFee: IPercentage
}
