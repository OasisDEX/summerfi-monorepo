import {
  IArmadaPositionId,
  IArmadaPositionIdData,
  __iarmadapositionid__,
} from '@summerfi/armada-protocol-common'
import { IUser, PositionId, PositionType } from '@summerfi/sdk-common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * Type for the parameters of ArmadaPositionId
 */
export type ArmadaPositionIdParameters = Omit<IArmadaPositionIdData, 'type'>

/**
 * @class ArmadaPositionId
 * @see IArmadaPositionId
 */
export class ArmadaPositionId extends PositionId implements IArmadaPositionId {
  /** SIGNATURE */
  readonly [__iarmadapositionid__] = __iarmadapositionid__

  /** ATTRIBUTES */
  readonly type = PositionType.Armada
  readonly user: IUser

  /** Factory method */
  static createFrom(params: ArmadaPositionIdParameters): ArmadaPositionId {
    return new ArmadaPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: ArmadaPositionIdParameters) {
    super(params)

    this.user = params.user
  }
}

SerializationService.registerClass(ArmadaPositionId)
