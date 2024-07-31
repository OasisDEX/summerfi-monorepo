import { IArmadaPositionId, IArmadaPositionIdParameters } from '@summerfi/armada-protocol-common'
import { IUser, PositionId, PositionType } from '@summerfi/sdk-common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * @class ArmadaPositionId
 * @see IArmadaPositionId
 */
export class ArmadaPositionId extends PositionId implements IArmadaPositionId {
  readonly _signature_1 = 'IArmadaPositionId'

  readonly user: IUser

  /** Factory method */
  static createFrom(params: IArmadaPositionIdParameters): ArmadaPositionId {
    return new ArmadaPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: IArmadaPositionIdParameters) {
    super({
      ...params,
      type: PositionType.Earn,
    })

    this.user = params.user
  }
}

SerializationService.registerClass(ArmadaPositionId)
