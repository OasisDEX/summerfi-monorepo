import {
  IArmadaSimulatedPosition,
  IArmadaSimulatedPositionParameters,
} from '@summerfi/armada-protocol-common'
import { ArmadaPosition } from '../../common/implementation/ArmadaPosition'

/**
 * @class ArmadaSimulatedPosition
 * @see IArmadaSimulatedPosition
 */
export class ArmadaSimulatedPosition extends ArmadaPosition implements IArmadaSimulatedPosition {
  readonly _signature_2 = 'IArmadaSimulatedPosition'

  static createFrom(params: IArmadaSimulatedPositionParameters): ArmadaSimulatedPosition {
    return new ArmadaSimulatedPosition(params)
  }

  private constructor(params: IArmadaSimulatedPositionParameters) {
    super(params)
  }
}

// Not registered in SerializationService on purpose as it is only local to the simulator
