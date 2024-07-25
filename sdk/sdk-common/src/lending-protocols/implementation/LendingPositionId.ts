import { PositionId } from '../../common/implementation/PositionId'
import { PositionType } from '../../common/types/PositionType'
import { SerializationService } from '../../services/SerializationService'
import { ILendingPositionIdData } from '../interfaces/ILendingPositionId'

/**
 * @class LendingPositionId
 * @see ILendingPositionIdData
 */
export abstract class LendingPositionId extends PositionId implements ILendingPositionIdData {
  readonly id: string
  readonly type: PositionType.Lending

  protected constructor(params: ILendingPositionIdData) {
    super(params)

    this.id = params.id
    this.type = params.type
  }

  toString(): string {
    return `Lending Position ID: ${this.id} with type: ${this.type}`
  }
}

SerializationService.registerClass(LendingPositionId)
