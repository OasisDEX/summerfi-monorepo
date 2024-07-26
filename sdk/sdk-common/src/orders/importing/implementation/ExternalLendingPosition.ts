import { ILendingPool } from '../../../lending-protocols'
import { LendingPosition } from '../../../lending-protocols/implementation/LendingPosition'
import { SerializationService } from '../../../services/SerializationService'
import {
  IExternalLendingPosition,
  IExternalLendingPositionParameters,
} from '../interfaces/IExternalLendingPosition'
import { IExternalLendingPositionId } from '../interfaces/IExternalLendingPositionId'

/**
 * @name ExternalLendingPosition
 * @see IExternalLendingPosition
 */
export class ExternalLendingPosition extends LendingPosition implements IExternalLendingPosition {
  readonly _signature_2 = 'IExternalLendingPosition'

  readonly id: IExternalLendingPositionId
  readonly pool: ILendingPool

  /** Factory method */
  static createFrom(params: IExternalLendingPositionParameters): ExternalLendingPosition {
    return new ExternalLendingPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: IExternalLendingPositionParameters) {
    super(params)

    this.id = params.id
    this.pool = params.pool
  }

  toString(): string {
    return `External lending position: id=${this.id}`
  }
}

SerializationService.registerClass(ExternalLendingPosition)
