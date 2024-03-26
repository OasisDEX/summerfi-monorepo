import { CurrencySymbol } from '../enums/CurrencySymbol'
import { IToken } from './IToken'

export interface IPrice {
  value: string
  baseToken: IToken
  quoteToken: IToken | CurrencySymbol
}
