import { LendingPosition, SerializationService } from '@summerfi/sdk-common'
import { IMakerLendingPool } from '../interfaces/IMakerLendingPool'
import {
  IMakerLendingPosition,
  IMakerLendingPositionData,
  __signature__,
} from '../interfaces/IMakerLendingPosition'
import { IMakerLendingPositionId } from '../interfaces/IMakerLendingPositionId'

/**
 * Type for the parameters of MakerLendingPosition
 */
export type MakerLendingPositionParameters = Omit<IMakerLendingPositionData, 'type'>

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
  static createFrom(params: MakerLendingPositionParameters): MakerLendingPosition {
    return new MakerLendingPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MakerLendingPositionParameters) {
    super(params)

    this.id = params.id
    this.pool = params.pool
  }
}

SerializationService.registerClass(MakerLendingPosition, { identifier: 'MakerLendingPosition' })
