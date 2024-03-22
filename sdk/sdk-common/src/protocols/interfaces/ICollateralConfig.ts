import { IPercentage } from '../../common/interfaces/IPercentage'
import { IPrice } from '../../common/interfaces/IPrice'
import { IRiskRatio } from '../../common/interfaces/IRiskRatio'
import { IToken } from '../../common/interfaces/IToken'
import { ITokenAmount } from '../../common/interfaces/ITokenAmount'

export interface ICollateralConfig {
  token: IToken
  price: IPrice
  priceUSD: IPrice
  liquidationThreshold: IRiskRatio
  maxSupply: ITokenAmount
  tokensLocked: ITokenAmount
  liquidationPenalty: IPercentage
}
