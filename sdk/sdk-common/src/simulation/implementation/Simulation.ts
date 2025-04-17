import { SerializationService } from '../../services/SerializationService'
import { SimulationType } from '../enums/SimulationType'
import { ISimulation, ISimulationData, __signature__ } from '../interfaces/ISimulation'

/**
 * Type for the parameters of Simulation
 */
export type SimulationParams = Omit<ISimulationData, 'type'>

/**
 * @name Simulation
 * @see ISimulation
 */
export abstract class Simulation implements ISimulation {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  abstract readonly type: SimulationType

  /** SEALED CONSTRUCTOR */
  protected constructor(_: SimulationParams) {
    // Empty on purpose
  }
}

SerializationService.registerClass(Simulation, { identifier: 'Simulation' })
