import { TokenAmount } from '../../common/implementation/TokenAmount'
import { ITokenAmount } from '../../common/interfaces/ITokenAmount'
import { PositionType } from '../../common/types/PositionType'
import { SerializationService } from '../../services/SerializationService'
import { ILendingPool } from '../interfaces/ILendingPool'
import { ILendingPosition, ILendingPositionData } from '../interfaces/ILendingPosition'
import { LendingPositionType } from '../types/LendingPositionType'
import { LendingPositionId } from './LendingPositionId'

/**
 * @name LendingPosition
 * @see ILendingPosition
 */
export abstract class LendingPosition implements ILendingPosition {
  readonly type: PositionType.Lending
  readonly subtype: LendingPositionType
  readonly id: LendingPositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
  abstract readonly pool: ILendingPool

  protected constructor(params: ILendingPositionData) {
    this.type = params.type
    this.subtype = params.subtype
    this.id = params.id
    this.debtAmount = TokenAmount.createFrom(params.debtAmount)
    this.collateralAmount = TokenAmount.createFrom(params.collateralAmount)
  }
}

SerializationService.registerClass(LendingPosition)
