import { Percentage } from '../../common/implementation/Percentage'
import { Price } from '../../common/implementation/Price'
import { RiskRatio } from '../../common/implementation/RiskRatio'
import { Token } from '../../common/implementation/Token'
import { TokenAmount } from '../../common/implementation/TokenAmount'
import { SerializationService } from '../../services/SerializationService'
import { ICollateralInfo, ICollateralInfoData } from '../interfaces/ICollateralInfo'

/**
 * @class CollateralInfo
 * @see ICollateralInfo
 */
export class CollateralInfo implements ICollateralInfo {
  readonly token: Token
  readonly price: Price
  readonly priceUSD: Price
  readonly liquidationThreshold: RiskRatio
  readonly maxSupply: TokenAmount
  readonly tokensLocked: TokenAmount
  readonly liquidationPenalty: Percentage

  protected constructor(params: ICollateralInfoData) {
    this.token = Token.createFrom(params.token)
    this.price = Price.createFrom(params.price)
    this.priceUSD = Price.createFrom(params.priceUSD)
    this.liquidationThreshold = RiskRatio.createFrom(params.liquidationThreshold)
    this.maxSupply = TokenAmount.createFrom(params.maxSupply)
    this.tokensLocked = TokenAmount.createFrom(params.tokensLocked)
    this.liquidationPenalty = Percentage.createFrom(params.liquidationPenalty)
  }

  static createFrom(params: ICollateralInfoData): CollateralInfo {
    return new CollateralInfo(params)
  }
}

SerializationService.registerClass(CollateralInfo)
