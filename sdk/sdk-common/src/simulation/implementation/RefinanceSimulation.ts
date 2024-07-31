import { ILendingPosition } from '../../lending-protocols/interfaces/ILendingPosition'
import { SerializationService } from '../../services/SerializationService'
import { SimulatedSwapData } from '../../swap/implementation/SimulatedSwapData'
import { SimulationType } from '../enums'
import {
  IRefinanceSimulation,
  IRefinanceSimulationParameters,
  __signature__,
} from '../interfaces/IRefinanceSimulation'
import { Steps } from '../interfaces/Steps'
import { Simulation } from './Simulation'

/**
 * @name RefinanceSimulation
 * @see IRefinanceSimulation
 */
export class RefinanceSimulation extends Simulation implements IRefinanceSimulation {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly sourcePosition: ILendingPosition
  readonly targetPosition: ILendingPosition
  readonly swaps: SimulatedSwapData[]
  readonly steps: Steps[]

  /** FACTORY */
  static createFrom(params: IRefinanceSimulationParameters): RefinanceSimulation {
    return new RefinanceSimulation(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IRefinanceSimulationParameters) {
    super({
      ...params,
      type: SimulationType.Refinance,
    })

    this.sourcePosition = params.sourcePosition
    this.targetPosition = params.targetPosition
    this.swaps = params.swaps
    this.steps = params.steps
  }
}

SerializationService.registerClass(RefinanceSimulation)
