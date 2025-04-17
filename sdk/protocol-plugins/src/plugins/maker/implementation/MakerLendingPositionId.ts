import { LendingPositionId, SerializationService } from '@summerfi/sdk-common'
import {
  IMakerLendingPositionId,
  IMakerLendingPositionIdData,
  __signature__,
} from '../interfaces/IMakerLendingPositionId'
import { MakerVaultId } from '../types/MakerVaultId'

/**
 * Type for the parameters of the IMakerLendingPositionId
 */
export type MakerLendingPositionIdParameters = Omit<IMakerLendingPositionIdData, 'type'>

/**
 * @class MakerPositionId
 * @see IMakerLendingPositionIdData
 */
export class MakerLendingPositionId extends LendingPositionId implements IMakerLendingPositionId {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly vaultId: MakerVaultId

  /** FACTORY */
  static createFrom(params: MakerLendingPositionIdParameters): MakerLendingPositionId {
    return new MakerLendingPositionId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MakerLendingPositionIdParameters) {
    super(params)

    this.vaultId = params.vaultId
  }
}

SerializationService.registerClass(MakerLendingPositionId, { identifier: 'MakerLendingPositionId' })
