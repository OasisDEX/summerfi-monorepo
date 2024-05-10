import { MakerVaultId } from '../types/MakerVaultId'
import { IMakerPositionId, IMakerPositionIdData } from '../interfaces/IMakerPositionId'
import { PositionId } from '@summerfi/sdk-common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * @class MakerPositionId
 * @see IMakerPositionIdData
 */
export class MakerPositionId extends PositionId implements IMakerPositionId {
  readonly vaultId: MakerVaultId

  /** Factory method */
  static createFrom(params: IMakerPositionIdData): MakerPositionId {
    return new MakerPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerPositionIdData) {
    super(params)

    this.vaultId = params.vaultId
  }
}

SerializationService.registerClass(MakerPositionId)
