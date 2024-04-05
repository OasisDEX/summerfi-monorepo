import { Percentage } from '../../common/implementation/Percentage'
import { Price } from '../../common/implementation/Price'
import { Token } from '../../common/implementation/Token'
import { TokenAmount } from '../../common/implementation/TokenAmount'
import { SerializationService } from '../../services/SerializationService'
import { IDebtConfig } from '../interfaces/IDebtConfig'

export class DebtConfig implements IDebtConfig {
  readonly token: Token
  readonly price: Price
  readonly priceUSD: Price
  readonly rate: Percentage
  readonly totalBorrowed: TokenAmount
  readonly debtCeiling: TokenAmount
  readonly debtAvailable: TokenAmount
  readonly dustLimit: TokenAmount
  readonly originationFee: Percentage

  protected constructor(params: IDebtConfig) {
    this.token = Token.createFrom(params.token)
    this.price = Price.createFrom(params.price)
    this.priceUSD = Price.createFrom(params.priceUSD)
    this.rate = Percentage.createFrom(params.rate)
    this.totalBorrowed = TokenAmount.createFrom(params.totalBorrowed)
    this.debtCeiling = TokenAmount.createFrom(params.debtCeiling)
    this.debtAvailable = TokenAmount.createFrom(params.debtAvailable)
    this.dustLimit = TokenAmount.createFrom(params.dustLimit)
    this.originationFee = Percentage.createFrom(params.originationFee)
  }

  static createFrom(params: IDebtConfig): DebtConfig {
    return new DebtConfig(params)
  }
}

SerializationService.registerClass(DebtConfig)
