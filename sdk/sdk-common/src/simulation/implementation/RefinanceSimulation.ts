import { ILendingPosition } from '../../lending-protocols/interfaces/ILendingPosition'
import { SerializationService } from '../../services/SerializationService'
import { SimulatedSwapData } from '../../swap/implementation/SimulatedSwapData'
import { SimulationType } from '../enums/SimulationType'
import {
  IRefinanceSimulation,
  IRefinanceSimulationData,
  __signature__,
} from '../interfaces/IRefinanceSimulation'
import { Steps } from '../interfaces/Steps'
import { Simulation } from './Simulation'

/**
 * Type for the parameters of RefinanceSimulation
 */
export type RefinanceSimulationParameters = Omit<IRefinanceSimulationData, 'type'>

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
  readonly type = SimulationType.Refinance

  /** FACTORY */
  static createFrom(params: RefinanceSimulationParameters): RefinanceSimulation {
    return new RefinanceSimulation(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: RefinanceSimulationParameters) {
    super(params)

    this.sourcePosition = params.sourcePosition
    this.targetPosition = params.targetPosition
    this.swaps = params.swaps
    this.steps = params.steps
  }
}

SerializationService.registerClass(RefinanceSimulation)
