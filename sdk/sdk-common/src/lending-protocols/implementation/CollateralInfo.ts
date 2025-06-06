import { Percentage } from '../../common/implementation/Percentage'
import { Price } from '../../common/implementation/Price'
import { RiskRatio } from '../../common/implementation/RiskRatio'
import { Token } from '../../common/implementation/Token'
import { TokenAmount } from '../../common/implementation/TokenAmount'
import { IPercentage } from '../../common/interfaces/IPercentage'
import { IPrice, ITokenAmount } from '../../common/interfaces/ITokenAmount'
import { IRiskRatio } from '../../common/interfaces/IRiskRatio'
import { IToken } from '../../common/interfaces/IToken'
import { SerializationService } from '../../services/SerializationService'
import { ICollateralInfo, ICollateralInfoData, __signature__ } from '../interfaces/ICollateralInfo'

/**
 * Type for the parameters of CollateralInfo
 */
export type CollateralInfoParameters = Omit<ICollateralInfoData, ''>

/**
 * @class CollateralInfo
 * @see ICollateralInfo
 */
export class CollateralInfo implements ICollateralInfo {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly token: IToken
  readonly price: IPrice
  readonly priceUSD: IPrice
  readonly liquidationThreshold: IRiskRatio
  readonly maxSupply: ITokenAmount
  readonly tokensLocked: ITokenAmount
  readonly liquidationPenalty: IPercentage

  /** FACTORY METHODS */

  static createFrom(params: CollateralInfoParameters): CollateralInfo {
    return new CollateralInfo(params)
  }

  /** CONSTRUCTOR */
  protected constructor(params: CollateralInfoParameters) {
    this.token = Token.createFrom(params.token)
    this.price = Price.createFrom(params.price)
    this.priceUSD = Price.createFrom(params.priceUSD)
    this.liquidationThreshold = RiskRatio.createFrom(params.liquidationThreshold)
    this.maxSupply = TokenAmount.createFrom(params.maxSupply)
    this.tokensLocked = TokenAmount.createFrom(params.tokensLocked)
    this.liquidationPenalty = Percentage.createFrom(params.liquidationPenalty)
  }
}

SerializationService.registerClass(CollateralInfo, { identifier: 'CollateralInfo' })
