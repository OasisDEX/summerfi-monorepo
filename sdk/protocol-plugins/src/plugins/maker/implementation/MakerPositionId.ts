import { MakerVaultId } from '../types/MakerVaultId'
import { IMakerPositionId } from '../interfaces/IMakerPositionId'
import { PositionId } from '@summerfi/sdk-common'
import { SerializationService } from '@summerfi/sdk-common/services'

export class MakerPositionId extends PositionId implements IMakerPositionId {
  readonly vaultId: MakerVaultId

  private constructor(params: IMakerPositionId) {
    super(params)

    this.vaultId = params.vaultId
  }

  static createFrom(params: IMakerPositionId): MakerPositionId {
    return new MakerPositionId(params)
  }
}

SerializationService.registerClass(MakerPositionId)
