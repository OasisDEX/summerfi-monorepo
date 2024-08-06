import {
  IArmadaPosition,
  IArmadaPositionData,
  IArmadaPositionId,
  __iarmadaposition__,
} from '@summerfi/armada-protocol-common'
import { PositionType } from '@summerfi/sdk-common'
import { ITokenAmount, Position } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * Type for the parameters of ArmadaPosition
 */
export type ArmadaPositionParameters = Omit<IArmadaPositionData, 'type'>

/**
 * @class ArmadaPosition
 * @see IArmadaPosition
 */
export class ArmadaPosition extends Position implements IArmadaPosition {
  /** SIGNATURE */
  readonly [__iarmadaposition__] = __iarmadaposition__

  /** ATTRIBUTES */
  readonly type = PositionType.Armada
  readonly id: IArmadaPositionId
  readonly amount: ITokenAmount

  /** FACTORY */
  static createFrom(params: ArmadaPositionParameters): ArmadaPosition {
    return new ArmadaPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  protected constructor(params: ArmadaPositionParameters) {
    super(params)

    this.id = params.id
    this.amount = params.amount
  }
}

SerializationService.registerClass(ArmadaPosition)
