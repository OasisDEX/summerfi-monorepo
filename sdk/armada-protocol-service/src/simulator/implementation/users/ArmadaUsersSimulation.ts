import {
  IArmadaPosition,
  IArmadaUsersSimulation,
  IArmadaUsersSimulationData,
  __iarmadauserssimulation__,
} from '@summerfi/armada-protocol-common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * Type for the parameters of ArmadaSimulation
 */
export type ArmadaSimulationParameters = Omit<IArmadaUsersSimulationData, 'type'>

/**
 * @name ArmadaUsersSimulation
 * @see IArmadaUsersSimulation
 */
export class ArmadaUsersSimulation extends Simulation implements IArmadaUsersSimulation {
  /** SIGNATURE */
  readonly [__iarmadauserssimulation__] = __iarmadauserssimulation__

  /** ATTRIBUTES */
  readonly type = SimulationType.ArmadaUsers
  readonly user: IUser
  readonly previousPosition: IArmadaPosition
  readonly newPosition: IArmadaPosition

  /** FACTORY */
  static createFrom(params: ArmadaSimulationParameters): ArmadaUsersSimulation {
    return new ArmadaUsersSimulation(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaSimulationParameters) {
    super(params)

    this.user = params.user
    this.previousPosition = params.previousPosition
    this.newPosition = params.newPosition
  }
}

SerializationService.registerClass(ArmadaUsersSimulation)
