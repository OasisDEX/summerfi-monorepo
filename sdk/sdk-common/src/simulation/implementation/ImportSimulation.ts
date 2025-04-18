import { ILendingPosition } from '../../lending-protocols/interfaces/ILendingPosition'
import { IExternalLendingPosition } from '../../orders/importing/interfaces/IExternalLendingPosition'
import { SerializationService } from '../../services/SerializationService'
import { SimulationType } from '../enums/SimulationType'
import {
  IImportSimulation,
  IImportSimulationData,
  __signature__,
} from '../interfaces/IImportSimulation'
import { Steps } from '../interfaces/Steps'
import { Simulation } from './Simulation'

/**
 * Type for the parameters of ImportSimulation
 */
export type ImportSimulationParameters = Omit<IImportSimulationData, 'type'>

/**
 * @name ImportSimulation
 * @see IImportSimulation
 */
export class ImportSimulation extends Simulation implements IImportSimulation {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly sourcePosition: IExternalLendingPosition
  readonly targetPosition: ILendingPosition
  readonly steps: Steps[]
  readonly type = SimulationType.ImportPosition

  /** FACTORY */
  static createFrom(params: ImportSimulationParameters): ImportSimulation {
    return new ImportSimulation(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ImportSimulationParameters) {
    super(params)

    this.sourcePosition = params.sourcePosition
    this.targetPosition = params.targetPosition
    this.steps = params.steps
  }
}

SerializationService.registerClass(ImportSimulation, { identifier: 'ImportSimulation' })
