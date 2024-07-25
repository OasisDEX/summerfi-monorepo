import { LendingPositionId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMakerLendingPositionId,
  IMakerLendingPositionIdData,
} from '../interfaces/IMakerLendingPositionId'
import { MakerVaultId } from '../types/MakerVaultId'

/**
 * @class MakerPositionId
 * @see IMakerLendingPositionIdData
 */
export class MakerLendingPositionId extends LendingPositionId implements IMakerLendingPositionId {
  readonly vaultId: MakerVaultId

  /** Factory method */
  static createFrom(params: IMakerLendingPositionIdData): MakerLendingPositionId {
    return new MakerLendingPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerLendingPositionIdData) {
    super(params)

    this.vaultId = params.vaultId
  }
}

SerializationService.registerClass(MakerLendingPositionId)
