import { Percentage } from '../../common/implementation/Percentage'
import { Price } from '../../common/implementation/Price'
import { RiskRatio } from '../../common/implementation/RiskRatio'
import { Token } from '../../common/implementation/Token'
import { TokenAmount } from '../../common/implementation/TokenAmount'
import { SerializationService } from '../../services/SerializationService'
import { ICollateralConfig } from '../interfaces/ICollateralConfig'

/**
 * Class representing the configuration for a collateral.
 * @implements {ICollateralConfig}
 */
export class CollateralConfig implements ICollateralConfig {
  /**
   * The token associated with the collateral.
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
   * The liquidation threshold for the collateral.
   * @type {RiskRatio}
   */
  readonly liquidationThreshold: RiskRatio

  /**
   * The maximum supply of the token that can be used as collateral.
   * @type {TokenAmount}
   */
  readonly maxSupply: TokenAmount

  /**
   * The amount of the token that is currently locked as collateral.
   * @type {TokenAmount}
   */
  readonly tokensLocked: TokenAmount

  /**
   * The penalty for liquidation of the collateral.
   * @type {Percentage}
   */
  readonly liquidationPenalty: Percentage

  /**
   * Constructs a new CollateralConfig object.
   * @param {ICollateralConfig} params - The parameters for the collateral configuration.
   * @protected
   */
  protected constructor(params: ICollateralConfig) {
    this.token = Token.createFrom(params.token)
    this.price = Price.createFrom(params.price)
    this.priceUSD = Price.createFrom(params.priceUSD)
    this.liquidationThreshold = RiskRatio.createFrom(params.liquidationThreshold)
    this.maxSupply = TokenAmount.createFrom(params.maxSupply)
    this.tokensLocked = TokenAmount.createFrom(params.tokensLocked)
    this.liquidationPenalty = Percentage.createFrom(params.liquidationPenalty)
  }

  /**
   * Creates a new CollateralConfig object from an object implementing the ICollateralConfig interface.
   * @param {ICollateralConfig} params - The parameters for the collateral configuration.
   * @returns {CollateralConfig} - A new CollateralConfig object.
   * @static
   */
  static createFrom(params: ICollateralConfig): CollateralConfig {
    return new CollateralConfig(params)
  }
}

SerializationService.registerClass(CollateralConfig)
