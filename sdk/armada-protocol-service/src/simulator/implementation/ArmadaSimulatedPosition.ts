import {
  IArmadaSimulatedPosition,
  IArmadaSimulatedPositionData,
  __iarmadasimulatedposition__,
} from '@summerfi/armada-protocol-common'
import { ArmadaPosition } from '../../common/implementation/ArmadaPosition'

/**
 * Type for the parameters of ArmadaSimulatedPosition
 */
export type ArmadaSimulatedPositionParameters = Omit<IArmadaSimulatedPositionData, ''>

/**
 * @class ArmadaSimulatedPosition
 * @see IArmadaSimulatedPosition
 */
export class ArmadaSimulatedPosition extends ArmadaPosition implements IArmadaSimulatedPosition {
  readonly [__iarmadasimulatedposition__] = __iarmadasimulatedposition__

  static createFrom(params: ArmadaSimulatedPositionParameters): ArmadaSimulatedPosition {
    return new ArmadaSimulatedPosition(params)
  }

  private constructor(params: ArmadaSimulatedPositionParameters) {
    super(params)
  }
}

// Not registered in SerializationService on purpose as it is only local to the simulator
