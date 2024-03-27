import {IToken} from "../../../common/interfaces/IToken";
import { IPercentage } from '../../../common/interfaces/IPercentage'
import { IPosition } from '../../../common/interfaces/IPosition'
import { ILendingPool } from '../../../protocols/interfaces/ILendingPool'

export interface IRefinanceParameters {
  position: IPosition
  targetPool: ILendingPool
  targetCollateral: IToken
  targetDebt: IToken
  slippage: IPercentage
}

export function isRefinanceParameters(parameters: unknown): parameters is IRefinanceParameters {
  return typeof parameters === 'object' && parameters !== null && 'slippage' in parameters
}
