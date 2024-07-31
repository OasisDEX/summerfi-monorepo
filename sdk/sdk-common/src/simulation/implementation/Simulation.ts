import { SerializationService } from '../../services/SerializationService'
import { SimulationType } from '../enums'
import { ISimulation, ISimulationData, __signature__ } from '../interfaces/ISimulation'

/**
 * @name Simulation
 * @see ISimulation
 */
export abstract class Simulation implements ISimulation {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type: SimulationType

  /** SEALED CONSTRUCTOR */
  protected constructor(params: ISimulationData) {
    this.type = params.type
  }
}

SerializationService.registerClass(Simulation)
