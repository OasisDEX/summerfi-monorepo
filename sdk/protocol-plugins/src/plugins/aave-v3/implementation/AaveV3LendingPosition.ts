import { LendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IAaveV3LendingPool } from '../interfaces/IAaveV3LendingPool'
import {
  IAaveV3LendingPosition,
  IAaveV3LendingPositionParameters,
  __iaavev3lendingposition__,
} from '../interfaces/IAaveV3LendingPosition'
import { IAaveV3LendingPositionId } from '../interfaces/IAaveV3LendingPositionId'

/**
 * @class AaveV3Position
 * @see IAaveV3LendingPosition
 */
export class AaveV3LendingPosition extends LendingPosition implements IAaveV3LendingPosition {
  /** SIGNATURE */
  readonly [__iaavev3lendingposition__] = 'IAaveV3LendingPosition'

  /** ATTRIBUTES */
  readonly pool: IAaveV3LendingPool
  readonly id: IAaveV3LendingPositionId

  /** FACTORY */
  static createFrom(params: IAaveV3LendingPositionParameters): AaveV3LendingPosition {
    return new AaveV3LendingPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IAaveV3LendingPositionParameters) {
    super(params)

    this.pool = params.pool
    this.id = params.id
  }
}

SerializationService.registerClass(AaveV3LendingPosition)
