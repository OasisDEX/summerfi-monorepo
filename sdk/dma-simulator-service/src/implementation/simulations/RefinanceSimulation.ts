import { ILendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { Simulation } from '@summerfi/sdk-common/simulation'
import { SimulationType } from '@summerfi/sdk-common/simulation/enums'
import { SimulatedSwapData } from '@summerfi/sdk-common/swap'
import {
  IRefinanceSimulation,
  IRefinanceSimulationParameters,
} from '../../interfaces/IRefinanceSimulation'
import { DMASimulatorSteps } from '../DMASimulatorSteps'

/**
 * @name RefinanceSimulation
 * @see IRefinanceSimulation
 */
export class RefinanceSimulation extends Simulation implements IRefinanceSimulation {
  readonly _signature_1 = 'IRefinanceSimulation'

  readonly sourcePosition: ILendingPosition
  readonly targetPosition: ILendingPosition
  readonly swaps: SimulatedSwapData[]
  readonly steps: DMASimulatorSteps[]

  /** Factory method */
  static createFrom(params: IRefinanceSimulationParameters): RefinanceSimulation {
    return new RefinanceSimulation(params)
  }

  /** Sealed constructor */
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
