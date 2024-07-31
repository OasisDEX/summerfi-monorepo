import { ILendingPosition } from '../../lending-protocols'
import { IExternalLendingPosition } from '../../orders/importing/interfaces/IExternalLendingPosition'
import { SerializationService } from '../../services/SerializationService'
import { SimulationType } from '../enums'
import {
  IImportSimulation,
  IImportSimulationParameters,
  __iimportsimulation__,
} from '../interfaces/IImportSimulation'
import { Steps } from '../interfaces/Steps'
import { Simulation } from './Simulation'

/**
 * @name ImportSimulation
 * @see IImportSimulation
 */
export class ImportSimulation extends Simulation implements IImportSimulation {
  /** SIGNATURE */
  readonly [__iimportsimulation__] = 'IImportSimulation'

  /** ATTRIBUTES */
  readonly sourcePosition: IExternalLendingPosition
  readonly targetPosition: ILendingPosition
  readonly steps: Steps[]

  /** FACTORY */
  static createFrom(params: IImportSimulationParameters): ImportSimulation {
    return new ImportSimulation(params)
  }

  /** SEALED CONSTRUCTOR */
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
