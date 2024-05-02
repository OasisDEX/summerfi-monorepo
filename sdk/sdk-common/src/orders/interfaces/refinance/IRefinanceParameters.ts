import { IPercentageData } from '../../../common/interfaces/IPercentage'
import { IPositionData } from '../../../common/interfaces/IPosition'

export interface IRefinanceParameters {
  sourcePosition: IPositionData
  targetPosition: IPositionData
  slippage: IPercentageData
}

export function isRefinanceParameters(parameters: unknown): parameters is IRefinanceParameters {
  return typeof parameters === 'object' && parameters !== null && 'slippage' in parameters
}
