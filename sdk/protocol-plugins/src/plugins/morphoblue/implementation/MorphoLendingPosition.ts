import { LendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import {
  IMorphoLendingPosition,
  IMorphoLendingPositionParameters,
  __imorpholendingposition__,
} from '../interfaces/IMorphoLendingPosition'
import { IMorphoLendingPositionId } from '../interfaces/IMorphoLendingPositionId'

/**
 * @class MorphoLendingPosition
 * @see IMorphoLendingPosition
 */
export class MorphoLendingPosition extends LendingPosition implements IMorphoLendingPosition {
  readonly [__imorpholendingposition__] = 'IMorphoLendingPosition'

  readonly id: IMorphoLendingPositionId
  readonly pool: IMorphoLendingPool

  /** Factory method */
  static createFrom(params: IMorphoLendingPositionParameters): MorphoLendingPosition {
    return new MorphoLendingPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoLendingPositionParameters) {
    super(params)

    this.id = params.id
    this.pool = params.pool
  }
}

SerializationService.registerClass(MorphoLendingPosition)
