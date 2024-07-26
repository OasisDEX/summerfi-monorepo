import { ILendingPosition } from '../../lending-protocols/interfaces/ILendingPosition'
import { SerializationService } from '../../services/SerializationService'
import { SimulatedSwapData } from '../../swap/implementation/SimulatedSwapData'
import { SimulationType } from '../enums'
import { IRefinanceSimulation } from '../interfaces/IRefinanceSimulation'
import { Steps } from '../interfaces/Steps'
import { Simulation } from './Simulation'

/**
 * @name RefinanceSimulation
 * @see IRefinanceSimulation
 */
export class RefinanceSimulation extends Simulation implements IRefinanceSimulation {
  readonly type: SimulationType.Refinance
  readonly sourcePosition: ILendingPosition
  readonly targetPosition: ILendingPosition
  readonly swaps: SimulatedSwapData[]
  readonly steps: Steps[]

  /** Factory method */
  static createFrom(params: IRefinanceSimulation): RefinanceSimulation {
    return new RefinanceSimulation(params)
  }

  /** Sealed constructor */
  private constructor(params: IRefinanceSimulation) {
    super(params)

    this.type = params.type
    this.sourcePosition = params.sourcePosition
    this.targetPosition = params.targetPosition
    this.swaps = params.swaps
    this.steps = params.steps
  }
}

SerializationService.registerClass(RefinanceSimulation)
