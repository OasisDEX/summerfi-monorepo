import { LendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerLendingPool } from '../interfaces/IMakerLendingPool'
import {
  IMakerLendingPosition,
  IMakerLendingPositionParameters,
} from '../interfaces/IMakerLendingPosition'
import { IMakerLendingPositionId } from '../interfaces/IMakerLendingPositionId'

/**
 * @class MakerPosition
 * @see IMakerLendingPosition
 */
export class MakerLendingPosition extends LendingPosition implements IMakerLendingPosition {
  readonly _signature_2 = 'IMakerLendingPosition'

  readonly id: IMakerLendingPositionId
  readonly pool: IMakerLendingPool

  /** Factory method */
  static createFrom(params: IMakerLendingPositionParameters): MakerLendingPosition {
    return new MakerLendingPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerLendingPositionParameters) {
    super(params)

    this.id = params.id
    this.pool = params.pool
  }
}

SerializationService.registerClass(MakerLendingPosition)
