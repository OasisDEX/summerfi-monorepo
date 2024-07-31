import {
  IArmadaPosition,
  IArmadaPositionId,
  IArmadaPositionParameters,
} from '@summerfi/armada-protocol-common'
import { PositionType } from '@summerfi/sdk-common'
import { ITokenAmount, Position } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * @class ArmadaPosition
 * @see IArmadaPosition
 */
export class ArmadaPosition extends Position implements IArmadaPosition {
  readonly _signature_1 = 'IArmadaPosition'

  readonly id: IArmadaPositionId
  readonly amount: ITokenAmount

  /** Factory method */
  static createFrom(params: IArmadaPositionParameters): ArmadaPosition {
    return new ArmadaPosition(params)
  }

  /** Constructor */
  protected constructor(params: IArmadaPositionParameters) {
    super({
      ...params,
      type: PositionType.Earn,
    })

    this.id = params.id
    this.amount = params.amount
  }
}

SerializationService.registerClass(ArmadaPosition)
