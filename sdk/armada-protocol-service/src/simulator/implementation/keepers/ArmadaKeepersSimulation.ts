import {
  IArmadaKeepersSimulation,
  IArmadaKeepersSimulationData,
  IArmadaPoolId,
  IArmadaRebalanceData,
  __iarmadakeeperssimulation__,
} from '@summerfi/armada-protocol-common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * Type for the parameters of ArmadaSimulation
 */
export type ArmadaKeepersSimulationParameters = Omit<IArmadaKeepersSimulationData, 'type'>

/**
 * @name ArmadaKeepersSimulation
 * @see IArmadaKeepersSimulation
 */
export class ArmadaKeepersSimulation extends Simulation implements IArmadaKeepersSimulation {
  /** SIGNATURE */
  readonly [__iarmadakeeperssimulation__] = __iarmadakeeperssimulation__

  /** ATTRIBUTES */
  readonly type = SimulationType.ArmadaUsers
  readonly keeper: IUser
  readonly poolId: IArmadaPoolId
  readonly rebalanceData: IArmadaRebalanceData[]

  /** FACTORY */
  static createFrom(params: ArmadaKeepersSimulationParameters): ArmadaKeepersSimulation {
    return new ArmadaKeepersSimulation(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaKeepersSimulationParameters) {
    super(params)

    this.keeper = params.keeper
    this.poolId = params.poolId
    this.rebalanceData = params.rebalanceData
  }
}

SerializationService.registerClass(ArmadaKeepersSimulation)
