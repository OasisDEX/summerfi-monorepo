import { LendingPositionId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMakerLendingPositionId,
  IMakerLendingPositionIdParameters,
  __imakerlendingpositionid__,
} from '../interfaces/IMakerLendingPositionId'
import { MakerVaultId } from '../types/MakerVaultId'

/**
 * @class MakerPositionId
 * @see IMakerLendingPositionIdData
 */
export class MakerLendingPositionId extends LendingPositionId implements IMakerLendingPositionId {
  /** SIGNATURE */
  readonly [__imakerlendingpositionid__] = 'IMakerLendingPositionId'

  /** ATTRIBUTES */
  readonly vaultId: MakerVaultId

  /** FACTORY */
  static createFrom(params: IMakerLendingPositionIdParameters): MakerLendingPositionId {
    return new MakerLendingPositionId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IMakerLendingPositionIdParameters) {
    super(params)

    this.vaultId = params.vaultId
  }
}

SerializationService.registerClass(MakerLendingPositionId)
