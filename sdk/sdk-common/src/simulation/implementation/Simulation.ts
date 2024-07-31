import { SerializationService } from '../../services/SerializationService'
import { SimulationType } from '../enums'
import { ISimulation, ISimulationData } from '../interfaces/ISimulation'

/**
 * @name Simulation
 * @see ISimulation
 */
export abstract class Simulation implements ISimulation {
  readonly type: SimulationType

  /** Sealed constructor */
  protected constructor(params: ISimulationData) {
    this.type = params.type
  }
}

SerializationService.registerClass(Simulation)
