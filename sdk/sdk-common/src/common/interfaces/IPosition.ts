import { IPool } from '../../protocols/interfaces/IPool'
import { PositionId } from '../implementation/PositionId'
import { ITokenAmount } from './ITokenAmount'

export interface IPosition {
  readonly positionId: PositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
  readonly pool: IPool
}
