import { Percentage } from '../../common/implementation/Percentage'
import { Price } from '../../common/implementation/Price'
import { Token } from '../../common/implementation/Token'
import { TokenAmount } from '../../common/implementation/TokenAmount'
import { SerializationService } from '../../services/SerializationService'
import { IDebtInfo, IDebtInfoData } from '../interfaces/IDebtInfo'

/**
 * @class DebtInfo
 * @see IDebtInfo
 *
 * For now this class can be re-used among all the protocols and there is no need for specialization
 */
export class DebtInfo implements IDebtInfo {
  readonly token: Token
  readonly price: Price
  readonly priceUSD: Price
  readonly interestRate: Percentage
  readonly totalBorrowed: TokenAmount
  readonly debtCeiling: TokenAmount
  readonly debtAvailable: TokenAmount
  readonly dustLimit: TokenAmount
  readonly originationFee: Percentage

  protected constructor(params: IDebtInfoData) {
    this.token = Token.createFrom(params.token)
    this.price = Price.createFrom(params.price)
    this.priceUSD = Price.createFrom(params.priceUSD)
    this.interestRate = Percentage.createFrom(params.interestRate)
    this.totalBorrowed = TokenAmount.createFrom(params.totalBorrowed)
    this.debtCeiling = TokenAmount.createFrom(params.debtCeiling)
    this.debtAvailable = TokenAmount.createFrom(params.debtAvailable)
    this.dustLimit = TokenAmount.createFrom(params.dustLimit)
    this.originationFee = Percentage.createFrom(params.originationFee)
  }

  static createFrom(params: IDebtInfoData): DebtInfo {
    return new DebtInfo(params)
  }
}

SerializationService.registerClass(DebtInfo)
