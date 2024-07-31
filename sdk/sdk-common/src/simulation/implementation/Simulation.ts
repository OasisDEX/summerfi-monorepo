import { SerializationService } from '../../services/SerializationService'
import { SimulationType } from '../enums'
import { ISimulation, ISimulationData, __isimulation__ } from '../interfaces/ISimulation'

/**
 * @name Simulation
 * @see ISimulation
 */
export abstract class Simulation implements ISimulation {
  /** SIGNATURE */
  readonly [__isimulation__] = 'ISimulation'

  /** ATTRIBUTES */
  readonly type: SimulationType

  /** SEALED CONSTRUCTOR */
  protected constructor(params: ISimulationData) {
    this.type = params.type
  }
}

SerializationService.registerClass(Simulation)
