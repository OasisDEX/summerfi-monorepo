import { IPool } from '../../protocols/interfaces/IPool'
import { PositionType } from '../enums/PositionType'
import { PositionId } from '../implementation/PositionId'
import { ITokenAmount } from './ITokenAmount'

export interface IPosition {
  readonly type: PositionType
  readonly positionId: PositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
  readonly pool: IPool
}
