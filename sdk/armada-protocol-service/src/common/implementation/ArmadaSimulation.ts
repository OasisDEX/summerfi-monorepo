import {
  IArmadaPosition,
  IArmadaSimulation,
  IArmadaSimulationParameters,
} from '@summerfi/armada-protocol-common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * @name ArmadaSimulation
 * @see IArmadaSimulation
 */
export class ArmadaSimulation extends Simulation implements IArmadaSimulation {
  readonly user: IUser
  readonly previousPosition?: IArmadaPosition
  readonly newPosition: IArmadaPosition

  /** Factory method */
  static createFrom(params: IArmadaSimulationParameters): ArmadaSimulation {
    return new ArmadaSimulation(params)
  }

  /** Sealed constructor */
  private constructor(params: IArmadaSimulationParameters) {
    super({
      ...params,
      type: SimulationType.Armada,
    })

    this.user = params.user
    this.previousPosition = params.previousPosition
    this.newPosition = params.newPosition
  }
}

SerializationService.registerClass(ArmadaSimulation)
