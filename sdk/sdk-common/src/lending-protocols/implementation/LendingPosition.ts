import { Position } from '../../common/implementation/Position'
import { ITokenAmount } from '../../common/interfaces/ITokenAmount'
import { PositionType } from '../../common/types/PositionType'
import { SerializationService } from '../../services/SerializationService'
import { ILendingPool } from '../interfaces/ILendingPool'
import { ILendingPosition, ILendingPositionParameters } from '../interfaces/ILendingPosition'
import { ILendingPositionId } from '../interfaces/ILendingPositionId'
import { LendingPositionType } from '../types/LendingPositionType'

/**
 * @name LendingPosition
 * @see ILendingPosition
 */
export abstract class LendingPosition extends Position implements ILendingPosition {
  readonly _signature_1 = 'ILendingPosition'

  readonly subtype: LendingPositionType
  readonly id: ILendingPositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
  abstract readonly pool: ILendingPool

  protected constructor(params: ILendingPositionParameters) {
    super({
      ...params,
      type: PositionType.Lending,
    })

    this.subtype = params.subtype
    this.id = params.id
    this.debtAmount = params.debtAmount
    this.collateralAmount = params.collateralAmount
  }
}

SerializationService.registerClass(LendingPosition)