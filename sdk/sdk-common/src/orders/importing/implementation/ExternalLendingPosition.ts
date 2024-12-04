import { ILendingPool } from '../../../lending-protocols'
import { LendingPosition } from '../../../lending-protocols/implementation/LendingPosition'
import { SerializationService } from '../../../services/SerializationService'
import {
  IExternalLendingPosition,
  IExternalLendingPositionData,
  __signature__,
} from '../interfaces/IExternalLendingPosition'
import { IExternalLendingPositionId } from '../interfaces/IExternalLendingPositionId'

/**
 * Type for the parameters of ExternalLendingPosition
 */
export type ExternalLendingPositionParameters = Omit<IExternalLendingPositionData, ''>

/**
 * @name ExternalLendingPosition
 * @see IExternalLendingPosition
 */
export class ExternalLendingPosition extends LendingPosition implements IExternalLendingPosition {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: IExternalLendingPositionId
  readonly vault: ILendingPool

  /** FACTORY */
  static createFrom(params: ExternalLendingPositionParameters): ExternalLendingPosition {
    return new ExternalLendingPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ExternalLendingPositionParameters) {
    super(params)

    this.id = params.id
    this.vault = params.pool
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `External lending position: id=${this.id}`
  }
}

SerializationService.registerClass(ExternalLendingPosition, {
  identifier: 'ExternalLendingPosition',
})
