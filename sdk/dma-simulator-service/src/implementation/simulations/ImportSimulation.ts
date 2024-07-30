import { ILendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { IExternalLendingPosition } from '@summerfi/sdk-common/orders'
import { SerializationService } from '@summerfi/sdk-common/services'
import { Simulation } from '@summerfi/sdk-common/simulation'
import { SimulationType } from '@summerfi/sdk-common/simulation/enums'
import { IImportSimulation, IImportSimulationParameters } from '../../interfaces/IImportSimulation'
import { DMASimulatorSteps } from '../DMASimulatorSteps'

/**
 * @name ImportSimulation
 * @see IImportSimulation
 */
export class ImportSimulation extends Simulation implements IImportSimulation {
  readonly sourcePosition: IExternalLendingPosition
  readonly targetPosition: ILendingPosition
  readonly steps: DMASimulatorSteps[]

  /** Factory method */
  static createFrom(params: IImportSimulationParameters): ImportSimulation {
    return new ImportSimulation(params)
  }

  /** Sealed constructor */
  private constructor(params: IImportSimulationParameters) {
    super({
      ...params,
      type: SimulationType.ImportPosition,
    })

    this.sourcePosition = params.sourcePosition
    this.targetPosition = params.targetPosition
    this.steps = params.steps
  }
}

SerializationService.registerClass(ImportSimulation)
