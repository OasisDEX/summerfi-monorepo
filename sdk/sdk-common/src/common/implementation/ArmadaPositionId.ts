import { SerializationService } from '../../services/SerializationService'
import type { IUser } from '../../user/interfaces/IUser'
import { PositionType } from '../enums/PositionType'
import { __iarmadapositionid__ } from '../interfaces'
import type { IArmadaPositionId, IArmadaPositionIdData } from '../interfaces/IArmadaPositionId'
import { PositionId } from './PositionId'

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

SerializationService.registerClass(ArmadaPositionId, { identifier: 'ArmadaPositionId' })
