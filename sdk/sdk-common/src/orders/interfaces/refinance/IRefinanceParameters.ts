import { IPercentage } from '../../../common/interfaces/IPercentage'
import { IPosition } from '../../../common/interfaces/IPosition'
import { IPool } from '../../../protocols/interfaces/IPool'

export interface IRefinanceParameters {
  position: IPosition
  targetPool: IPool
  slippage: IPercentage
}

export function isRefinanceParameters(parameters: unknown): parameters is IRefinanceParameters {
  return typeof parameters === 'object' && parameters !== null && 'slippage' in parameters
}
