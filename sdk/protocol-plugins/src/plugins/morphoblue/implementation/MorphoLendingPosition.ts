import { LendingPosition, SerializationService } from '@summerfi/sdk-common'
import { IMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import {
  IMorphoLendingPosition,
  IMorphoLendingPositionData,
  __signature__,
} from '../interfaces/IMorphoLendingPosition'
import { IMorphoLendingPositionId } from '../interfaces/IMorphoLendingPositionId'

/**
 * Type for the parameters of MorphoPosition
 */
export type MorphoLendingPositionParameters = Omit<IMorphoLendingPositionData, 'type'>

/**
 * @class MorphoLendingPosition
 * @see IMorphoLendingPosition
 */
export class MorphoLendingPosition extends LendingPosition implements IMorphoLendingPosition {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: IMorphoLendingPositionId
  readonly pool: IMorphoLendingPool

  /** FACTORY */
  static createFrom(params: MorphoLendingPositionParameters): MorphoLendingPosition {
    return new MorphoLendingPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MorphoLendingPositionParameters) {
    super(params)

    this.id = params.id
    this.pool = params.pool
  }
}

SerializationService.registerClass(MorphoLendingPosition, { identifier: 'MorphoLendingPosition' })
