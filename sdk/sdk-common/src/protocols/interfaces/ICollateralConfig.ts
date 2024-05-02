import { IPercentageData } from '../../common/interfaces/IPercentage'
import { IPriceData } from '../../common/interfaces/IPrice'
import { IRiskRatioData } from '../../common/interfaces/IRiskRatio'
import { ITokenData } from '../../common/interfaces/IToken'
import { ITokenAmountData } from '../../common/interfaces/ITokenAmount'

export interface ICollateralConfig {
  token: ITokenData
  price: IPriceData
  priceUSD: IPriceData
  liquidationThreshold: IRiskRatioData
  maxSupply: ITokenAmountData
  tokensLocked: ITokenAmountData
  liquidationPenalty: IPercentageData
}
