import { IPool } from '../../protocols/interfaces/IPool'
import { PositionType } from '../enums/PositionType'
import { IPositionId } from './IPositionId'
import { ITokenAmount } from './ITokenAmount'

export interface IPosition {
  readonly type: PositionType
  readonly positionId: IPositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
  readonly pool: IPool
}

export function isPosition(maybePosition: unknown): maybePosition is IPosition {
  return (
    typeof maybePosition === 'object' &&
    maybePosition !== null &&
    'type' in maybePosition &&
    'positionId' in maybePosition &&
    'debtAmount' in maybePosition &&
    'collateralAmount' in maybePosition &&
    'pool' in maybePosition
  )
}
