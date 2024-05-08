import { Percentage } from '../../common/implementation/Percentage'
import { Price } from '../../common/implementation/Price'
import { Token } from '../../common/implementation/Token'
import { TokenAmount } from '../../common/implementation/TokenAmount'
import { SerializationService } from '../../services/SerializationService'
import { IDebtConfig } from '../interfaces/IDebtConfig'

/**
 * Class representing the configuration for a debt.
 * @implements {IDebtConfig}
 */
export class DebtConfig implements IDebtConfig {
  /**
   * The token associated with the debt.
   * @type {Token}
   */
  readonly token: Token

  /**
   * The price of the token in another currency.
   * @type {Price}
   */
  readonly price: Price

  /**
   * The price of the token in USD.
   * @type {Price}
   */
  readonly priceUSD: Price

  /**
   * The interest rate for the debt.
   * @type {Percentage}
   */
  readonly rate: Percentage

  /**
   * The total amount of the token that has been borrowed.
   * @type {TokenAmount}
   */
  readonly totalBorrowed: TokenAmount

  /**
   * The maximum amount of the token that can be borrowed.
   * @type {TokenAmount}
   */
  readonly debtCeiling: TokenAmount

  /**
   * The amount of the token that is currently available to be borrowed.
   * @type {TokenAmount}
   */
  readonly debtAvailable: TokenAmount

  /**
   * The minimum amount of the token that can be borrowed.
   * @type {TokenAmount}
   */
  readonly dustLimit: TokenAmount

  /**
   * The fee for originating the debt.
   * @type {Percentage}
   */
  readonly originationFee: Percentage

  /**
   * Constructs a new DebtConfig object.
   * @param {IDebtConfig} params - The parameters for the debt configuration.
   * @protected
   */
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
  /**
   * Creates a new DebtConfig object from an object implementing the IDebtConfig interface.
   * @param {IDebtConfig} params - The parameters for the debt configuration.
   * @returns {DebtConfig} - A new DebtConfig object.
   * @static
   */
  static createFrom(params: IDebtConfig): DebtConfig {
    return new DebtConfig(params)
  }
}

SerializationService.registerClass(DebtConfig)
