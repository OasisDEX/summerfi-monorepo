import { ILendingPool } from '../../../lending-protocols'
import { LendingPosition } from '../../../lending-protocols/implementation/LendingPosition'
import { SerializationService } from '../../../services/SerializationService'
import {
  IExternalLendingPosition,
  IExternalLendingPositionParameters,
  __iexternallendingposition__,
} from '../interfaces/IExternalLendingPosition'
import { IExternalLendingPositionId } from '../interfaces/IExternalLendingPositionId'

/**
 * @name ExternalLendingPosition
 * @see IExternalLendingPosition
 */
export class ExternalLendingPosition extends LendingPosition implements IExternalLendingPosition {
  /** SIGNATURE */
  readonly [__iexternallendingposition__] = 'IExternalLendingPosition'

  /** ATTRIBUTES */
  readonly id: IExternalLendingPositionId
  readonly pool: ILendingPool

  /** FACTORY */
  static createFrom(params: IExternalLendingPositionParameters): ExternalLendingPosition {
    return new ExternalLendingPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IExternalLendingPositionParameters) {
    super(params)

    this.id = params.id
    this.pool = params.pool
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `External lending position: id=${this.id}`
  }
}

SerializationService.registerClass(ExternalLendingPosition)
