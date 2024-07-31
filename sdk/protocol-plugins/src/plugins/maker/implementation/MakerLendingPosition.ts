import { LendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerLendingPool } from '../interfaces/IMakerLendingPool'
import {
  IMakerLendingPosition,
  IMakerLendingPositionParameters,
  __signature__,
} from '../interfaces/IMakerLendingPosition'
import { IMakerLendingPositionId } from '../interfaces/IMakerLendingPositionId'

/**
 * @class MakerPosition
 * @see IMakerLendingPosition
 */
export class MakerLendingPosition extends LendingPosition implements IMakerLendingPosition {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: IMakerLendingPositionId
  readonly pool: IMakerLendingPool

  /** FACTORY */
  static createFrom(params: IMakerLendingPositionParameters): MakerLendingPosition {
    return new MakerLendingPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IMakerLendingPositionParameters) {
    super(params)

    this.id = params.id
    this.pool = params.pool
  }
}

SerializationService.registerClass(MakerLendingPosition)
