import {
  IArmadaPosition,
  IArmadaSimulation,
  IArmadaSimulationData,
  __iarmadasimulation__,
} from '@summerfi/armada-protocol-common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * Type for the parameters of ArmadaSimulation
 */
export type ArmadaSimulationParameters = Omit<IArmadaSimulationData, 'type'>

/**
 * @name RefinanceSimulation
 * @see IRefinanceSimulation
 */
export class ArmadaSimulation extends Simulation implements IArmadaSimulation {
  /** SIGNATURE */
  readonly [__iarmadasimulation__] = __iarmadasimulation__

  /** ATTRIBUTES */
  readonly type = SimulationType.Armada
  readonly user: IUser
  readonly previousPosition?: IArmadaPosition | undefined
  readonly newPosition: IArmadaPosition

  /** FACTORY */
  static createFrom(params: ArmadaSimulationParameters): ArmadaSimulation {
    return new ArmadaSimulation(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaSimulationParameters) {
    super(params)

    this.user = params.user
    this.previousPosition = params.previousPosition
    this.newPosition = params.newPosition
  }
}

SerializationService.registerClass(ArmadaSimulation)
