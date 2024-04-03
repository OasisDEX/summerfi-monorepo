import { IPercentage } from '../../../common/interfaces/IPercentage'
import { IPosition } from '../../../common/interfaces/IPosition'

export interface IRefinanceParameters {
  sourcePosition: IPosition
  targetPosition: IPosition
  slippage: IPercentage
}

export function isRefinanceParameters(parameters: unknown): parameters is IRefinanceParameters {
  return typeof parameters === 'object' && parameters !== null && 'slippage' in parameters
}
