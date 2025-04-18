import {
  IArmadaSimulation,
  IArmadaSimulationData,
  __iarmadasimulation__,
} from '@summerfi/armada-protocol-common'
import type { IArmadaPosition } from '@summerfi/sdk-common'
import { SerializationService, Simulation, SimulationType, IUser } from '@summerfi/sdk-common'

/**
 * Type for the parameters of ArmadaSimulation
 */
export type ArmadaSimulationParameters = Omit<IArmadaSimulationData, 'type'>

/**
 * @name ArmadaSimulation
 * @see IArmadaSimulation
 */
export class ArmadaSimulation extends Simulation implements IArmadaSimulation {
  /** SIGNATURE */
  readonly [__iarmadasimulation__] = __iarmadasimulation__

  /** ATTRIBUTES */
  readonly type = SimulationType.Armada
  readonly user: IUser
  readonly previousPosition: IArmadaPosition
  readonly newPosition: IArmadaPosition

  /** Factory method */
  static createFrom(params: ArmadaSimulationParameters): ArmadaSimulation {
    return new ArmadaSimulation(params)
  }

  /** Sealed constructor */
  private constructor(params: ArmadaSimulationParameters) {
    super(params)

    this.user = params.user
    this.previousPosition = params.previousPosition
    this.newPosition = params.newPosition
  }
}

SerializationService.registerClass(ArmadaSimulation, { identifier: 'ArmadaSimulation' })
