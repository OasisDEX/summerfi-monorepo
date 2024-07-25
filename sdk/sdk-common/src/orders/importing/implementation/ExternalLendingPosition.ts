import { ILendingPool } from '../../../lending-protocols'
import { LendingPosition } from '../../../lending-protocols/implementation/LendingPosition'
import { SerializationService } from '../../../services/SerializationService'
import { IExternalLendingPosition } from '../interfaces/IExternalLendingPosition'
import { ExternalLendingPositionId } from './ExternalLendingPositionId'

/**
 * @name ExternalLendingPosition
 * @see IExternalLendingPosition
 */
export class ExternalLendingPosition extends LendingPosition implements IExternalLendingPosition {
  readonly id: ExternalLendingPositionId
  readonly pool: ILendingPool

  /** Factory method */
  static createFrom(params: IExternalLendingPosition): ExternalLendingPosition {
    return new ExternalLendingPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: IExternalLendingPosition) {
    super(params)

    this.id = ExternalLendingPositionId.createFrom(params.id)
    this.pool = params.pool
  }

  toString(): string {
    return `External lending position: id=${this.id}`
  }
}

SerializationService.registerClass(ExternalLendingPosition)
