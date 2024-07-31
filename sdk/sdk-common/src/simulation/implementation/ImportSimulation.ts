import { ILendingPosition } from '../../lending-protocols'
import { IExternalLendingPosition } from '../../orders/importing/interfaces/IExternalLendingPosition'
import { SerializationService } from '../../services/SerializationService'
import { SimulationType } from '../enums'
import { IImportSimulation } from '../interfaces/IImportSimulation'
import { Steps } from '../interfaces/Steps'
import { Simulation } from './Simulation'

/**
 * @name ImportSimulation
 * @see IImportSimulation
 */
export class ImportSimulation extends Simulation implements IImportSimulation {
  readonly type: SimulationType.ImportPosition
  readonly sourcePosition: IExternalLendingPosition
  readonly targetPosition: ILendingPosition
  readonly steps: Steps[]

  /** Factory method */
  static createFrom(params: IImportSimulation): ImportSimulation {
    return new ImportSimulation(params)
  }

  /** Sealed constructor */
  private constructor(params: IImportSimulation) {
    super(params)

    this.type = params.type
    this.sourcePosition = params.sourcePosition
    this.targetPosition = params.targetPosition
    this.steps = params.steps
  }
}

SerializationService.registerClass(ImportSimulation)
